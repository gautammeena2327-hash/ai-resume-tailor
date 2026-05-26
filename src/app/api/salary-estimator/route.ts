import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
You are a salary estimation expert. Based on the job description, provide salary estimates for US and UK markets.

Job Description:
${jobDescription}

Instructions:
1. Extract key skills, experience level, and role type
2. Estimate salary range for United States (USD) - include entry, mid, senior levels
3. Estimate salary range for United Kingdom (GBP) - include entry, mid, senior levels
4. Consider market trends and location variations
5. Provide brief explanation for estimates
6. Keep total response under 200 words

Format:
US Salary (USD):
- Entry Level: $X,000 - $Y,000
- Mid Level: $A,000 - $B,000
- Senior Level: $C,000 - $D,000

UK Salary (GBP):
- Entry Level: £X,000 - £Y,000
- Mid Level: £A,000 - £B,000
- Senior Level: £C,000 - £D,000

Return ONLY the salary estimates with brief explanation.
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a salary estimation expert with knowledge of US and UK job markets.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 300,
      })

      const salaryEstimate = completion.choices[0]?.message?.content || ''
      return NextResponse.json({ salaryEstimate })
    } catch {
      console.log('OpenAI API error, using fallback template')
      const salaryEstimate = generateFallbackSalaryEstimate()
      return NextResponse.json({ salaryEstimate, isFallback: true })
    }
  } catch (error: unknown) {
    console.error('Error estimating salary:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to estimate salary', details: message },
      { status: 500 }
    )
  }
}

function generateFallbackSalaryEstimate(): string {
  return `US Salary (USD):
- Entry Level: $45,000 - $65,000
- Mid Level: $75,000 - $110,000
- Senior Level: $120,000 - $180,000

UK Salary (GBP):
- Entry Level: £28,000 - £35,000
- Mid Level: £42,000 - £65,000
- Senior Level: £75,000 - £110,000

Note: Estimates vary by location, company size, and specific requirements.`
}