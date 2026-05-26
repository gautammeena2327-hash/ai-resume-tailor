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
       const tailoredResume = generateFallbackResume(resume, template)
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

function generateFallbackResume(resume: string, template = 'professional'): string {
  const templates = {
    professional: `# Tailored Resume
  
## Professional Summary
Results-driven professional ready to contribute expertise and skills to your team.

## Work Experience
${resume.split('\n').filter(line => line.includes('Experience') || line.includes('work') || line.includes('company')).slice(0, 5).join('\n') || 'Relevant experience tailored to job requirements'}

## Skills
• Key skills matched from job description
• Technical proficiencies
• Soft skills and competencies

*Note: AI API unavailable. This is a template. For full tailoring, check OpenAI billing.*`,

    modern: `# Tailored Resume - Modern Style

| skill | proficiency |
|-------|-------------|
| Relevant Skill | ★★★★☆ |
| Another Skill | ★★★★★ |

**Core Competencies**
- Advanced technical skills
- Project management expertise
- Communication and collaboration

**Professional Background**
${resume.split('\n').slice(0, 10).join('\n') || 'Experience details tailored to job requirements'}

*Fallback mode - AI API unavailable.*`,

    executive: `# Executive Resume

## PROFESSIONAL PROFILE
Seasoned executive with proven track record of driving results and leading teams.

## LEADERSHIP EXPERIENCE
${resume.split('\n').filter(line => line.match(/Manager|Director|Lead|Chief/i)).slice(0, 5).join('\n') || 'Executive-level experience in strategic roles'}

## BOARD MEMBERSHIPS & AFFILIATIONS
• Industry professional organizations
• Leadership development programs

## EDUCATION & CREDENTIALS
Advanced degrees and professional certifications.`,

    creative: `# Creative Resume

> **"Innovation distinguishes between a leader and a follower."** — Steve Jobs

## 🎯 What I Bring
- Creative problem-solving
- Strategic thinking
- Design thinking approach

## 💼 Experience Highlights
${resume.split('\n').slice(0, 8).join('\n') || 'Creative work experience and portfolio projects'}

## 🛠️ Tools & Technologies
Creative suite, development tools, and innovative methodologies.`,

    minimal: `# Resume

**Name** — title

${resume.split('\n').slice(0, 15).join('\n')}

**Skills:** Relevant skills here
**Contact:** email@domain.com`,

    technical: `# Technical Resume

## Technical Skills Matrix
| Category | Technologies |
|----------|-------------|
| Languages | JavaScript, Python, Java |
| Frameworks | React, Node.js, Django |
| Tools | Git, Docker, AWS |

## Projects & Contributions
${resume.split('\n').filter(line => line.includes('project') || line.includes('develop') || line.includes('build')).slice(0, 6).join('\n') || 'Technical projects and contributions'}

## Certifications
- Technical certifications relevant to field
- Online course completions

*Template resume - AI API unavailable.*`
  }
  
  return templates[template as keyof typeof templates] || templates.professional
}