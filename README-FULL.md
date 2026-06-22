# Rothof Tennis Court Monitor

Monitor court availability at Rothof München and get email notifications when courts become free.

## 🚀 Quick Deploy (Cloud)

### Render.com (Free - Recommended)

1. Fork/star this repo
2. Sign up at [render.com](https://render.com)
3. New Background Worker → Connect this repo
4. Add environment variables:
   - `EMAIL_SERVICE=gmail`
   - `EMAIL_USER=your@email.com`
   - `EMAIL_PASSWORD=your-app-password`
   - `NOTIFY_EMAIL=your@email.com`
5. Deploy!

### Railway.app (Free $5 credit)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/swarajrath/rothof_tennis_monitor)

1. Click button above
2. Add same environment variables
3. Deploy!

## 💻 Local Setup

```bash
git clone https://github.com/swarajrath/rothof_tennis_monitor.git
cd rothof_tennis_monitor
npm install
node setup.js  # Interactive configuration
npm start
```

## 📖 Full Documentation

- **[USAGE.md](USAGE.md)** - Quick start guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy for 24/7 monitoring
- **[README-FULL.md](README-FULL.md)** - Complete documentation

## ✨ Features

- 🎾 Monitors Rothof München tennis courts via Eversports API
- ⏰ Configurable target times (18:00, 19:00, etc.)
- 📧 Email notifications when courts become available
- 🔄 Runs continuously (every 5 min by default)
- 🎯 Smart: only notifies on newly available slots

## ⚙️ Configuration

Edit `index.js`:

```javascript
const monitor = new RothofMonitor({
  checkIntervalMinutes: 5,               // Check frequency
  targetTimes: ['1800', '1900', '2000'], // Times to monitor
  daysAhead: 7                           // Days to check ahead
});
```

## 🔧 Requirements

- Node.js 18+
- Email account (Gmail recommended with App Password)

## 📝 Environment Variables

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NOTIFY_EMAIL=your-email@gmail.com
```

## 🛠️ Commands

```bash
npm start      # Start monitoring
npm test       # Test API connection
npm run setup  # Interactive setup wizard
```

## 📊 How It Works

1. Polls Eversports API every 5 minutes
2. Checks next 7 days for availability at target times
3. Tracks previous state to detect newly available slots
4. Sends email notification when a court becomes free
5. No spam - only one notification per new slot

## 🐛 Troubleshooting

**No emails?**
- Use Gmail App Password (not regular password)
- Check spam folder
- Verify `.env` credentials

**API errors?**
- Run `npm test` to check connectivity
- Eversports might be down temporarily

See [DEPLOYMENT.md](DEPLOYMENT.md) for 24/7 hosting options.

## 📄 License

MIT
