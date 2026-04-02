# Deployment Checklist

## Frontend on Vercel

- Set project root directory to `frontend`
- Confirm Node.js version is `20.x` or higher
- Add environment variables:
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_APP_NAME`
- Build command: `npm run build`
- Output is handled automatically by the Next.js framework preset

## Backend on Render

- Use [render.yaml](./render.yaml) or create a web service manually
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add production values for:
  - `FRONTEND_URL`
  - `MONGODB_URI`
  - `GROQ_API_KEY`
  - `AI_BASE_URL`
  - `AI_MODEL`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`

## MongoDB Atlas

- Create a production Atlas cluster
- Create an application database user
- Allow deployment IPs or use a secure network configuration
- Copy the application connection string into `MONGODB_URI`

## Production Secrets Checklist

- Replace all placeholder values in [backend/.env](./backend/.env)
- Never commit real secrets
- Use separate production and development keys
- Verify `FRONTEND_URL` matches the deployed Vercel domain
- Redeploy after environment variable changes

## Final Verification

- Frontend build succeeds
- Backend tests pass
- Register and login work in production
- Resume create/edit/delete works
- AI summary and ATS analysis work with a real Groq API key
- PDF export works in deployed frontend
