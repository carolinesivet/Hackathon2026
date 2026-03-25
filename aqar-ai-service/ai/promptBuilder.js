const METRIC_TITLES = {
  '1.1':    'Number of courses offered by the institution across all programmes during the year (Metric 1.1)',
  '1.1.3':  'Teachers participating in curriculum development and academic body activities (Metric 1.1.3)',
  '1.2.1':  'Number of programmes with CBCS/Elective Course System implemented (Metric 1.2.1)',
  '1.2.2':  'Add-on/Certificate programmes offered and student enrolment (Metric 1.2.2 & 1.2.3)',
  '1.3.2':  'Courses with experiential learning through project/field/internship work (Metric 1.3.2)',
  '1.3.3':  'Students undertaking project work, field work, or internships (Metric 1.3.3)',
  '2.1':    'Number of students enrolled during the year (Metric 2.1)',
  '2.1.1':  'Enrolment against sanctioned seats, programme-wise (Metric 2.1.1)',
  '2.1.2':  'Seats filled against reserved categories — SC/ST/OBC/General (Metric 2.1.2)',
  '2.4.1':  'Full-time teachers against sanctioned posts and teaching experience (Metric 2.4.1 & 2.4.3)',
  '2.6.3':  'Pass percentage of students in final year university examinations (Metric 2.6.3)',
  '2.4.2':  'Full-time teachers with Ph.D. and recognition as research guides (Metric 2.4.2, 3.1.2, 3.3.1)',
  '3.1':    'Full-time teachers — master list with profile and gender data (Metric 3.1)',
  '3.1.1':  'Research grants received from government and non-government agencies (Metric 3.1.1 & 3.1.3)',
  '3.2.2':  'Workshops and seminars on Research Methodology, IPR, and Entrepreneurship (Metric 3.2.2)',
  '3.3.2':  'Research papers published in UGC-listed journals (Metric 3.3.2)',
  '3.3.3':  'Books, book chapters, and conference proceedings published (Metric 3.3.3)',
  '3.4.2':  'Awards and recognitions received for extension activities (Metric 3.4.2)',
  '3.4.3':  'Extension and outreach programmes with student participation (Metric 3.4.3 & 3.4.4)',
  '3.5.1':  'Collaborative activities for research, faculty exchange, and student internship (Metric 3.5.1)',
  '3.5.2':  'Functional MoUs with institutions, industries, and corporate houses (Metric 3.5.2)',
  '4.1.3':  'Classrooms and seminar halls with ICT-enabled facilities (Metric 4.1.3)',
  '4.1.4':  'Expenditure on infrastructure augmentation and maintenance (Metric 4.1.4 & 4.4.1)',
  '4.2.2':  'Library e-resource subscriptions and expenditure (Metric 4.2.2 & 4.2.3)',
  '5.1.1':  'Students benefited by scholarships from government and institutional schemes (Metric 5.1.1 & 5.1.2)',
  '5.1.3':  'Capacity building and skills enhancement initiatives (Metric 5.1.3)',
  '5.1.4':  'Guidance for competitive examinations and career counselling (Metric 5.1.4)',
  '5.2.1':  'Placement of outgoing students (Metric 5.2.1)',
  '5.2.2':  'Students progressing to higher education (Metric 5.2.2)',
  '5.2.3':  'Students qualifying in state/national/international examinations (Metric 5.2.3)',
  '5.3.1':  'Awards and medals in sports and cultural activities (Metric 5.3.1)',
  '5.3.3':  'Sports and cultural events/competitions participated in (Metric 5.3.3)',
  '6.2.3':  'Implementation of e-governance across institutional operations (Metric 6.2.3)',
  '6.3.2':  'Financial support provided to teachers for conferences and professional bodies (Metric 6.3.2)',
  '6.3.3':  'Professional development and administrative training programmes (Metric 6.3.3)',
  '6.3.4':  'Faculty Development Programmes (FDP) attended by teachers (Metric 6.3.4)',
  '6.4.2':  'Funds and grants received from non-government bodies (Metric 6.4.2)',
  '6.5.3':  'Quality assurance initiatives including IQAC, NIRF, ISO, and NBA (Metric 6.5.3)',
  '7.1.1':  'Gender equity promotion programmes organised by the institution (Metric 7.1.1)',
  '7.1.3':  'Facilities for differently-abled (Divyangjan) students (Metric 7.1.3)',
  '7.1.4':  'Inclusion and situatedness initiatives (Metric 7.1.4)',
  '7.1.5':  'Institutional code of conduct on human values and professional ethics (Metric 7.1.5)',
  '7.1.11': 'National and international commemorative days, events, and festivals (Metric 7.1.11)',
}

// ── Metric-specific paragraph structure guidance ───────────────────────────────
const PARAGRAPH_STRUCTURES = {
  '1.1':    '1) Describe the range of programmes and courses offered. 2) Mention the years of introduction. 3) Explain curriculum planning process. 4) State alignment with university/regulatory framework.',
  '1.1.3':  '1) State the number of teachers involved. 2) Name the academic bodies they participate in. 3) Describe the nature of participation. 4) Highlight the outcome/impact on curriculum quality.',
  '1.2.1':  '1) State CBCS implementation coverage. 2) Describe the elective course system. 3) Mention years of implementation. 4) Highlight student choice and flexibility.',
  '1.2.2':  '1) Mention the Add-on/Certificate programmes offered. 2) State enrolment numbers. 3) Describe completion rates. 4) Highlight skill development outcomes.',
  '1.3.2':  '1) Describe experiential learning courses. 2) State the number of students engaged. 3) Explain programme types (project/field/internship). 4) Highlight practical learning outcomes.',
  '1.3.3':  '1) State the number of students undertaking practical work. 2) Describe programme coverage. 3) Explain the learning methodology. 4) Note outcomes and competency development.',
  '2.1':    '1) State total student enrolment. 2) Mention the years covered. 3) Describe the admission process. 4) Highlight diversity or reach.',
  '2.1.1':  '1) List the programmes. 2) State sanctioned vs admitted figures. 3) Mention fill rate. 4) Highlight institutional capacity utilisation.',
  '2.1.2':  '1) Describe reservation category coverage. 2) State category-wise admission numbers. 3) Note compliance with government norms. 4) Highlight inclusivity.',
  '2.4.1':  '1) State the total number of full-time teachers. 2) Mention designations and departments. 3) Highlight average teaching experience. 4) Describe appointment nature and stability.',
  '2.6.3':  '1) State pass percentage. 2) Mention programmes covered. 3) Describe evaluation support mechanisms. 4) Highlight institutional efforts to improve outcomes.',
  '2.4.2':  '1) State the number of Ph.D.-qualified teachers. 2) Mention research guides. 3) Describe Ph.D. scholars registered. 4) Highlight the institution\'s research culture.',
  '3.1.1':  '1) State research projects and funding amounts. 2) Name funding agencies. 3) Describe departments involved. 4) Highlight research impact and institutional support.',
  '3.2.2':  '1) State number of workshops/seminars. 2) Name key events. 3) Describe participation. 4) Highlight research awareness and capacity building.',
  '3.3.2':  '1) State number of UGC-listed publications. 2) Mention journals and departments. 3) Describe faculty research engagement. 4) Highlight research visibility.',
  '3.3.3':  '1) State books and conference papers published. 2) Mention national vs international ratio. 3) Name notable publishers. 4) Highlight faculty scholarly contributions.',
  '3.4.3':  '1) Describe extension activities. 2) State student participation numbers. 3) Name organising agencies/schemes. 4) Highlight social responsibility outcomes.',
  '3.5.2':  '1) State number of MoUs. 2) Name partner organisations. 3) Describe activities under MoUs. 4) Highlight student/faculty benefits.',
  '4.1.3':  '1) State number of ICT-enabled rooms. 2) List ICT facility types. 3) Describe smart classroom ecosystem. 4) Highlight impact on teaching-learning.',
  '5.1.1':  '1) State beneficiary numbers. 2) Name scholarship schemes. 3) Mention amounts disbursed. 4) Highlight institutional commitment to student welfare.',
  '5.2.1':  '1) State number of students placed. 2) Name employers. 3) Mention programmes. 4) Highlight placement support mechanisms.',
  '6.2.3':  '1) List e-governance domains implemented. 2) Describe technology used. 3) Mention implementation years. 4) Highlight efficiency improvements.',
  '6.5.3':  '1) Describe IQAC activities. 2) Mention NIRF/ISO/NBA status. 3) Describe quality audit processes. 4) Highlight continuous improvement outcomes.',
  '7.1.1':  '1) Describe gender equity programmes. 2) State participation numbers. 3) Mention specific activities. 4) Highlight gender sensitisation outcomes.',
  '7.1.3':  '1) List available facilities for differently-abled students. 2) State beneficiary numbers. 3) Describe institutional commitment. 4) Note compliance and accessibility.',
  '7.1.11': '1) List commemorative events organised. 2) State participation numbers. 3) Describe civic and cultural purpose. 4) Highlight student engagement.',
}

const DEFAULT_STRUCTURE = '1) Describe the institutional practice. 2) Explain the implementation process. 3) Mention monitoring mechanisms. 4) State the outcomes achieved.'

/**
 * Build the full prompt string for the LLM.
 *
 * @param {string} metricId   - e.g. "1.1"
 * @param {object} facts      - output of ruleEngine.extractFacts()
 * @param {object} options    - { departmentName, aqarYear, collegeName }
 */
function buildPrompt(metricId, facts, options = {}) {
  const { departmentName = '', aqarYear = '2023-24', collegeName = 'the institution' } = options
  const title     = METRIC_TITLES[metricId] || `NAAC AQAR Metric ${metricId}`
  const structure = PARAGRAPH_STRUCTURES[metricId] || DEFAULT_STRUCTURE

  // Build the facts block — clean key-value lines, NO raw DB data
  const factsLines = Object.entries(facts)
    .filter(([k, v]) => k !== 'hasData' && v !== undefined && v !== null && v !== '' && !Array.isArray(v))
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join('\n')

  const noDataFallback = !facts.hasData
    ? '\nNOTE: No specific data has been recorded yet for this metric. Write a professional paragraph describing standard institutional practices in this area, using the institutional tone specified below.'
    : ''

  return `You are a professional NAAC AQAR report writer for an Indian college.
Your task is to write ONE paragraph for the following metric in the Annual Quality Assurance Report.

METRIC: ${title}
DEPARTMENT: ${departmentName || 'Not specified'}
AQAR YEAR: ${aqarYear}
INSTITUTION: ${collegeName}
${noDataFallback}

STRUCTURED FACTS (use ONLY these facts — do NOT invent additional data):
${factsLines || '  - Standard institutional practices apply'}

KEY INSIGHT: ${facts.signal || 'The institution follows established academic practices.'}

PARAGRAPH STRUCTURE TO FOLLOW:
${structure}

WRITING INSTRUCTIONS (FOLLOW STRICTLY):
- Write exactly ONE paragraph of 140 to 170 words.
- Use formal NAAC AQAR institutional tone throughout.
- Begin with phrases like: "The institution ensures...", "The college adopts...", "A structured process is followed...", "In accordance with NAAC guidelines..."
- Do NOT use bullet points, numbered lists, or sub-headings.
- Do NOT repeat the metric number or title in the paragraph.
- Do NOT include JSON, code, or technical formatting.
- Do NOT invent facts, names, or figures not present in the structured facts above.
- Use passive or institutional voice consistently.
- Naturally integrate the numerical data from the facts section.
- End with a sentence on outcomes, impact, or continuous improvement.

OUTPUT: Return ONLY the paragraph text. No introduction, no explanation, no metadata.`
}

module.exports = { buildPrompt, METRIC_TITLES }