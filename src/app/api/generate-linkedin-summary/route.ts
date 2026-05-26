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
You are an expert LinkedIn profile writer. Create a compelling, professional LinkedIn "About" section based on the resume provided.

Resume:
${resume}

Instructions:
1. Start with a strong opening hook about who you are
2. Highlight your core expertise and years of experience
3. Mention 2-3 key achievements or specialties
4. Include relevant skills and technologies
5. Add a personal touch about your passion or mission
6. End with a call to action (collaboration, networking, etc.)
7. Keep it engaging, conversational, and professional (150-250 words)
8. Use first person ("I") perspective
9. Avoid jargon and keep it readable

Return ONLY the LinkedIn About section content, no additional commentary.
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert LinkedIn profile writer specializing in compelling, professional About sections.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 400,
      })

      const linkedInSummary = completion.choices[0]?.message?.content || ''
      return NextResponse.json({ linkedInSummary })
    } catch {
      console.log('OpenAI API error, using fallback template')
      const linkedInSummary = generateFallbackLinkedInSummary(resume)
      return NextResponse.json({ linkedInSummary, isFallback: true })
    }
  } catch (error: unknown) {
    console.error('Error generating LinkedIn summary:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    const details = error && typeof error === 'object' && 'error' in error 
      ? (error as { error?: { message?: string } }).error?.message 
      : message
    return NextResponse.json(
      { error: 'Failed to generate LinkedIn summary', details },
      { status: 500 }
    )
  }
}

function generateFallbackLinkedInSummary(resume: string): string {
  const nameMatch = resume.match(/^[A-Z][a-z]+/m)
  const name = nameMatch ? nameMatch[0] : 'Professional'
  
  return `I'm a dedicated professional passionate about creating value and driving innovation. With a strong background in my field, I specialize in delivering exceptional results and building meaningful relationships.

My expertise spans multiple areas, and I've consistently delivered impactful solutions throughout my career. I believe in continuous learning and staying ahead of industry trends.

When I'm not working, you can find me exploring new technologies and connecting with like-minded professionals. Let's connect and explore how we can collaborate to achieve great things together!`
}