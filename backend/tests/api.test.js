process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = '7d';
process.env.JWT_REFRESH_EXPIRES_IN = '30d';
process.env.FRONTEND_URL = 'http://localhost:3000';

jest.mock('../src/services/openai.service', () => ({
  generateSummary: jest.fn(),
  improveBullet: jest.fn(),
  analyzeATS: jest.fn(),
  suggestSkills: jest.fn(),
  tailorForJob: jest.fn(),
}));

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Resume = require('../src/models/Resume');
const openaiService = require('../src/services/openai.service');

jest.setTimeout(60000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    dbName: 'ai-resume-builder-test',
  });
});

afterEach(async () => {
  jest.clearAllMocks();
  await Promise.all([
    User.deleteMany({}),
    Resume.deleteMany({}),
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

const defaultUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123',
};

const createUserSession = async (userOverrides = {}) => {
  const user = { ...defaultUser, ...userOverrides };

  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send(user)
    .expect(201);

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: user.password })
    .expect(200);

  return {
    user,
    registeredUser: registerResponse.body.data.user,
    accessToken: loginResponse.body.data.accessToken,
    refreshToken: loginResponse.body.data.refreshToken,
  };
};

const createResumeForUser = async (accessToken, overrides = {}) => {
  const response = await request(app)
    .post('/api/resumes')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title: 'Software Engineer Resume',
      template: 'modern',
      personalInfo: { fullName: 'Test User', email: 'test@example.com' },
      experience: [],
      education: [],
      projects: [],
      skills: [{ category: 'Technical Skills', items: ['React', 'Node.js'] }],
      certifications: [],
      ...overrides,
    })
    .expect(201);

  return response.body.data.resume;
};

describe('Auth API', () => {
  it('registers a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(defaultUser)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(defaultUser.email);
    expect(response.body.data.accessToken).toBeDefined();
  });

  it('refreshes tokens and invalidates the old refresh token', async () => {
    const session = await createUserSession();

    const refreshResponse = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: session.refreshToken })
      .expect(200);

    expect(refreshResponse.body.data.accessToken).toBeDefined();
    expect(refreshResponse.body.data.refreshToken).toBeDefined();
    expect(refreshResponse.body.data.refreshToken).not.toBe(session.refreshToken);

    await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: session.refreshToken })
      .expect(401);
  });

  it('updates the user profile', async () => {
    const session = await createUserSession();

    const response = await request(app)
      .patch('/api/auth/profile')
      .set('Authorization', `Bearer ${session.accessToken}`)
      .send({ name: 'Updated Name', avatar: 'https://example.com/avatar.png' })
      .expect(200);

    expect(response.body.data.user.name).toBe('Updated Name');
    expect(response.body.data.user.avatar).toBe('https://example.com/avatar.png');
  });

  it('logs out and invalidates the stored refresh token', async () => {
    const session = await createUserSession();

    await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${session.accessToken}`)
      .expect(200);

    await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: session.refreshToken })
      .expect(401);
  });
});

describe('Resume API', () => {
  it('creates, reads, updates, duplicates, and deletes a resume', async () => {
    const session = await createUserSession();
    const resume = await createResumeForUser(session.accessToken);

    const listResponse = await request(app)
      .get('/api/resumes')
      .set('Authorization', `Bearer ${session.accessToken}`)
      .expect(200);

    expect(listResponse.body.data.resumes).toHaveLength(1);

    const getResponse = await request(app)
      .get(`/api/resumes/${resume._id}`)
      .set('Authorization', `Bearer ${session.accessToken}`)
      .expect(200);

    expect(getResponse.body.data.resume._id).toBe(resume._id);

    const updateResponse = await request(app)
      .put(`/api/resumes/${resume._id}`)
      .set('Authorization', `Bearer ${session.accessToken}`)
      .send({ title: 'Updated Resume Title' })
      .expect(200);

    expect(updateResponse.body.data.resume.title).toBe('Updated Resume Title');

    const duplicateResponse = await request(app)
      .post(`/api/resumes/${resume._id}/duplicate`)
      .set('Authorization', `Bearer ${session.accessToken}`)
      .expect(201);

    expect(duplicateResponse.body.data.resume.title).toContain('Copy');

    await request(app)
      .delete(`/api/resumes/${resume._id}`)
      .set('Authorization', `Bearer ${session.accessToken}`)
      .expect(200);
  });

  it('rejects invalid templates', async () => {
    const session = await createUserSession();

    await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${session.accessToken}`)
      .send({ title: 'Test', template: 'invalid-template' })
      .expect(400);
  });

  it('enforces ownership for resume access', async () => {
    const owner = await createUserSession();
    const resume = await createResumeForUser(owner.accessToken);
    const otherUser = await createUserSession({
      name: 'Other User',
      email: 'other@example.com',
    });

    await request(app)
      .get(`/api/resumes/${resume._id}`)
      .set('Authorization', `Bearer ${otherUser.accessToken}`)
      .expect(404);
  });

  it('allows saving partial draft sections while editing', async () => {
    const session = await createUserSession();
    const resume = await createResumeForUser(session.accessToken);

    const response = await request(app)
      .put(`/api/resumes/${resume._id}`)
      .set('Authorization', `Bearer ${session.accessToken}`)
      .send({
        experience: [
          {
            company: '',
            position: 'Frontend Engineer',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            bullets: [''],
          },
        ],
        education: [
          {
            institution: '',
            degree: 'B.Tech',
            field: '',
            startDate: '',
            endDate: '',
            gpa: '',
            honors: '',
          },
        ],
      })
      .expect(200);

    expect(response.body.data.resume.experience[0].position).toBe('Frontend Engineer');
    expect(response.body.data.resume.experience[0].company).toBe('');
    expect(response.body.data.resume.education[0].degree).toBe('B.Tech');
  });
});

describe('AI API', () => {
  it('requires authentication for AI routes', async () => {
    await request(app)
      .post('/api/ai/generate-summary')
      .send({ personalInfo: {}, experience: [], skills: [] })
      .expect(401);
  });

  it('validates ATS analysis payloads', async () => {
    const session = await createUserSession();

    await request(app)
      .post('/api/ai/ats-analyze')
      .set('Authorization', `Bearer ${session.accessToken}`)
      .send({ resumeId: 'abc', jobDescription: 'too short' })
      .expect(400);
  });

  it('generates and persists ATS analysis', async () => {
    const session = await createUserSession();
    const resume = await createResumeForUser(session.accessToken);

    openaiService.analyzeATS.mockResolvedValue({
      score: 88,
      keywords: {
        found: ['react'],
        missing: ['typescript'],
        suggested: ['next.js'],
      },
      suggestions: ['Add more TypeScript examples.'],
      tailoringSuggestions: ['Move React platform work higher in experience.'],
      scoreBreakdown: {
        keywordMatch: 34,
        experienceMatch: 26,
        skillsMatch: 18,
        formatScore: 10,
      },
    });

    const response = await request(app)
      .post('/api/ai/ats-analyze')
      .set('Authorization', `Bearer ${session.accessToken}`)
      .send({
        resumeId: resume._id,
        jobDescription:
          'We are hiring a React and TypeScript engineer to build scalable web applications with modern frontend tooling and strong collaboration skills.',
      })
      .expect(200);

    expect(response.body.data.analysis.score).toBe(88);

    const persistedResume = await Resume.findById(resume._id);
    expect(persistedResume.atsAnalysis.score).toBe(88);
    expect(persistedResume.atsAnalysis.tailoringSuggestions).toHaveLength(1);
  });

  it('blocks AI requests when the free plan limit is reached', async () => {
    const session = await createUserSession();

    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        'aiUsage.count': 20,
        'aiUsage.resetAt': new Date(Date.now() + 24 * 60 * 60 * 1000),
      }
    );

    await request(app)
      .post('/api/ai/suggest-skills')
      .set('Authorization', `Bearer ${session.accessToken}`)
      .send({ jobTitle: 'Frontend Engineer', existingSkills: ['React'] })
      .expect(429);
  });

  it('returns tailoring suggestions for owned resumes', async () => {
    const session = await createUserSession();
    const resume = await createResumeForUser(session.accessToken);

    openaiService.tailorForJob.mockResolvedValue([
      'Use the exact target role title in the summary.',
      'Add measurable frontend performance gains to the most recent role.',
    ]);

    const response = await request(app)
      .post('/api/ai/tailor')
      .set('Authorization', `Bearer ${session.accessToken}`)
      .send({
        resumeId: resume._id,
        jobDescription:
          'Looking for a frontend engineer with React, experimentation, performance optimization, and stakeholder communication experience.',
      })
      .expect(200);

    expect(response.body.data.suggestions).toHaveLength(2);
  });
});
