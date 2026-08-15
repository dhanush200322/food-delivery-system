# Deployment Architecture

The system utilizes a split deployment model perfectly suited for modern decoupled architectures.

## Frontend (Vercel)
The Next.js frontend is deployed to Vercel. 
- **Root Directory:** `frontend/`
- **Build Command:** `npm run build`
- **Start Command:** `npm start` (Vercel manages this automatically)
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: Points to the production Render backend URL.

## Backend (Render)
The Express/Node.js backend is deployed as a Web Service on Render.
- **Root Directory:** `backend/`
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `DATABASE_URL`: Hosted PostgreSQL connection string.
  - `JWT_SECRET`: Secure cryptographic secret for signing sessions.
  - `FRONTEND_URL`: Used to configure strict CORS policy (points to Vercel URL).

## Database (PostgreSQL)
A hosted PostgreSQL database instance.
- **Migrations:** Deployed automatically during the backend build phase using `npx prisma migrate deploy` (if added to the build script) or manually applied.
- **Seeding:** Initial data is seeded using `npx prisma db seed`.

## Cold-Start Behavior
Because the backend runs on Render's free tier, it spins down after 15 minutes of inactivity. To ensure a smooth user experience:
1. The frontend `fetchApi` client implements an extended 120-second abort timeout.
2. The authentication pages (`/login` and `/register`) proactively ping a background `/api/health` endpoint on mount to wake the backend silently while the user types their credentials.
