# Food Delivery System - Backend Deployment Guide

This document outlines the deployment procedure for the Food Delivery System backend using Render.

## 1. Project Requirements
- **Runtime**: Node.js
- **Database**: PostgreSQL (Hosted)
- **Framework**: Express + TypeScript
- **ORM**: Prisma

## 2. Environment Variables
You must configure the following environment variables in your Render Web Service settings:
- `PORT`: (Provided dynamically by Render, but explicitly set if needed. Ensure `process.env.PORT` is respected.)
- `DATABASE_URL`: `postgresql://username:password@host:port/database`
- `JWT_SECRET`: A secure randomly generated string.
- `JWT_EXPIRES_IN`: E.g., `7d`.
- `FRONTEND_URL`: The deployed Vercel frontend URL (e.g., `https://my-food-delivery-frontend.vercel.app`).

## 3. Render Web Service Configuration
When setting up the Web Service on Render, use the following configuration:

- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npm run build && npx prisma migrate deploy`
- **Start Command**: `npm start`

## 4. Prisma Generation & Database Migrations
Prisma automatically generates the client during `npm install` because `prisma generate` is inherently triggered by the `@prisma/client` installation, but running `npx prisma generate` explicitly during the build step is a good practice if needed.

**Production Migration Procedure:**
Do **NOT** use `prisma migrate dev` or `prisma db push` in production.
The standard command to apply migrations to the hosted database is:
```bash
npx prisma migrate deploy
```
This can be added to the Build Command, e.g.:
```bash
npm install && npx prisma generate && npm run build && npx prisma migrate deploy
```

## 5. CORS Configuration
CORS is explicitly configured to strictly accept traffic originating from `FRONTEND_URL`. Ensure the variable matches the exact schema and domain of the frontend without trailing slashes.

## 6. Health Check Endpoints
After deployment, verify system health using the following endpoints:
- `GET /api/health`: Validates the Express server is receiving traffic.
- `GET /api/health/db`: Validates the server can successfully connect and query the PostgreSQL instance.
