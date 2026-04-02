/**
 * services/openai.service.js - AI integration service
 * Uses the OpenAI SDK against Groq's OpenAI-compatible API by default.
 */

const OpenAI = require('openai');
const logger = require('../utils/logger');

const DEFAULT_AI_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_AI_MODEL = 'llama-3.1-8b-instant';

// Lazy-initialize client (avoids crash if key not set in test env)
let openaiClient = null;
const getClient = () => {
  if (!openaiClient) {
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }
    openaiClient = new OpenAI({
      apiKey,
      baseURL: process.env.AI_BASE_URL || DEFAULT_AI_BASE_URL,
    });
  }
  return openaiClient;
};

/**
 * Generic wrapper for chat completions with error handling
 */
const callAI = async (systemPrompt, userPrompt, options = {}) => {
  const client = getClient();
  const {
    model = process.env.AI_MODEL || DEFAULT_AI_MODEL,
    temperature = 0.7,
    maxTokens = 800,
  } = options;

  try {
    const response = await client.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    logger.error('AI API error:', error.message);
    throw new Error('AI service is currently unavailable. Please try again.');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. GENERATE PROFESSIONAL SUMMARY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a compelling professional summary based on resume data
 * @param {Object} resumeData - { personalInfo, experience, skills, targetRole }
 * @returns {string} Professional summary paragraph
 */
const generateSummary = async (resumeData) => {
  const { personalInfo, experience, skills, targetRole } = resumeData;

  const systemPrompt = `You are a professional resume writer with 15+ years of experience helping 
candidates land jobs at top companies. You write compelling, ATS-optimized professional summaries 
that are concise (3-4 sentences), achievement-focused, and tailored to the candidate's target role.

Rules:
- Do NOT use generic filler phrases like "hard-working" or "team player"
- DO quantify impact where data is available
- DO use strong action verbs and industry keywords
- Keep it to 60-80 words
- Write in first person without the "I" pronoun (e.g., "Experienced engineer..." not "I am an experienced engineer...")
- Return ONLY the summary text, no labels or extra formatting`;

  const skillsList = skills.map(s => s.items?.join(', ')).filter(Boolean).join('; ');
  const expSummary = experience
    .slice(0, 3)
    .map(e => `${e.position} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'})`)
    .join(', ');

  const userPrompt = `Generate a professional resume summary for:

Name: ${personalInfo.fullName || 'Candidate'}
Target Role: ${targetRole || 'Not specified'}
Current/Recent Role: ${expSummary || 'No experience listed'}
Skills: ${skillsList || 'Not specified'}
Years of Experience: ${experience.length > 0 ? `${experience.length}+ roles` : 'Entry level'}

Write a compelling 3-4 sentence professional summary.`;

  return callAI(systemPrompt, userPrompt, { temperature: 0.6, maxTokens: 200 });
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. IMPROVE BULLET POINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rewrite a bullet point to be more impactful and ATS-friendly
 * @param {string} bullet - Original bullet text
 * @param {string} jobTitle - The job title context
 * @param {string} company - The company context
 * @returns {string} Improved bullet point
 */
const improveBullet = async (bullet, jobTitle, company = '') => {
  const systemPrompt = `You are an expert resume consultant. Your job is to rewrite resume bullet points 
to be more impactful, quantified, and ATS-optimized using the STAR method (Situation, Task, Action, Result).

Rules:
- Start with a strong past-tense action verb (e.g., Engineered, Delivered, Reduced, Scaled)
- Include metrics and quantifiable results where implied or realistic to infer
- Keep to 1-2 lines maximum
- Use active voice
- Remove filler words
- Return ONLY the improved bullet point, no preamble or explanation
- Do not add bullet symbols`;

  const userPrompt = `Rewrite this resume bullet point for a "${jobTitle}" role${company ? ` at ${company}` : ''}:

Original: "${bullet}"

Provide one improved, impactful bullet point.`;

  return callAI(systemPrompt, userPrompt, { temperature: 0.5, maxTokens: 150 });
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. ATS KEYWORD ANALYSIS & SCORING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze resume against a job description for ATS compatibility
 * @param {Object} resume - Full resume object
 * @param {string} jobDescription - Target job description
 * @returns {Object} { score, keywords, suggestions }
 */
const analyzeATS = async (resume, jobDescription) => {
  const systemPrompt = `You are an ATS (Applicant Tracking System) expert and hiring consultant.
Analyze a resume against a job description and return a detailed compatibility report in valid JSON.

Your analysis must be accurate, actionable, and formatted EXACTLY as specified.
Return ONLY valid JSON, no markdown, no extra text.`;

  // Build a text representation of the resume
  const resumeText = buildResumeText(resume);

  const userPrompt = `Analyze this resume against the job description.

=== RESUME ===
${resumeText}

=== JOB DESCRIPTION ===
${jobDescription}

Return a JSON object with EXACTLY this structure:
{
  "score": <integer 0-100>,
  "keywords": {
    "found": [<keywords from JD found in resume>],
    "missing": [<important keywords from JD missing in resume>],
    "suggested": [<additional keywords to add to improve match>]
  },
  "suggestions": [
    <specific, actionable improvement suggestion>,
    <specific, actionable improvement suggestion>,
    <specific, actionable improvement suggestion>
  ],
  "tailoringSuggestions": [
    <specific rewrite or section recommendation>,
    <specific rewrite or section recommendation>,
    <specific rewrite or section recommendation>
  ],
  "scoreBreakdown": {
    "keywordMatch": <0-40>,
    "experienceMatch": <0-30>,
    "skillsMatch": <0-20>,
    "formatScore": <0-10>
  }
}`;

  const raw = await callAI(systemPrompt, userPrompt, {
    model: process.env.AI_MODEL || DEFAULT_AI_MODEL,
    temperature: 0.3,
    maxTokens: 1000,
  });

  try {
    // Strip potential markdown code fences
    const clean = raw.replace(/```json?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);
    return {
      score: parsed.score ?? null,
      keywords: parsed.keywords ?? { found: [], missing: [], suggested: [] },
      suggestions: parsed.suggestions ?? [],
      tailoringSuggestions: parsed.tailoringSuggestions ?? [],
      scoreBreakdown: parsed.scoreBreakdown ?? {
        keywordMatch: 0,
        experienceMatch: 0,
        skillsMatch: 0,
        formatScore: 0,
      },
    };
  } catch {
    logger.error('Failed to parse ATS analysis JSON:', raw);
    throw new Error('Failed to parse ATS analysis. Please try again.');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. SUGGEST SKILLS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Suggest relevant skills based on job title and existing skills
 */
const suggestSkills = async (jobTitle, existingSkills = [], jobDescription = '') => {
  const systemPrompt = `You are a career coach and technical recruiter. 
Suggest relevant, in-demand skills for a specific job title that would improve ATS matching.
Return ONLY a valid JSON array of skill strings, no other text.`;

  const userPrompt = `Suggest 10-15 relevant skills for a "${jobTitle}" role.
Existing skills to avoid duplicating: ${existingSkills.join(', ')}
${jobDescription ? `Job description context: ${jobDescription.substring(0, 500)}` : ''}

Return as JSON array: ["skill1", "skill2", ...]`;

  const raw = await callAI(systemPrompt, userPrompt, { temperature: 0.4, maxTokens: 300 });

  try {
    const clean = raw.replace(/```json?/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. TAILOR RESUME FOR JOB
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate tailoring suggestions to match a specific job description
 */
const tailorForJob = async (resume, jobDescription) => {
  const systemPrompt = `You are a professional resume coach. 
Analyze a candidate's resume against a job description and provide specific, 
actionable recommendations to tailor the resume for maximum relevance.
Be specific - name exact sections, phrases, and improvements.`;

  const resumeText = buildResumeText(resume);

  const userPrompt = `Here is a candidate's resume and a job description.
Provide 5 specific, actionable recommendations to tailor this resume for this role.

=== RESUME SUMMARY ===
${resumeText.substring(0, 1500)}

=== JOB DESCRIPTION ===
${jobDescription.substring(0, 1000)}

Provide exactly 5 numbered recommendations. Be specific and actionable.`;

  const result = await callAI(systemPrompt, userPrompt, { temperature: 0.5, maxTokens: 600 });

  return result
    .split(/\n+/)
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 5);
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert resume object to readable text for AI prompts
 */
const buildResumeText = (resume) => {
  const parts = [];

  const { personalInfo, experience, education, skills, projects } = resume;

  if (personalInfo?.fullName) parts.push(`Name: ${personalInfo.fullName}`);
  if (personalInfo?.summary) parts.push(`Summary: ${personalInfo.summary}`);

  if (experience?.length) {
    parts.push('\nEXPERIENCE:');
    experience.forEach(e => {
      parts.push(`${e.position} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'})`);
      if (e.description) parts.push(e.description);
      if (e.bullets?.length) parts.push(e.bullets.join('\n'));
    });
  }

  if (education?.length) {
    parts.push('\nEDUCATION:');
    education.forEach(e => parts.push(`${e.degree} in ${e.field} from ${e.institution}`));
  }

  if (skills?.length) {
    parts.push('\nSKILLS:');
    skills.forEach(s => parts.push(`${s.category}: ${s.items?.join(', ')}`));
  }

  if (projects?.length) {
    parts.push('\nPROJECTS:');
    projects.forEach(p => parts.push(`${p.name}: ${p.description}`));
  }

  return parts.join('\n');
};

module.exports = {
  generateSummary,
  improveBullet,
  analyzeATS,
  suggestSkills,
  tailorForJob,
};
