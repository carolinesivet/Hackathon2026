function plural(n, word, plural) {
  return n === 1 ? `1 ${word}` : `${n} ${plural || word + 's'}`
}

function listProse(arr, max = 3) {
  if (!arr || !arr.length) return ''
  const items = arr.slice(0, max).map(String)
  if (items.length === 1) return items[0]
  const last = items.pop()
  return items.join(', ') + ' and ' + last
}
function yearTrend(years) {
  if (!years || years.length < 2) return 'consistently'
  return 'across multiple academic years'
}

const rules = {

  '1.1': (ctx) => ({
    scale:      ctx.totalPrograms > 10 ? 'a wide range of' : 'several',
    courses:    plural(ctx.totalCourses, 'course'),
    programs:   plural(ctx.totalPrograms, 'programme'),
    timeSpan:   yearTrend(ctx.years),
    programList:listProse(ctx.programs),
    yearRange:  ctx.years.length >= 2 ? `${ctx.years[0]} to ${ctx.latestYear}` : ctx.latestYear,
    signal:     ctx.totalCourses > 20
      ? 'The institution offers a comprehensive and diverse range of courses.'
      : 'The institution offers a structured set of courses across programmes.',
  }),

  '1.1.3': (ctx) => ({
    teacherCount:  plural(ctx.totalTeachers, 'teacher'),
    bodyCount:     plural(ctx.totalBodies, 'academic body', 'academic bodies'),
    bodyList:      listProse(ctx.bodies),
    timeSpan:      yearTrend(ctx.years),
    signal:        ctx.totalTeachers > 5
      ? 'A significant number of faculty members actively participate in curriculum development.'
      : 'Faculty members are engaged in curriculum and assessment activities.',
  }),

  '1.2.1': (ctx) => ({
    programs:     plural(ctx.totalPrograms, 'programme'),
    cbcsCount:    ctx.cbcsPrograms,
    cbcsCoverage: ctx.totalPrograms > 0
      ? `${Math.round((ctx.cbcsPrograms / ctx.totalPrograms) * 100)}%`
      : '0%',
    signal:       ctx.cbcsPrograms === ctx.totalPrograms
      ? 'All programmes have successfully implemented CBCS.'
      : `${ctx.cbcsPrograms} out of ${ctx.totalPrograms} programmes have implemented CBCS.`,
    timeSpan:     yearTrend(ctx.years),
  }),

  '1.2.2': (ctx) => ({
    courses:       plural(ctx.totalCourses, 'Add-on/Certificate programme'),
    enrolled:      ctx.totalEnrolled,
    completing:    ctx.totalCompleting,
    completionRate:ctx.totalEnrolled > 0
      ? `${Math.round((ctx.totalCompleting / ctx.totalEnrolled) * 100)}%`
      : '0%',
    courseList:    listProse(ctx.courseNames),
    signal:        ctx.totalEnrolled > 200
      ? 'Strong student demand for Add-on and Certificate programmes is evident.'
      : 'Students are actively enrolling in skill-enhancement programmes.',
    timeSpan:      yearTrend(ctx.years),
  }),

  '1.3.2': (ctx) => ({
    courses:     plural(ctx.totalCourses, 'course'),
    students:    plural(ctx.totalStudents, 'student'),
    programs:    listProse(ctx.programs),
    courseList:  listProse(ctx.courses),
    signal:      ctx.totalStudents > 100
      ? 'Experiential learning is embedded across programmes with significant student participation.'
      : 'The institution integrates project work and field internships into its curriculum.',
  }),

  '1.3.3': (ctx) => ({
    students:  plural(ctx.totalStudents, 'student'),
    programs:  plural(ctx.totalPrograms, 'programme'),
    progList:  listProse(ctx.programs),
    signal:    ctx.totalStudents > 200
      ? 'A large proportion of students engage in hands-on project and field work.'
      : 'Students undertake meaningful project-based and field learning experiences.',
  }),

  '2.1': (ctx) => ({
    students:  plural(ctx.totalStudents, 'student'),
    yearRange: ctx.years.length >= 2 ? `${ctx.years[0]} to ${ctx.latestYear}` : ctx.latestYear,
    signal:    ctx.totalStudents > 500
      ? 'The institution has robust student enrolment demonstrating wide reach.'
      : 'The institution maintains consistent student enrolment records.',
  }),

  '2.1.1': (ctx) => ({
    programs:    plural(ctx.totalPrograms, 'programme'),
    sanctioned:  ctx.totalSanctioned,
    admitted:    ctx.totalAdmitted,
    fillRate:    `${ctx.fillRate}%`,
    signal:      parseFloat(ctx.fillRate) >= 90
      ? 'The institution demonstrates excellent seat utilisation across all programmes.'
      : 'The institution ensures adequate admission against sanctioned seats.',
  }),

  '2.1.2': (ctx) => ({
    sc:       ctx.totalAdmittedSC,
    st:       ctx.totalAdmittedST,
    obc:      ctx.totalAdmittedOBC,
    reserved: ctx.totalReserved,
    yearRange:ctx.years.length >= 2 ? `${ctx.years[0]} to ${ctx.latestYear}` : ctx.latestYear,
    signal:   ctx.totalReserved > 200
      ? 'The institution demonstrates strong commitment to inclusive admission for reserved categories.'
      : 'The institution fulfils its obligations under the government reservation policy.',
  }),

  '2.4.1': (ctx) => ({
    teachers:      plural(ctx.totalTeachers, 'full-time teacher'),
    avgExperience: `${ctx.avgExperience} years`,
    permanent:     ctx.permanentCount,
    designations:  listProse(ctx.designations),
    departments:   listProse(ctx.departments),
    signal:        ctx.avgExperience >= 10
      ? 'The institution has a highly experienced and stable teaching faculty.'
      : 'The institution maintains a qualified and dedicated teaching workforce.',
  }),

  '2.6.3': (ctx) => ({
    programs:   plural(ctx.totalPrograms, 'programme'),
    appeared:   ctx.totalAppeared,
    passed:     ctx.totalPassed,
    passRate:   `${ctx.passRate}%`,
    signal:     parseFloat(ctx.passRate) >= 80
      ? 'The institution achieves an excellent student pass rate in final year examinations.'
      : parseFloat(ctx.passRate) >= 60
        ? 'The institution maintains a satisfactory pass percentage across programmes.'
        : 'The institution continues to work towards improving student pass rates.',
  }),

  '2.4.2': (ctx) => ({
    phDTeachers:   plural(ctx.totalPhDTeachers, 'teacher'),
    guides:        ctx.researchGuides,
    scholars:      ctx.totalScholars,
    qualifications:listProse(ctx.qualifications),
    signal:        ctx.totalPhDTeachers > 20
      ? 'The institution has a strong research culture with a large proportion of PhD-qualified faculty.'
      : 'The institution nurtures research expertise through qualified faculty and active research guides.',
  }),

  '3.1.1': (ctx) => ({
    projects:      plural(ctx.totalProjects, 'research project'),
    govtProjects:  ctx.govtProjects,
    nonGovt:       ctx.nonGovtProjects,
    amount:        `Rs. ${ctx.totalAmount} Lakhs`,
    agencies:      listProse(ctx.agencies),
    departments:   listProse(ctx.departments),
    signal:        parseFloat(ctx.totalAmount) > 10
      ? 'The institution has successfully mobilised substantial research funding.'
      : ctx.totalProjects > 0
        ? 'The institution has secured external research grants to support faculty-led projects.'
        : 'Research funding activities are being initiated at the institutional level.',
  }),

  '3.2.2': (ctx) => ({
    events:       plural(ctx.totalEvents, 'workshop/seminar'),
    participants: ctx.totalParticipants,
    eventList:    listProse(ctx.eventNames),
    timeSpan:     yearTrend(ctx.years),
    signal:       ctx.totalEvents >= 3
      ? 'The institution actively promotes a research and innovation culture through regular workshops.'
      : 'The institution organises workshops to build research capacity among students and faculty.',
  }),

  '3.3.2': (ctx) => ({
    papers:    plural(ctx.totalPapers, 'research paper'),
    journals:  plural(ctx.totalJournals, 'UGC-listed journal'),
    depts:     listProse(ctx.departments),
    timeSpan:  yearTrend(ctx.years),
    signal:    ctx.totalPapers > 10
      ? 'Faculty members demonstrate strong research output with significant UGC-listed publications.'
      : 'Faculty members actively contribute to UGC-listed journals, reflecting their research engagement.',
  }),

  '3.3.3': (rows) => ({
    total:         plural(rows.totalPublications, 'publication'),
    international: rows.international,
    national:      rows.national,
    publishers:    listProse(rows.publishers),
    signal:        rows.international > rows.national
      ? 'The institution has a strong international publication presence.'
      : 'Faculty members contribute to both national and international publications.',
  }),

  '3.4.3': (ctx) => ({
    activities:   plural(ctx.totalActivities, 'extension activity', 'extension activities'),
    participants: ctx.totalParticipants,
    actList:      listProse(ctx.activities),
    schemes:      listProse(ctx.schemes),
    signal:       ctx.totalParticipants > 300
      ? 'A large number of students actively engage in community outreach and extension activities.'
      : 'The institution organises meaningful extension activities involving students in social service.',
  }),

  '3.5.2': (ctx) => ({
    mous:          plural(ctx.totalMOUs, 'functional MoU'),
    organisations: listProse(ctx.organisations),
    participants:  ctx.participants,
    signal:        ctx.totalMOUs >= 3
      ? 'The institution maintains active industry-academia partnerships through functional MoUs.'
      : 'The institution has established collaborative partnerships with external organisations.',
  }),

  '4.1.3': (ctx) => ({
    rooms:    plural(ctx.totalRooms, 'classroom/seminar hall'),
    ictTypes: listProse(ctx.ictTypes),
    signal:   ctx.totalRooms > 30
      ? 'The institution has extensively equipped its classrooms with state-of-the-art ICT infrastructure.'
      : 'The institution provides ICT-enabled learning environments for effective teaching.',
  }),

  '5.1.1': (ctx) => ({
    govtStudents: ctx.govtStudents,
    instStudents: ctx.instStudents,
    total:        ctx.totalBeneficiaries,
    schemes:      listProse(ctx.schemes),
    govtAmt:      `Rs. ${ctx.govtAmount}`,
    instAmt:      `Rs. ${ctx.instAmount}`,
    signal:       ctx.totalBeneficiaries > 200
      ? 'A large number of students benefit from both government and institutional financial support.'
      : 'The institution ensures that deserving students receive scholarship support.',
  }),

  '5.2.1': (ctx) => ({
    placed:    plural(ctx.totalPlaced, 'student'),
    employers: listProse(ctx.employers),
    programs:  listProse(ctx.programs),
    signal:    ctx.totalPlaced > 100
      ? 'The institution demonstrates strong placement outcomes with industry-leading employers.'
      : 'The institution actively facilitates campus placements for outgoing students.',
  }),

  '6.2.3': (ctx) => ({
    areas:    plural(ctx.totalAreas, 'area'),
    areaList: listProse(ctx.areas),
    signal:   ctx.totalAreas >= 4
      ? 'The institution has achieved comprehensive e-governance across all operational domains.'
      : 'The institution has implemented e-governance in key administrative areas.',
  }),

  '6.5.3': (ctx) => ({
    nirf:    ctx.nirf ? 'participates in NIRF' : '',
    iso:     ctx.iso  ? 'holds ISO certification' : '',
    nba:     ctx.nba  ? 'has NBA certification' : '',
    signal:  [ctx.nirf && 'NIRF participation', ctx.iso && 'ISO certification', ctx.nba && 'NBA accreditation']
               .filter(Boolean).join(', ') || 'quality assurance initiatives',
  }),

  '7.1.1': (ctx) => ({
    programs:     plural(ctx.totalPrograms, 'programme'),
    participants: ctx.totalParticipants,
    female:       ctx.totalFemale,
    male:         ctx.totalMale,
    progList:     listProse(ctx.programs),
    signal:       ctx.totalPrograms > 3
      ? 'The institution actively promotes gender equity through a sustained series of awareness programmes.'
      : 'The institution conducts targeted gender sensitisation programmes for its student community.',
  }),

  '7.1.3': (ctx) => ({
    totalFacilities: plural(ctx.totalFacilities, 'facility', 'facilities'),
    available:       listProse(ctx.available),
    beneficiaries:   ctx.totalBeneficiaries,
    signal:          ctx.available.length >= 4
      ? 'The institution has built a comprehensively accessible, barrier-free campus environment.'
      : 'The institution provides essential disability-friendly facilities for differently-abled students.',
  }),

  '7.1.11': (ctx) => ({
    events:       plural(ctx.totalEvents, 'event'),
    eventList:    listProse(ctx.events),
    participants: ctx.totalParticipants,
    signal:       ctx.totalEvents > 5
      ? 'The institution actively celebrates a wide range of national and international commemorative days.'
      : 'The institution observes important national and international days to foster civic responsibility.',
  }),
}

/**
 * Main export.
 * Returns an enriched facts object combining formatted context + interpreted signals.
 */
function extractFacts(metricId, formattedContext) {
  const ruleFn = rules[metricId]
  if (!ruleFn) {
    return {
      signal:   'The institution maintains structured practices for this metric.',
      hasData:  formattedContext.hasData,
      totalRecords: formattedContext.totalRecords,
    }
  }
  try {
    return { ...formattedContext, ...ruleFn(formattedContext) }
  } catch {
    return { ...formattedContext, signal: 'The institution follows established academic practices.' }
  }
}

module.exports = { extractFacts }