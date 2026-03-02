# 🚀 Step-by-Step Deployment Guide for Bryan

## 📥 STEP 0: Download the Project

You should see TWO files above this document:
1. **"Insights Portal"** (folder)
2. **"Insights Portal.tar"** (compressed file)

**Download EITHER ONE** - they contain the same files.

---

## 🎯 STEP 1: Extract and Setup (10 minutes)

### 1.1 Extract the Files

**If you downloaded the folder:**
- Just open it, you're ready!

**If you downloaded the .tar.gz file:**
- Right-click → Extract All (Windows)
- Or double-click (Mac)
- Extract to: `C:\Projects\Insights_Portal` (or anywhere you like)

### 1.2 Copy Your .env File

```
FROM: C:\Users\bryan\My Files\AI\_secrets\PowerBI-Copilot\.env
TO:   C:\Projects\Insights_Portal\.env
```

**Windows Command:**
```cmd
copy "C:\Users\bryan\My Files\AI\_secrets\PowerBI-Copilot\.env" "C:\Projects\Insights_Portal\.env"
```

**Verify it worked:**
- Open `C:\Projects\Insights_Portal\.env`
- You should see your Google Drive credentials, Supabase URL, etc.

---

## 🎯 STEP 2: Install Node.js (if not installed)

### 2.1 Check if Node.js is Installed

Open Command Prompt or PowerShell:
```cmd
node --version
```

**If you see:** `v18.x.x` or higher → You're good! Skip to Step 3.

**If you see:** "not recognized" → Install Node.js:

### 2.2 Install Node.js

1. Go to: https://nodejs.org/
2. Download the **LTS version** (left button)
3. Run the installer
4. Click "Next" through all steps
5. Restart Command Prompt
6. Verify: `node --version`

---

## 🎯 STEP 3: Install Backend Dependencies (5 minutes)

### 3.1 Open Command Prompt

**Windows:**
- Press `Windows + R`
- Type: `cmd`
- Press Enter

### 3.2 Navigate to Backend Folder

```cmd
cd C:\Projects\Insights_Portal\backend
```

(Replace path if you extracted elsewhere)

### 3.3 Install Dependencies

```cmd
npm install
```

**Wait 2-3 minutes.** You'll see lots of packages being installed.

**When done, you should see:**
```
added XXX packages
```

---

## 🎯 STEP 4: Install Frontend Dependencies (5 minutes)

### 4.1 Navigate to Frontend Folder

```cmd
cd C:\Projects\Insights_Portal\frontend
```

### 4.2 Install Dependencies

```cmd
npm install
```

**Wait 2-3 minutes.**

---

## 🎯 STEP 5: Start Backend Server (2 minutes)

### 5.1 Open First Command Prompt

Keep your current Command Prompt open, navigate to backend:

```cmd
cd C:\Projects\Insights_Portal\backend
npm run dev
```

**You should see:**
```
✨ Server running on port 3001
🌍 Environment: development
✅ Supabase initialized
✅ Google Drive initialized
✅ MCP Server initialized
```

**LEAVE THIS WINDOW OPEN** - the server is running!

---

## 🎯 STEP 6: Start Frontend Server (2 minutes)

### 6.1 Open SECOND Command Prompt

Open a NEW Command Prompt window:

**Windows:**
- Press `Windows + R`
- Type: `cmd`
- Press Enter

### 6.2 Start Frontend

```cmd
cd C:\Projects\Insights_Portal\frontend
npm start
```

**Wait 10-20 seconds.**

**Browser should automatically open:** `http://localhost:3000`

**You should see:** Aiko login page with professional blue design!

---

## 🎯 STEP 7: Test Locally (10 minutes)

### 7.1 Create Account

1. Click "Sign up"
2. Enter:
   - Full Name: Bryan Panopio
   - Email: bryan@test.com
   - Password: Test123456!
3. Click "Create Account"

**Should redirect to login automatically**

### 7.2 Sign In

1. Enter:
   - Email: bryan@test.com
   - Password: Test123456!
2. Click "Sign In"

**You should see:** 3-pane interface!

### 7.3 Check Reports List (Left Pane)

**Expected:**
- Should show "PowerBI_Reports" or categories
- Click to expand
- Should see "Superstore 2025.pbix"

**If you DON'T see reports:**
→ We need to do Google Drive authentication (next step)

### 7.4 Select a Report

1. Click "Superstore 2025.pbix"
2. Center pane should show report header
3. Right pane should show chat interface

### 7.5 Test Chat

1. In right pane chat box, type: "What is this report about?"
2. Press Enter or click Send
3. Aiko should respond!

**✅ If all this works, you're ready to deploy!**

---

## 🎯 STEP 8: Google Drive Authentication (5 minutes)

**This is ONE-TIME ONLY**

### 8.1 Get Auth URL

In browser, visit:
```
http://localhost:3001/api/auth/google/url
```

**You'll see JSON like:**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### 8.2 Copy and Visit the URL

1. Copy the ENTIRE `authUrl` value
2. Paste it in a new browser tab
3. Press Enter

### 8.3 Authorize Google

1. Sign in with your Google account (the one with PowerBI_Reports folder)
2. Click "Allow" to grant access
3. You'll be redirected back

**You should see:** "google_auth=success" in the URL

**Done!** Token is saved. You won't need to do this again.

### 8.4 Verify Reports Load

1. Go back to: `http://localhost:3000`
2. Refresh the page
3. Click on reports in left pane
4. Should now see your PBIX files!

---

## 🎯 STEP 9: Push to GitHub (5 minutes)

### 9.1 Open Git Bash or Command Prompt

Navigate to project:
```cmd
cd C:\Projects\Insights_Portal
```

### 9.2 Initialize Git (if needed)

```cmd
git init
git remote add origin https://github.com/agentbryanpanopio/Insights_Portal.git
```

### 9.3 Add All Files

```cmd
git add .
```

### 9.4 Commit

```cmd
git commit -m "Initial commit: Aiko Insights Portal complete"
```

### 9.5 Push to GitHub

```cmd
git push -u origin main
```

**If prompted for credentials:**
- Username: agentbryanpanopio
- Password: Use a GitHub Personal Access Token (not your password)

**To create token:**
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select "repo" scope
4. Copy and use as password

---

## 🎯 STEP 10: Deploy to Vercel (30 minutes)

### 10.1 Create Vercel Account

1. Go to: https://vercel.com/
2. Click "Sign Up"
3. Click "Continue with GitHub"
4. Authorize Vercel

**Done! You're logged in.**

### 10.2 Import Project

1. Click "Add New..." → "Project"
2. You should see "Insights_Portal" in the list
3. Click "Import"

### 10.3 Configure Build Settings

**Root Directory:**
- Click "Edit"
- Select: `frontend`

**Framework Preset:**
- Should auto-detect: "Vite"

**Build Command:**
- Should auto-fill: `npm run build`

**Output Directory:**
- Should auto-fill: `build`

**Install Command:**
- Should auto-fill: `npm install`

### 10.4 Add Environment Variables

**CRITICAL STEP!**

Click "Environment Variables"

**Add EACH of these from your .env file:**

```
GOOGLE_DRIVE_CLIENT_ID = [paste value from .env]
GOOGLE_DRIVE_CLIENT_SECRET = [paste value from .env]
GOOGLE_DRIVE_POWERBI_FOLDER_ID = 1SDHWPU9Cx4IG65JUSOVoKymnfc703OYs
GOOGLE_DRIVE_DOCUMENTATION_FOLDER_ID = 15pR3eEm2TzIL-6OPKcO6bZ5CTI029nMz
GOOGLE_DRIVE_SKILLS_FOLDER_ID = 10216GUujQO6O3NYDV6nchhC0kFNjMrkH
GOOGLE_DRIVE_SCRIPTS_FOLDER_ID = 1DMZcQ5YaoedETQ6Dhg64SerT-uS2yPR8
GOOGLE_DRIVE_TEMP_FOLDER_ID = 1Y2KXbbk4-j8d56FNgjD5pCa4AcHX4w4y
GOOGLE_DRIVE_REDIRECT_URI = https://aiko.datadictum.com/auth/google/callback
SUPABASE_URL = [paste from .env]
SUPABASE_ANON_KEY = [paste from .env]
SUPABASE_DB_PASSWORD = [paste from .env]
ANTHROPIC_API_KEY = [paste from .env]
ANTHROPIC_MODEL = claude-sonnet-4-20250514
ANTHROPIC_MAX_TOKENS = 4096
NODE_ENV = production
PORT = 3001
FRONTEND_URL = https://aiko.datadictum.com
API_BASE_URL = https://aiko.datadictum.com/api
SESSION_SECRET = [paste from .env or generate new random string]
JWT_SECRET = [paste from .env or generate new random string]
CORS_ORIGINS = https://aiko.datadictum.com
```

**For each variable:**
1. Enter the key (name)
2. Enter the value
3. Click "Add"

### 10.5 Deploy!

1. Click "Deploy"
2. Wait 3-5 minutes
3. Watch the build logs

**When successful:**
- You'll see "🎉 Congratulations!"
- You get a URL like: `insights-portal-xyz.vercel.app`

### 10.6 Test Vercel URL

1. Click "Visit" button
2. Should see Aiko login page
3. Try to sign in
4. Test basic functionality

**If it works → Proceed to custom domain!**

---

## 🎯 STEP 11: Add Custom Domain (15 minutes)

### 11.1 In Vercel Dashboard

1. Go to your project
2. Click "Settings"
3. Click "Domains"
4. Enter: `aiko.datadictum.com`
5. Click "Add"

**Vercel will show:**
```
Add the following record to your DNS:
Type: CNAME
Name: aiko
Value: cname.vercel-dns.com
```

### 11.2 In Hostinger

1. Log in to: https://www.hostinger.com/
2. Go to "Domains"
3. Click "Manage" next to datadictum.com
4. Find "DNS / Name Servers" or "DNS Zone"
5. Click "Add Record" or "Manage DNS"

**Add new record:**
- Type: `CNAME`
- Name: `aiko`
- Value: `cname.vercel-dns.com`
- TTL: `3600` (or leave default)

6. Click "Save" or "Add Record"

### 11.3 Wait for DNS Propagation

**Time:** 5-30 minutes (usually 10 minutes)

**Check status in Vercel:**
- Go back to Vercel → Domains
- Should say "Valid Configuration" when ready

**Test it:**
```
https://aiko.datadictum.com
```

**When it works:**
- ✅ Shows Aiko login page
- ✅ Green padlock (SSL) 🔒
- ✅ Can sign in
- ✅ Can select reports
- ✅ Can chat with Aiko

---

## 🎯 STEP 12: Update Google OAuth Redirect (5 minutes)

**Important:** Update your Google Cloud Console

1. Go to: https://console.cloud.google.com/
2. Select your project: "PowerBI-Copilot"
3. Go to: APIs & Services → Credentials
4. Click your OAuth 2.0 Client ID
5. Under "Authorized redirect URIs", add:
   ```
   https://aiko.datadictum.com/auth/google/callback
   ```
6. Click "Save"

---

## ✅ DONE! Your Site is Live!

Visit: **https://aiko.datadictum.com**

You should be able to:
- ✅ Sign up / Sign in
- ✅ See your reports from Google Drive
- ✅ Select a report
- ✅ Chat with Aiko about the report
- ✅ View chat history

---

## 🆘 Troubleshooting

### Backend won't start
**Error:** "Cannot find module"
**Fix:** Run `npm install` in backend folder again

### Frontend won't start
**Error:** "Port 3000 already in use"
**Fix:** `npx kill-port 3000` then try again

### Reports don't load
**Fix:** Complete Google Drive authentication (Step 8)

### Vercel deploy fails
**Fix:** Check all environment variables are added correctly

### Custom domain doesn't work
**Fix:** Wait 30 minutes, check CNAME record is correct

---

## 📞 Need Help?

Come back to this chat and tell me:
1. Which step you're on
2. What error you see
3. Screenshot if possible

I'll help you fix it! 🚀

---

**🎉 Good luck! You're about 2 hours away from having your live site!**
