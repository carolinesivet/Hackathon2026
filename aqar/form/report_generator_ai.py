import io
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)

from .report_generator import (
    METRIC_META, CRITERIA_ORDER,
    _get_rows, _dept_summary, _page_cb,
    C_DARK, C_MID, C_LIGHT, C_ACCENT, C_WHITE, C_GREY, PAGE_W
)

from .ai_service import generate_ai_paragraphs


def generate_pdf_with_ai(dept, college_name='', aqar_year=''):
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=1.8*cm,
        title=f'AQAR {aqar_year} — {dept.name}')

    def PS(name, **kw): return ParagraphStyle(name, **kw)

    S_MAIN  = PS('MT', fontName='Helvetica-Bold', fontSize=20,
                  textColor=C_ACCENT, alignment=TA_CENTER, spaceAfter=4)
    S_SUB   = PS('ST', fontName='Helvetica',      fontSize=12,
                  textColor=C_WHITE,  alignment=TA_CENTER, spaceAfter=4)
    S_BODY  = PS('BD', fontName='Helvetica',      fontSize=9,
                  textColor=colors.HexColor('#222222'), leading=14, spaceAfter=3)
    S_SMALL = PS('SM', fontName='Helvetica-Oblique', fontSize=8,
                  textColor=colors.HexColor('#555555'), spaceAfter=6)
    S_CH    = PS('CH', fontName='Helvetica-Bold', fontSize=11, textColor=C_WHITE)
    S_MH    = PS('MH', fontName='Helvetica-Bold', fontSize=10, textColor=C_WHITE)
    S_TH    = PS('TH', fontName='Helvetica-Bold', fontSize=8,
                  textColor=C_WHITE, alignment=TA_CENTER)
    S_TD    = PS('TD', fontName='Helvetica',      fontSize=8,
                  textColor=colors.HexColor('#1a1a1a'), leading=11)
    S_LBL   = PS('IL', fontName='Helvetica-Bold', fontSize=10, textColor=C_DARK)
    S_VAL   = PS('IV', fontName='Helvetica',      fontSize=10,
                  textColor=colors.HexColor('#222222'))
    # AI paragraph style — justified, slightly larger, blue-left-border feel
    S_AI    = PS('AI', fontName='Times-Roman',    fontSize=10,
                  textColor=colors.HexColor('#1a2744'),
                  leading=16, alignment=TA_JUSTIFY,
                  leftIndent=8, rightIndent=8,
                  spaceBefore=6, spaceAfter=8)
    S_AI_LBL= PS('AIL', fontName='Helvetica-BoldOblique', fontSize=8,
                  textColor=colors.HexColor('#2d4a8a'),
                  spaceBefore=6, spaceAfter=2)

    def _banner(text, style, bg=C_DARK, accent=None, pad_top=18, pad_bot=18):
        t = Table([[Paragraph(text, style)]], colWidths=[PAGE_W])
        ts = [('BACKGROUND',(0,0),(-1,-1),bg),
              ('TOPPADDING',(0,0),(-1,-1),pad_top),
              ('BOTTOMPADDING',(0,0),(-1,-1),pad_bot),
              ('LEFTPADDING',(0,0),(-1,-1),14)]
        if accent:
            ts.append(('LINEBELOW',(0,0),(-1,-1),4,accent))
        t.setStyle(TableStyle(ts))
        return t

    def _pct_color(pct):
        if pct == 100: return colors.HexColor('#166534')
        if pct >= 50:  return colors.HexColor('#1e40af')
        return colors.HexColor('#b91c1c')

    # ── Generate AI paragraphs ─────────────────────────────────────────────────
    print(f'[Report] Generating AI paragraphs for {dept.name}...')
    ai_paragraphs = generate_ai_paragraphs(dept, college_name, aqar_year)
    ai_available  = bool(ai_paragraphs)
    print(f'[Report] AI paragraphs: {len(ai_paragraphs)} generated, fallback={not ai_available}')

    # ── Build story ────────────────────────────────────────────────────────────
    story = []
    story.append(Spacer(1, 1.2*cm))

    # Title
    story.append(_banner('ANNUAL QUALITY ASSURANCE REPORT', S_MAIN, C_DARK, C_ACCENT))
    story.append(Spacer(1, 0.2*cm))
    story.append(_banner(f'Yearly Status Report  \u2014  {aqar_year or "2023-24"}', S_SUB, C_MID, pad_top=8, pad_bot=8))
    story.append(Spacer(1, 0.8*cm))

    # Institution info
    stream_lbl = 'Aided' if dept.stream == 'aided' else 'Self Finance'
    hod_name   = str(dept.hod) if hasattr(dept, 'hod') and dept.hod else '\u2014'
    info_rows  = [
        ('Name of the Institution',  college_name or '\u2014'),
        ('Department',               dept.name),
        ('Stream',                   stream_lbl),
        ('Head of Department (HOD)', hod_name),
        ('AQAR Year',                aqar_year or '\u2014'),
        ('Date of Generation',       datetime.now().strftime('%d %B %Y, %I:%M %p')),
        ('AI-Generated Content',     'Yes' if ai_available else 'No (data-only mode)'),
        ('Status',                   'Submitted to Admin \u2014 Data Locked'),
    ]
    info_table = Table(
        [[Paragraph(l, S_LBL), Paragraph(v, S_VAL)] for l, v in info_rows],
        colWidths=[6*cm, PAGE_W - 6*cm]
    )
    istyle = []
    for i in range(len(info_rows)):
        bg = C_LIGHT if i % 2 == 0 else C_GREY
        istyle += [('BACKGROUND',(0,i),(-1,i),bg),
                   ('TOPPADDING',(0,i),(-1,i),7), ('BOTTOMPADDING',(0,i),(-1,i),7),
                   ('LEFTPADDING',(0,i),(-1,i),10),
                   ('GRID',(0,i),(-1,i),0.5,colors.HexColor('#cccccc'))]
    info_table.setStyle(TableStyle(istyle))
    story.append(info_table)
    story.append(Spacer(1, 0.8*cm))

    # Summary
    summary, tf, tt = _dept_summary(dept)
    overall_pct = round((tf / tt) * 100) if tt else 0

    story.append(_banner('CRITERION-WISE DATA COMPLETION SUMMARY', S_CH, pad_top=10, pad_bot=10))

    TH2 = PS('TH2', fontName='Helvetica-Bold', fontSize=8, textColor=C_WHITE, alignment=TA_CENTER)
    CTR = PS('CTR', fontName='Helvetica',      fontSize=9, alignment=TA_CENTER)

    sum_rows = [[Paragraph(h, TH2) for h in ['Criterion','Description','Filled','Total','Completion %']]]
    for s in summary:
        pc = _pct_color(s['pct'])
        PCT_S = PS(f"P{s['pct']}", fontName='Helvetica-Bold', fontSize=9, textColor=pc, alignment=TA_CENTER)
        sum_rows.append([
            Paragraph(s['criterion'], S_BODY), Paragraph(s['subtitle'], S_BODY),
            Paragraph(str(s['filled']), CTR),  Paragraph(str(s['total']), CTR),
            Paragraph(f"{s['pct']}%", PCT_S),
        ])
    TOT_C = PS('TC', fontName='Helvetica-Bold', fontSize=9, textColor=C_WHITE, alignment=TA_CENTER)
    TOT_W = PS('TW', fontName='Helvetica-Bold', fontSize=9, textColor=C_WHITE)
    sum_rows.append([
        Paragraph('TOTAL', TOT_W), Paragraph('', S_BODY),
        Paragraph(str(tf), TOT_C), Paragraph(str(tt), TOT_C),
        Paragraph(f'{overall_pct}%', TOT_C),
    ])

    sum_t = Table(sum_rows, colWidths=[3.8*cm, 7*cm, 2.4*cm, 2.4*cm, 2.4*cm])
    sts = [
        ('BACKGROUND',(0,0),(-1,0),C_MID),
        ('BACKGROUND',(0,len(sum_rows)-1),(-1,len(sum_rows)-1),C_DARK),
        ('GRID',(0,0),(-1,-1),0.5,colors.HexColor('#cccccc')),
        ('TOPPADDING',(0,0),(-1,-1),5), ('BOTTOMPADDING',(0,0),(-1,-1),5),
        ('LEFTPADDING',(0,0),(-1,-1),6), ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
    ]
    for i in range(1, len(sum_rows) - 1):
        sts.append(('BACKGROUND',(0,i),(-1,i), C_LIGHT if i%2==1 else C_WHITE))
    sum_t.setStyle(TableStyle(sts))
    story.append(sum_t)

    # ── Criterion sections ─────────────────────────────────────────────────────
    for crit_name, crit_sub, metric_ids in CRITERIA_ORDER:
        story.append(PageBreak())
        story.append(_banner(f'{crit_name}: {crit_sub}', S_CH, C_DARK, C_ACCENT, 12, 12))
        story.append(Spacer(1, 0.4*cm))

        for mid in metric_ids:
            if mid not in METRIC_META:
                continue
            model_name, fields, headers = METRIC_META[mid]
            rows = _get_rows(dept, model_name, fields)

            block = []
            block.append(_banner(f'Metric {mid}', S_MH, C_MID, pad_top=7, pad_bot=7))

            # ── AI qualitative paragraph ───────────────────────────────────
            ai_text = ai_paragraphs.get(mid, '').strip()
            if ai_text:
                block.append(Paragraph('Qualitative Description', S_AI_LBL))
                # AI text box with left blue border
                ai_box = Table(
                    [[Paragraph(ai_text, S_AI)]],
                    colWidths=[PAGE_W]
                )
                ai_box.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0f4fa')),
                    ('LINEBEFORE',  (0,0), (0,-1),  3, C_MID),
                    ('TOPPADDING',  (0,0), (-1,-1), 10),
                    ('BOTTOMPADDING',(0,0),(-1,-1), 10),
                    ('LEFTPADDING', (0,0), (-1,-1), 14),
                    ('RIGHTPADDING',(0,0), (-1,-1), 10),
                ]))
                block.append(ai_box)
                block.append(Spacer(1, 0.2*cm))

            if not rows:
                block.append(Paragraph(
                    'No quantitative data entered for this metric.' if ai_text else
                    'No data entered for this metric.',
                    S_SMALL))
                block.append(Spacer(1, 0.2*cm))
                story.append(KeepTogether(block))
                continue

            if ai_text:
                block.append(Paragraph('Supporting Data', S_AI_LBL))

            n  = len(headers)
            cw = PAGE_W / n
            td = [[Paragraph(h, S_TH) for h in headers]]
            for row_data in rows:
                td.append([Paragraph(v or '\u2014', S_TD) for v in row_data])

            t = Table(td, colWidths=[cw] * n, repeatRows=1)
            ts = [
                ('BACKGROUND',(0,0),(-1,0),C_MID),
                ('GRID',(0,0),(-1,-1),0.5,colors.HexColor('#cccccc')),
                ('TOPPADDING',(0,0),(-1,-1),4), ('BOTTOMPADDING',(0,0),(-1,-1),4),
                ('LEFTPADDING',(0,0),(-1,-1),4), ('VALIGN',(0,0),(-1,-1),'TOP'),
            ]
            for i in range(1, len(td)):
                ts.append(('BACKGROUND',(0,i),(-1,i), C_LIGHT if i%2==1 else C_WHITE))
            t.setStyle(TableStyle(ts))
            block.append(t)
            block.append(Paragraph(f'Total records: {len(rows)}', S_SMALL))
            block.append(Spacer(1, 0.3*cm))
            story.append(KeepTogether(block))

    doc.build(story, onFirstPage=_page_cb, onLaterPages=_page_cb)
    buf.seek(0)
    return buf.read()