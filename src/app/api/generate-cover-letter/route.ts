import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json()

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

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert cover letter writer specializing in persuasive, ATS-friendly letters.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      const coverLetter = completion.choices[0]?.message?.content || ''
      return NextResponse.json({ coverLetter })
    } catch {
      console.log('OpenAI API error, using fallback template')
      const coverLetter = generateFallbackCoverLetter(resume)
      return NextResponse.json({ coverLetter, isFallback: true })
    }
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

function generateFallbackCoverLetter(resume: string): string {
  const nameMatch = resume.match(/^[A-Z][a-z]+/m)
  const name = nameMatch ? nameMatch[0] : 'Candidate'
  
  return `Dear Hiring Manager,

I am writing to express my interest in the position described. With my background and experience, I am confident in my ability to contribute effectively to your team.

Based on the job description, I have identified key skills and qualifications that align well with your requirements. My experience includes relevant work that demonstrates my capability to perform in this role.

I am enthusiastic about the opportunity to bring my skills and dedication to your organization. I look forward to discussing how I can contribute to your team's success.

Sincerely,
${name}`
}