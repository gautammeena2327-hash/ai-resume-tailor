import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { resume } = await request.json()

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
You are a resume expert. Score the resume on ATS compatibility, content quality, and structure.

Resume:
${resume}

Analyze and provide:
1. Overall Score (0-100)
2. ATS Compatibility Score (0-100)
3. Content Quality Score (0-100)
4. Structure & Formatting Score (0-100)
5. Key strengths (3-5 bullets)
6. Areas for improvement (3-5 bullets)
7. Quick fix suggestions (2-3 actionable tips)

Format:
Overall Score: X/100

ATS Compatibility: X/100
Content Quality: X/100
Structure & Formatting: X/100

Strengths:
- ...

Improvements:
- ...

Quick Tips:
- ...

Keep under 250 words.
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a resume expert who scores and provides feedback on resumes.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 350,
      })

      const resumeScore = completion.choices[0]?.message?.content || ''
      return NextResponse.json({ resumeScore })
    } catch {
      console.log('OpenAI API error, using fallback')
      const resumeScore = generateFallbackResumeScore()
      return NextResponse.json({ resumeScore, isFallback: true })
    }
  } catch (error: unknown) {
    console.error('Error scoring resume:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to score resume', details: message },
      { status: 500 }
    )
  }
}

function generateFallbackResumeScore(): string {
  return `Overall Score: 72/100

ATS Compatibility: 65/100
Content Quality: 75/100
Structure & Formatting: 78/100

Strengths:
- Clear work experience listed
- Relevant skills included
- Professional summary present

Improvements:
- Add more quantifiable achievements
- Include relevant keywords
- Better formatting consistency

Quick Tips:
- Start bullets with strong action verbs
- Add metrics to achievements`
}