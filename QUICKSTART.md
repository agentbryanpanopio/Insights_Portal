# ⚡ Quick Start Guide

Get Aiko Insights Portal running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- Git installed
- Your `.env` file ready

---

## 🚀 Steps

### 1. Clone & Navigate

```bash
git clone https://github.com/agentbryanpanopio/Insights_Portal.git
cd Insights_Portal
```

### 2. Add Your .env File

Copy your `.env` file from:
```
C:\Users\bryan\My Files\AI\_secrets\PowerBI-Copilot\.env
```

To the project root:
```
Insights_Portal/.env
```

Or create it manually with your credentials.

### 3. Install Backend

```bash
cd backend
npm install
```

Wait for installation to complete (~2 minutes).

### 4. Install Frontend

```bash
cd ../frontend
npm install
```

Wait for installation to complete (~2 minutes).

### 5. Start Backend

Open Terminal 1:

```bash
cd backend
npm run dev
```

You should see:
```
✨ Server running on port 3001
✅ Supabase initialized
✅ Google Drive initialized
```

### 6. Start Frontend

Open Terminal 2:

```bash
cd frontend
npm start
```

Browser opens to `http://localhost:3000`

---

## ✅ Test It Works

### First Time Setup

1. **Create Account:**
   - Click "Sign Up"
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Click "Create Account"

2. **Sign In:**
   - Use credentials from step 1
   - Should redirect to main app

3. **Google Drive Auth (One-Time):**
   - Visit in browser: `http://localhost:3001/api/auth/google/url`
   - Copy the `authUrl` value
   - Open that URL in browser
   - Sign in with your Google account
   - Authorize the app
   - You're done! (Token saved automatically)

### Test Reports

1. **Left Pane:** Should show "PowerBI_Reports" workspace
2. **Click to expand:** See "Superstore 2025.pbix"
3. **Click the report:** Loads in center pane

### Test Chat

1. **Right Pane:** Chat with Aiko
2. **Type:** "What is this report about?"
3. **Press Enter:** Aiko responds

---

## 🎯 What You Built

### 3-Pane Interface

```
┌──────────────┬──────────────────┬──────────────┐
│   Reports    │   Report Viewer  │    Chat      │
│   (Pane 1)   │     (Pane 2)     │  (Pane 3)    │
│              │                  │              │
│  - Workspace │   [Report]       │  Aiko: Hi!   │
│    └─Report  │                  │  User: ...   │
│  - Workspace │                  │              │
│              │                  │  [Chatbox]   │
└──────────────┴──────────────────┴──────────────┘
```

### Features Working

✅ User authentication (Supabase)  
✅ Report listing from Google Drive  
✅ AI chat with Claude  
✅ Session management  
✅ Chat history saving  
✅ Google Drive sync  

---

## 🛑 Common Issues

### "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm start -- --port 3001
```

### "Cannot find module"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Backend won't start

**Solution:**
1. Check `.env` file exists in root
2. Verify all credentials are correct
3. Check logs for specific error

### Frontend shows "Network Error"

**Solution:**
1. Ensure backend is running on port 3001
2. Check `vite.config.js` proxy settings
3. Try restarting both servers

---

## 📖 Next Steps

Once everything works locally:

1. **Read:** `DEPLOYMENT.md` for production deployment
2. **Explore:** Add more PBIX files to Google Drive
3. **Customize:** Modify colors in `tailwind.config.js`
4. **Deploy:** Push to Vercel when ready

---

## 💡 Tips

- Keep both terminal windows open
- Backend must start before frontend
- First Google auth is one-time only
- Chat history saves to `/docs/chat_history/`
- Check logs if something breaks

---

## 🆘 Need Help?

1. Check error messages in terminal
2. Review `README.md` for detailed docs
3. Check `DEPLOYMENT.md` for troubleshooting
4. Open GitHub issue if stuck

---

**🎉 You're all set! Start chatting with your Power BI reports!**
