import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription, template } = await request.json()

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
You are an expert resume writer and career coach. Tailor the following resume for the job description provided.

Job Description:
${jobDescription}

Original Resume:
${resume}

Instructions:
1. Optimize for Applicant Tracking Systems (ATS) - use relevant keywords from the job description
2. Rewrite bullet points to match job requirements with quantifiable achievements
3. Highlight skills and experience that match the job posting
4. Keep the same format but improve the content
5. Use action verbs and metrics where possible
6. Template style: ${template || 'professional'}

Return ONLY the tailored resume content in markdown format, no additional commentary.
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert resume writer specializing in ATS optimization and career coaching.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const tailoredResume = completion.choices[0]?.message?.content || ''
      return NextResponse.json({ tailoredResume })
    } catch {
      console.log('OpenAI API error, using fallback template')
      const tailoredResume = generateFallbackResume(resume)
      return NextResponse.json({ tailoredResume, isFallback: true })
    }
  } catch (error: unknown) {
    console.error('Error tailoring resume:', error)
    return NextResponse.json(
      { error: 'Failed to tailor resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function generateFallbackResume(resume: string): string {
  return `# Tailored Resume

## Professional Summary
Experienced professional ready to contribute

## Work Experience
${resume.split('\n').filter(line => line.includes('Experience') || line.includes('work') || line.includes('company')).slice(0, 5).join('\n') || 'Relevant experience tailored to job requirements'}

## Skills
Keywords matched from job description

*Note: This is a placeholder. For AI-powered tailoring, please check OpenAI API billing.*`
}