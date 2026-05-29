import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

*Note: AI API unavailable. This is a template. For full tailoring, check API configuration.*`,

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

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription, template } = await request.json()

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
You are a resume expert. Tailor the resume for the job description without fabricating experience.

Original Resume:
${resume}

Job Description:
${jobDescription}

Analyze the job description and:
1. Identify key skills and keywords
2. Match existing experience to requirements
3. Rephrase achievements to highlight relevant qualifications
4. Add missing keywords naturally where appropriate
5. Optimize for ATS systems

Template Style: ${template}

Provide a tailored resume that:
- Keeps all real experience and achievements
- Emphasizes skills that match the job
- Incorporates relevant keywords naturally
- Maintains professional formatting
- Is honest and truthful (no fake experience)

Format as a complete resume.
`

    try {
      const result = await model.generateContent(prompt)
      const tailoredResume = result.response.text()
      return NextResponse.json({ tailoredResume })
    } catch {
      console.log('Gemini API error, using fallback')
      const tailoredResume = generateFallbackResume(resume, template)
      return NextResponse.json({ tailoredResume, isFallback: true })
    }
  } catch (error: unknown) {
    console.error('Error tailoring resume:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to tailor resume', details: message },
      { status: 500 }
    )
  }
}