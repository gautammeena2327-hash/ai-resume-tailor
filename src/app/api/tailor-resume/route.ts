import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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