# Deployment Guide

## Frontend Deployment to Netlify

### ✅ Backend Already Deployed
Your backend is already hosted at: **https://crypo-app.onrender.com**

### Step 1: Configure Backend CORS (Important!)
Update your backend environment variables on Render:
1. Go to your Render dashboard → Your backend service
2. Navigate to **Environment** → **Environment Variables**
3. Add or update `FRONTEND_URL` to your Netlify domain once you have it (e.g., `https://your-site.netlify.app`)

### Step 2: Set Frontend Environment Variables in Netlify
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://crypo-app.onrender.com/api`

### Step 3: Deploy Frontend
Push your code to GitHub/GitLab and connect to Netlify, or use Netlify CLI to deploy.

## Important Notes

- The `netlify.toml` file is already configured for SPA routing
- Environment variables set in Netlify take precedence over local `.env` file
- Your frontend `.env` file is already set to use the hosted backend for development
- The "Cannot GET /" error on the backend root URL is normal - the API routes are under `/api/*`
