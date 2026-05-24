import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json()

    console.log('API called, checking OPENAI_API_KEY:', !!process.env.OPENAI_API_KEY)

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
You are an expert cover letter writer. Create a compelling, personalized cover letter based on the resume and job description provided.

Job Description:
${jobDescription}

Candidate Resume:
${resume}

Instructions:
1. Start with a strong opening hook
2. Match keywords from the job description
3. Highlight 2-3 relevant achievements from the resume
4. Show enthusiasm for the company/role
5. Keep it concise (3-4 paragraphs, 200-300 words)
6. End with a call to action

Return ONLY the cover letter content, no additional commentary.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert cover letter writer specializing in persuasive, ATS-friendly letters.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const coverLetter = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ coverLetter })
  } catch (error: unknown) {
    console.error('Error generating cover letter:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    const details = error && typeof error === 'object' && 'error' in error 
      ? (error as { error?: { message?: string } }).error?.message 
      : message
    return NextResponse.json(
      { error: 'Failed to generate cover letter', details },
      { status: 500 }
    )
  }
}