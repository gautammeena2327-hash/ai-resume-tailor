import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, resume } = await request.json()

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
You are an expert interview coach. Based on the job description and resume, predict the most likely interview questions.

Job Description:
${jobDescription}

${resume ? `Candidate Resume:
${resume}` : ''}

Instructions:
1. Analyze the job description for key requirements and skills
2. Generate 10-15 most likely interview questions
3. Include technical questions relevant to the role
4. Include behavioral questions (STAR format)
5. Include role-specific scenario questions
6. Organize by category: Technical, Behavioral, Role-specific
7. Keep total under 250 words

Format:
**Technical Questions:**
- Question 1
- Question 2

**Behavioral Questions:**
- Question 1
- Question 2

**Role-specific Questions:**
- Question 1
- Question 2

Return ONLY the questions, no additional commentary.
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert interview coach predicting likely interview questions based on job descriptions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 400,
      })

      const interviewQuestions = completion.choices[0]?.message?.content || ''
      return NextResponse.json({ interviewQuestions })
    } catch {
      console.log('OpenAI API error, using fallback template')
      const interviewQuestions = generateFallbackQuestions()
      return NextResponse.json({ interviewQuestions, isFallback: true })
    }
  } catch (error: unknown) {
    console.error('Error predicting interview questions:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to predict questions', details: message },
      { status: 500 }
    )
  }
}

function generateFallbackQuestions(): string {
  return `**Technical Questions:**
- What are your core strengths relevant to this role?
- Describe a challenging project you completed.
- How do you handle tight deadlines?

**Behavioral Questions:**
- Tell me about yourself.
- Describe a time you worked in a team.
- Give an example of when you showed leadership.

**Role-specific Questions:**
- Why do you want to work here?
- Where do you see yourself in 5 years?
- What are your salary expectations?`
}