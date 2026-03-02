# Aiko Insights Portal

An AI-powered Power BI companion that enables natural language conversations with your Power BI reports.

## 🎯 Features

- **3-Pane Interface**: Workspace browser, report viewer, and AI chat
- **Microsoft Authentication**: Secure user login with Supabase
- **PBIX Integration**: Direct querying of Power BI reports via MCP Server
- **Smart AI Assistant (Aiko)**: Context-aware responses using Claude AI
- **Google Drive Sync**: Automatic synchronization of documentation, skills, and scripts
- **Chat History**: Persistent conversation logs with session management
- **Responsive Design**: Resizable panes with professional minimalist aesthetic

## 🏗️ Architecture

```
Frontend (React + Tailwind CSS)
    ↓
Backend (Node.js + Express)
    ↓
├── Supabase (Authentication & User Management)
├── Google Drive API (PBIX Storage & Sync)
├── Anthropic Claude API (AI Responses)
└── Power BI MCP Server (PBIX Querying)
```

## 📁 Project Structure

```
Insights_Portal/
├── frontend/                 # React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   └── package.json
├── backend/                 # Node.js server
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic
│   ├── middleware/          # Express middleware
│   ├── config/              # Configuration
│   └── server.js            # Entry point
├── docs/                    # Documentation (synced from Google Drive)
├── skills/                  # AI skills (synced from Google Drive)
├── scripts/                 # Python scripts (synced from Google Drive)
├── .env.example             # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+ (for MCP Server)
- Google Drive account with API access
- Supabase account
- Anthropic API key

### 1. Clone the Repository

```bash
git clone https://github.com/agentbryanpanopio/Insights_Portal.git
cd Insights_Portal
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
- Google Drive API credentials
- Supabase URL and keys
- Anthropic API key
- Folder IDs for your Google Drive folders

### 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Run the Application

**Development Mode:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

The app will be available at `http://localhost:3000`

### 5. First Time Setup

1. Navigate to `http://localhost:3000`
2. Create an account or log in
3. The app will sync with your Google Drive folders
4. Upload PBIX files to your PowerBI_Reports folder in Google Drive
5. Start chatting with your reports!

## 🔧 Configuration

### Google Drive Folders

The app syncs with 5 Google Drive folders:

1. **PowerBI_Reports**: Store your .pbix files
2. **Documentation**: Auto-generated metadata and chat history
3. **Skills**: AI prompt templates and skills
4. **Scripts**: Python automation scripts
5. **Temp**: Temporary file storage

### Environment Variables

See `.env.example` for all required variables and their descriptions.

## 📖 Usage

### Selecting a Report

1. Log in to the application
2. Browse workspaces and reports in the left pane
3. Click on a report to load it

### Asking Questions

Aiko can help you with:
- Understanding report metrics and measures
- Analyzing trends and patterns
- Explaining DAX formulas
- Querying specific data points
- Generating insights from visualizations

Example questions:
- "What was the total sales in Q4 2024?"
- "Why is there a spike in March?"
- "Explain the Total Revenue measure"
- "Show me the top 5 products by profit"

### Chat History

- Each session creates a new chat history file
- Access your chat history via the link in the chat pane header
- Files are synced to Google Drive Documentation folder

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Custom Domain Setup

1. Add your custom domain in Vercel
2. Update DNS records in your domain registrar:
   - CNAME: `aiko` → `cname.vercel-dns.com`
3. Wait for SSL certificate provisioning (automatic)

## 🔒 Security

- All credentials stored in environment variables
- Google Drive uses OAuth 2.0 authentication
- Supabase handles secure user authentication
- HTTPS enforced in production
- Rate limiting on API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 🐛 Troubleshooting

### MCP Server Connection Issues
- Ensure Python dependencies are installed
- Check that PBIX files are accessible in Google Drive

### Google Drive Sync Errors
- Verify OAuth credentials are correct
- Check folder IDs match your Google Drive folders
- Ensure folder permissions allow read/write access

### Authentication Issues
- Verify Supabase credentials
- Check that email confirmation is disabled for testing
- Clear browser cache and cookies

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Check existing documentation in `/docs`
- Review chat logs for debugging

---

**Built with ❤️ using Claude AI, React, Node.js, and the Power BI MCP Server**
