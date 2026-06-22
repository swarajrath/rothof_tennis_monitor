# Rothof Tennis Court Monitor

Monitor court availability at Rothof München and get email notifications when courts become free.

## ☁️ Deploy to Cloud (Recommended)

**Runs 24/7 without your computer!**

### Quick Deploy to Railway.app (5 minutes):

1. Go to https://railway.app
2. Sign in with GitHub  
3. Deploy from repo: `swarajrath/rothof_tennis_monitor`
4. Add environment variables (email, date, time, court type)
5. Done! Get notified via email 📧

**Full Guide**: [RAILWAY-DEPLOYMENT.md](RAILWAY-DEPLOYMENT.md)

**Other Options**: [CLOUD-DEPLOYMENT.md](CLOUD-DEPLOYMENT.md) (Render, AWS, DigitalOcean)

---

## 🖥️ Or Run Locally

### Web Interface (Easy)

Configure visually - no code editing needed!

```bash
cd ~/rothof-monitor/web-interface
open index.html
```

Pick your date, time, and court type. Click Save. Run `node start-from-config.js`. Done! 🎉

**Full Guide**: [QUICKSTART.md](QUICKSTART.md)

---

## 🚀 Features

### Option 2: Railway.app (Free $5 credit)

1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub repo
3. Add environment variables
4. Done!

### Option 3: Your Computer (macOS)

```bash
cd ~/rothof-monitor
node setup.js  # Configure once
npm start      # Or see DEPLOYMENT.md for background service
```

**See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides (AWS, Raspberry Pi, DigitalOcean, etc.)**

## 💻 Local Development

```bash
git clone https://github.com/swarajrath/rothof_tennis_monitor.git
cd rothof_tennis_monitor
npm install
node setup.js
npm start
```

## ⚙️ Environment Variables

Required for cloud deployment:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NOTIFY_EMAIL=your-email@gmail.com
```

**Gmail users:** Create an App Password at https://myaccount.google.com/apppasswords

## ✨ Features

- 🎾 Monitors Rothof München courts via Eversports API
- ⏰ Configurable times (default: 18:00, 19:00, 20:00)
- 📧 Email alerts when courts become available
- 🔄 Checks every 5 minutes (configurable)
- 🎯 Smart notifications (no spam)

## 🛠️ Configuration

Edit `index.js`:

```javascript
const monitor = new RothofMonitor({
  checkIntervalMinutes: 5,               // How often to check
  targetTimes: ['1800', '1900', '2000'], // Times to monitor
  daysAhead: 7                           // Days to look ahead
});
```

## 📝 Commands

```bash
npm start       # Start monitoring
npm test        # Test API connection
npm run setup   # Configure email settings
```

## 📖 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy for 24/7 monitoring (AWS, Render, Railway, etc.)
- **[USAGE.md](USAGE.md)** - Detailed usage guide
- **[README-FULL.md](README-FULL.md)** - Complete technical docs

## 🐛 Troubleshooting

**No emails?** Use Gmail App Password, check spam folder, verify `.env`

**API errors?** Run `npm test`, check Eversports is accessible

## 📄 License

MIT
