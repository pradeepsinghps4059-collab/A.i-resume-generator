# AI Resume Builder

Production-ready AI resume builder with:

- Secure JWT auth
- Multi-resume dashboard
- Live resume editor and preview
- AI summary, bullet, skill, ATS, and job-tailoring tools
- PDF export
- MongoDB-backed API

## Stack

- Frontend: Next.js 16, TypeScript, Tailwind CSS, Zustand, React Query
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas or local MongoDB
- AI: Groq API via the OpenAI SDK compatibility layer
- Deploy: Vercel for frontend, Render or Railway for backend

## Project Structure

```text
ai-resume-builder/
├─ frontend/
│  ├─ app/
│  ├─ components/
│  ├─ lib/
│  ├─ store/
│  ├─ types/
│  ├─ next.config.js
│  ├─ postcss.config.js
│  ├─ tailwind.config.js
│  └─ tsconfig.json
└─ backend/
   ├─ src/
   │  ├─ config/
   │  ├─ controllers/
   │  ├─ middleware/
   │  ├─ models/
   │  ├─ routes/
   │  ├─ services/
   │  └─ utils/
   └─ tests/
```

## Features

### Authentication

- Register and login
- Bcrypt password hashing
- JWT access and refresh tokens
- Protected dashboard and API routes

### Resume Builder

- Personal info, experience, education, skills, projects, certifications
- Add and remove dynamic sections
- Template switching: modern, minimal, professional
- Real-time preview and PDF export

### AI Features

- Generate professional summaries
- Improve experience bullets
- Suggest role-based skills
- Run ATS keyword analysis and scoring
- Generate job-tailoring recommendations

### Dashboard

- Create, edit, duplicate, and delete resumes
- Multiple resumes per user
- Resume-level ATS state persistence

## Environment Variables

### Backend `.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-resume-builder
JWT_SECRET=your_long_random_access_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_long_random_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.1-8b-instant
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AI_RATE_LIMIT_MAX=20
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ResumeAI
```

## Local Development

### 1. Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. Start the backend

```bash
cd backend
npm run dev
```

Runs on `http://localhost:5000`.

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

Runs on `http://localhost:3000`.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `PATCH /api/auth/profile`

### Resumes

- `GET /api/resumes`
- `POST /api/resumes`
- `GET /api/resumes/:id`
- `PUT /api/resumes/:id`
- `DELETE /api/resumes/:id`
- `POST /api/resumes/:id/duplicate`

### AI

- `POST /api/ai/generate-summary`
- `POST /api/ai/improve-bullet`
- `POST /api/ai/suggest-skills`
- `POST /api/ai/ats-analyze`
- `POST /api/ai/tailor`

## Database Design

### User

- `name`
- `email`
- `password`
- `avatar`
- `plan`
- `isEmailVerified`
- `refreshToken`
- `aiUsage`

### Resume

- `user`
- `title`
- `template`
- `personalInfo`
- `experience`
- `education`
- `projects`
- `skills`
- `certifications`
- `sectionOrder`
- `atsAnalysis`
- `lastEditedAt`

Relationship: one user to many resumes.

## Deployment

### Frontend on Vercel

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Set the root directory to `frontend`.
4. Add:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_APP_NAME`
5. Deploy.

### Backend on Render or Railway

1. Create a web service from the repo.
2. Set the root directory to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add backend environment variables from the sample above, including the Groq API settings.

### MongoDB Atlas

1. Create a cluster.
2. Create a database user.
3. Allow your deployment IPs.
4. Copy the connection string into `MONGODB_URI`.

## Verification

- Frontend production build: passed with `npm run build`
- Backend source syntax check: passed with `node --check`
- Backend Jest API suite: passed with `npm test`

## Notes

- The frontend uses `@/*` path aliases configured in `frontend/tsconfig.json`.
- ATS analysis now stores score breakdown and tailoring suggestions on the resume.
- AI usage limits are enforced per user on the backend.
- Backend tests use `mongodb-memory-server`, so they no longer require a separately running MongoDB instance.
- The backend defaults to Groq's OpenAI-compatible endpoint, so the existing AI service layer stays provider-agnostic.
