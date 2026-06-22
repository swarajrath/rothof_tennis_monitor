# Project Structure

```
rothof_tennis_monitor/
├── 📄 Core Application
│   ├── start-from-config.js      # Main entry point (reads config)
│   ├── monitor-scraper.js         # Monitoring logic with email
│   ├── web-scraper.js             # Puppeteer scraper for Eversports
│   └── index-scraper.js           # Alternative entry point
│
├── 🌐 Web Interface
│   └── web-interface/
│       ├── index.html             # Configuration UI
│       └── README.md              # Web interface guide
│
├── 📖 Documentation
│   ├── README.md                  # Project overview
│   ├── DEPLOY.md                  # Cloud deployment guide
│   ├── QUICKSTART.md              # Local setup guide
│   └── COURT-TYPES.md             # Court reference
│
├── ⚙️ Configuration
│   ├── .env.example               # Email config template
│   ├── package.json               # Dependencies
│   ├── Procfile                   # Cloud deployment config
│   └── railway.json               # Railway.app config
│
└── 🗑️ Git
    └── .gitignore                 # Ignored files

Total: 18 files
```

## File Descriptions

### Core Application

**start-from-config.js**
- Entry point that reads configuration
- Supports both JSON file and environment variables
- Starts the monitor

**monitor-scraper.js**
- Main monitoring logic
- Checks availability via web scraper
- Detects newly available courts
- Sends email notifications
- Tracks state between checks

**web-scraper.js**
- Puppeteer-based scraper
- Navigates Eversports calendar
- Extracts availability data
- Returns court availability status

**index-scraper.js**
- Alternative entry point with hardcoded config
- Useful for quick testing

### Web Interface

**web-interface/index.html**
- Beautiful configuration UI
- Date, time, court type inputs
- Downloads rothof-config.json
- Works offline (no server needed)

### Documentation

**README.md** - Project overview and quick start  
**DEPLOY.md** - Detailed cloud deployment guide (Railway, Render, AWS)  
**QUICKSTART.md** - Local setup instructions  
**COURT-TYPES.md** - Court IDs and filtering reference

### Configuration Files

**.env.example** - Template for email configuration  
**package.json** - Node.js dependencies and scripts  
**Procfile** - Cloud deployment configuration  
**railway.json** - Railway.app specific config

## What's NOT Included

✅ **Removed 35+ files** including:
- Test scripts
- Debug scripts  
- Investigation scripts
- Old/duplicate code
- Debug outputs
- Redundant documentation

## Dependencies

```json
{
  "puppeteer": "Browser automation",
  "nodemailer": "Email notifications",
  "dotenv": "Environment variables"
}
```

## Usage Flows

### Cloud Deployment:
1. Deploy to Railway/Render
2. Set environment variables
3. Monitor runs automatically

### Local Setup:
1. Open `web-interface/index.html`
2. Configure and download JSON
3. Run `node start-from-config.js`

**Clean, production-ready codebase! 🎉**
