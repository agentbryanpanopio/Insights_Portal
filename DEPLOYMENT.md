# 🚀 Aiko Insights Portal - Deployment Guide

## Prerequisites Checklist

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Git installed
- ✅ All credentials from setup steps (Google Drive, Supabase, Anthropic)
- ✅ GitHub account with Insights_Portal repository access

---

## Step 1: Clone and Setup

### 1.1 Clone Your Repository

```bash
git clone https://github.com/agentbryanpanopio/Insights_Portal.git
cd Insights_Portal
```

### 1.2 Create .env File

Copy your .env file from `C:\Users\bryan\My Files\AI\_secrets\PowerBI-Copilot\.env` to the root of the project:

```bash
# On Windows
copy "C:\Users\bryan\My Files\AI\_secrets\PowerBI-Copilot\.env" .env

# Or manually copy the file to: Insights_Portal/.env
```

**CRITICAL:** Verify the .env file contains all your credentials:
```
GOOGLE_DRIVE_CLIENT_ID=619456123299...
GOOGLE_DRIVE_CLIENT_SECRET=GOCSPX-1WRnfNG...
SUPABASE_URL=https://gvqhtrdvzvt...
ANTHROPIC_API_KEY=sk-ant-api03-LrGLY3o...
```

---

## Step 2: Install Dependencies

### 2.1 Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- Express.js (API server)
- Anthropic SDK (Claude AI)
- Google APIs (Drive integration)
- Supabase client
- And all other dependencies

### 2.2 Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs:
- React
- Vite (build tool)
- Tailwind CSS
- React Router
- And other UI dependencies

---

## Step 3: Google Drive Authentication

### 3.1 Initial OAuth Flow

The first time you run the backend, you'll need to authenticate with Google Drive:

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a browser, visit:
```
http://localhost:3001/api/auth/google/url
```

3. Copy the `authUrl` from the response
4. Open that URL in your browser
5. Sign in with your Google account
6. Authorize the application
7. You'll be redirected back (callback handled automatically)

A `.google-tokens.json` file will be created - this is used for future requests.

**Note:** Add `.google-tokens.json` to your .gitignore (already done)

---

## Step 4: Test Locally

### 4.1 Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✨ Server running on port 3001
🌍 Environment: development
✅ Supabase initialized
✅ Google Drive initialized
```

### 4.2 Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm start
```

Browser should open to `http://localhost:3000`

### 4.3 Test the Application

1. **Create an account:**
   - Click "Sign Up"
   - Enter email and password
   - Create account

2. **Sign in:**
   - Use your credentials
   - Should redirect to main app

3. **Test report listing:**
   - Left pane should show "PowerBI_Reports" folder
   - Should list "Superstore 2025.pbix"

4. **Test chat:**
   - Select the report
   - Ask Aiko a question
   - Verify response appears

---

## Step 5: Prepare for Production

### 5.1 Update Environment Variables

Create a production `.env` file (or update existing):

```bash
# Change these for production
NODE_ENV=production
FRONTEND_URL=https://aiko.datadictum.com
API_BASE_URL=https://aiko.datadictum.com/api
CORS_ORIGINS=https://aiko.datadictum.com
GOOGLE_DRIVE_REDIRECT_URI=https://aiko.datadictum.com/auth/google/callback
```

### 5.2 Build Frontend

```bash
cd frontend
npm run build
```

This creates optimized production files in `frontend/build/`

---

## Step 6: Deploy to Vercel

### 6.1 Install Vercel CLI (optional)

```bash
npm install -g vercel
```

### 6.2 Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/
2. Click "Add New Project"
3. Import `agentbryanpanopio/Insights_Portal` from GitHub
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add all variables from your .env file
   - **IMPORTANT:** Add them one by one in Vercel dashboard

6. Click "Deploy"

### 6.3 Deploy Backend (Serverless Functions)

Vercel also hosts the backend. In your project:

1. Create `vercel.json` in root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/build/$1"
    }
  ]
}
```

2. Redeploy from Vercel dashboard

---

## Step 7: Configure Custom Domain

### 7.1 Add Domain in Vercel

1. In Vercel project settings, click "Domains"
2. Add `aiko.datadictum.com`
3. Vercel will show DNS instructions

### 7.2 Update Hostinger DNS

1. Log in to Hostinger
2. Go to `datadictum.com` → DNS settings
3. Add CNAME record:
   - **Type:** CNAME
   - **Name:** aiko
   - **Value:** cname.vercel-dns.com
   - **TTL:** 3600

4. Save and wait for propagation (5-30 minutes)

### 7.3 Verify SSL

- Vercel automatically provisions SSL certificate
- Once DNS propagates, `https://aiko.datadictum.com` will work
- HTTP automatically redirects to HTTPS

---

## Step 8: Post-Deployment

### 8.1 Test Production Site

Visit `https://aiko.datadictum.com` and test:
- ✅ Sign up / Sign in
- ✅ Load reports list
- ✅ Select a report
- ✅ Chat with Aiko
- ✅ Check chat history link

### 8.2 Monitor Logs

In Vercel dashboard:
- Check "Deployments" for build logs
- Check "Functions" for API logs
- Monitor for errors

### 8.3 Set Up Monitoring

Optional but recommended:
- Enable Vercel Analytics
- Set up error tracking (Sentry)
- Monitor API usage (Anthropic dashboard)

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution:** Run `npm install` in both frontend and backend

### Issue: Google Drive authentication fails

**Solution:**
1. Verify OAuth credentials in .env
2. Check redirect URI matches: `https://aiko.datadictum.com/auth/google/callback`
3. Update in Google Cloud Console if needed

### Issue: Supabase authentication not working

**Solution:**
1. Verify Supabase URL and keys in .env
2. Check CORS settings in Supabase dashboard
3. Ensure email confirmation is disabled for testing

### Issue: Frontend can't reach backend API

**Solution:**
1. Verify backend is running on port 3001
2. Check proxy configuration in `vite.config.js`
3. Verify CORS_ORIGINS includes frontend URL

### Issue: Vercel deployment fails

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Verify `vercel.json` configuration
4. Try deploying from CLI: `vercel --prod`

---

## Security Checklist

Before going live:

- ✅ All secrets in environment variables (not code)
- ✅ .env file NOT committed to Git
- ✅ HTTPS enforced (automatic with Vercel)
- ✅ CORS configured correctly
- ✅ Rate limiting enabled
- ✅ Strong session secrets generated
- ✅ Supabase Row Level Security configured
- ✅ Google Drive folders have proper permissions

---

## Maintenance

### Regular Tasks

1. **Monitor API usage:** Check Anthropic usage daily
2. **Review logs:** Check Vercel logs weekly
3. **Update dependencies:** Run `npm update` monthly
4. **Backup chat history:** Google Drive auto-syncs
5. **Review user feedback:** Check for issues

### Updating the App

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
cd backend && npm install
cd ../frontend && npm install

# Rebuild and redeploy
git push origin main  # Vercel auto-deploys
```

---

## Cost Estimate

### Current Setup Costs

- **Vercel:** FREE (Hobby plan sufficient)
- **Supabase:** FREE (up to 50,000 users)
- **Google Drive:** FREE (2TB included in Google AI Pro)
- **Domain:** $12/year (datadictum.com)
- **Anthropic API:** Pay-as-you-go (~$5-20/month depending on usage)

**Total:** ~$12/year + API usage

---

## Next Steps After Deployment

1. ✅ Test with real Power BI reports
2. ✅ Invite beta users
3. ✅ Gather feedback
4. ✅ Iterate on features
5. ✅ Document common questions

---

## Support

- GitHub Issues: https://github.com/agentbryanpanopio/Insights_Portal/issues
- Documentation: Check `/docs` folder
- Chat History: Available in Google Drive Documentation folder

---

**🎉 Congratulations! Your Aiko Insights Portal is now live!**
