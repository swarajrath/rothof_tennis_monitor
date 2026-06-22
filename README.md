# Rothof Tennis Court Monitor

Monitor court availability at Rothof München and get email notifications when courts become free.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

## 🚀 Deploy for 24/7 Monitoring

### Option 1: Render.com (Free, Easiest)

1. Sign up at [render.com](https://render.com)
2. New → Background Worker
3. Connect repo: `swarajrath/rothof_tennis_monitor`
4. Add environment variables (see below)
5. Deploy!

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
