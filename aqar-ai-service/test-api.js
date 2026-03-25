require('dotenv').config()
const { generateAIContent } = require('./ai/llmClient')

const TEST_PROMPT = `You are a professional NAAC AQAR report writer for Indian colleges.
Write ONE paragraph of exactly 140-170 words for Metric 1.1 (Number of courses offered).

STRUCTURED FACTS:
  - totalCourses: 21
  - totalPrograms: 7
  - yearRange: 2019-20 to 2023-24
  - signal: The institution offers a comprehensive range of courses across programmes.

Write a formal institutional paragraph. No lists, no bullet points, no JSON.
Return only the paragraph.`

;(async () => {
  console.log(`Testing provider: ${process.env.AI_PROVIDER || 'groq'}`)
  console.log('─'.repeat(50))
  try {
    const result = await generateAIContent(TEST_PROMPT)
    const words  = result.trim().split(/\s+/).length
    console.log(`✓ Success — ${words} words\n`)
    console.log(result)
  } catch (err) {
    console.error('✗ Failed:', err.message)
    console.log('\nCheck your .env file and ensure the API key is correct.')
  }
})()