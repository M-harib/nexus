# NEXUS Deployment Guide

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Render account (free)
- [ ] Your API keys (Gemini, ElevenLabs)

## Step 1: Push to GitHub

```bash
cd "C:\Users\HARIB\OneDrive\Desktop\CS PROJECTS\ctrlhackdel"
git init
git add .
git commit -m "Initial commit - NEXUS Knowledge RPG"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: nexus-backend
   - **Root Directory**: `backend/node-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. Add Environment Variables:
   - `NODE_ENV` = production
   - `PORT` = 5001
   - `GEMINI_API_KEY` = (your API key)
   - `ELEVENLABS_API_KEY` = (your API key)

6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., `https://nexus-backend-xyz.onrender.com`)

## Step 3: Update Frontend API URL

Update `frontend/src/services/api.js`:

```javascript
const DEFAULT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5001"
    : "https://YOUR-BACKEND-URL.onrender.com");
```

Or create `frontend/.env.production`:

```
VITE_API_BASE_URL=https://YOUR-BACKEND-URL.onrender.com
```

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables (optional):
   - `VITE_API_BASE_URL` = (your backend URL from Render)

6. Click "Deploy"

## Step 5: Test Your Deployment

1. Visit your Vercel deployment URL
2. Try generating a learning tree
3. Complete a Star Trial
4. Verify backend is responding

## Alternative Deployment Options

### Frontend Alternatives

- **Netlify**: Similar to Vercel, drag-and-drop deployment
- **GitHub Pages**: Free, but requires manual setup for SPA routing
- **Cloudflare Pages**: Fast CDN, free tier

### Backend Alternatives

- **Railway**: https://railway.app (similar to Render)
- **Fly.io**: https://fly.io (more configuration required)
- **Heroku**: No longer has free tier
- **AWS/Azure/GCP**: More complex, not recommended for beginners

## Environment Variables Summary

### Backend (.env)

```
GEMINI_API_KEY=your_actual_key
ELEVENLABS_API_KEY=your_actual_key
PORT=5001
NODE_ENV=production
```

### Frontend (.env.production)

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## Troubleshooting

### Backend not responding

- Check Render logs for errors
- Verify environment variables are set correctly
- Check if free tier is asleep (Render free tier sleeps after inactivity)

### Frontend can't connect to backend

- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS settings in backend
- Check browser console for errors

### API calls failing

- Verify API keys are set in Render dashboard
- Check backend logs for API errors
- Ensure Gemini API quota is not exceeded

## Cost Estimate

- Frontend (Vercel): **FREE**
- Backend (Render): **FREE** (may sleep after 15 min inactivity)
- Custom Domain (optional): **$10-15/year**

## Performance Tips

- Render free tier sleeps after inactivity - first request may take 30s
- Consider upgrading to Render paid tier ($7/mo) for always-on backend
- Use Vercel Edge Functions for faster API responses

## Support

For issues or questions, check the README or open an issue on GitHub.
