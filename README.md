# 🎾 Rothof Tennis Court Monitor

Get email notifications when tennis courts become available at Rothof München.

---

## ☁️ Quick Deploy (5 Minutes)

**Run 24/7 in the cloud without your computer!**

1. Go to https://railway.app
2. Sign in with GitHub
3. Deploy from repo: `swarajrath/rothof_tennis_monitor`
4. Add environment variables:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   NOTIFY_EMAIL=your@gmail.com
   MONITOR_DATE=2026-06-24
   MONITOR_TIME=19:00
   MONITOR_COURT_TYPE=freiplatz
   ```
5. Done! Get notified via email 📧

**Full Guide**: [DEPLOY.md](DEPLOY.md)

---

## ✨ Features

- 🎾 **Real-time monitoring** - Scrapes Eversports widget every 5 minutes
- 📧 **Email notifications** - Get notified when courts become available
- 🌤️ **Court filtering** - Monitor Freiplatz (outdoor) or Halle (indoor) only
- ⏰ **Flexible scheduling** - Pick any date and time to monitor
- ☁️ **Cloud deployment** - Runs 24/7 without your computer
- 🎨 **Web interface** - Easy configuration (no code editing)

---

## 🖥️ Local Setup (Alternative)

Run on your computer instead of the cloud:

1. **Clone repository**
   ```bash
   git clone https://github.com/swarajrath/rothof_tennis_monitor.git
   cd rothof_tennis_monitor
   npm install
   ```

2. **Configure via web interface**
   ```bash
   cd web-interface
   open index.html
   ```
   - Pick date, time, court type
   - Click "Save"
   - Move downloaded `rothof-config.json` to project root

3. **Setup email**
   ```bash
   cp .env.example .env
   nano .env  # Add your email credentials
   ```

4. **Start monitoring**
   ```bash
   node start-from-config.js
   ```

**Full Guide**: [QUICKSTART.md](QUICKSTART.md)

---

## 📖 Documentation

- **[DEPLOY.md](DEPLOY.md)** - Cloud deployment (Railway, Render, AWS)
- **[QUICKSTART.md](QUICKSTART.md)** - Local setup guide
- **[COURT-TYPES.md](COURT-TYPES.md)** - Court IDs and filtering

---

## 🏟️ Court Types

- **Freiplatz (Outdoor)** - 12 courts (Platz 7-18)
- **Halle (Indoor)** - 6 courts (Platz 1-6)

Filter by type:
- `freiplatz` - Outdoor only
- `halle` - Indoor only
- `all` - All courts

---

## 💰 Cost

### Cloud Options:
- **Railway**: Free for 3 months ($5 credit), then ~$1.50/month
- **Render**: Free forever (with limitations)
- **AWS EC2**: Free for 1 year, then ~$8/month

### Local:
- Free (your computer must stay on)

---

## 🔧 How It Works

1. **Every 5 minutes**: Scrapes Rothof's Eversports booking calendar
2. **Checks availability**: For your specified date, time, and court type
3. **Detects changes**: When a court becomes newly available
4. **Sends email**: "🎾 Court Available at Rothof!"
5. **Repeats**: Continuously monitors 24/7

---

## 📧 Example Notification

**Subject**: 🎾 2 Rothof Courts Now Available!

**Body**:
- **June 24** at **19:00** - Court 44921 (Freiplatz)
- **June 24** at **19:00** - Court 44922 (Freiplatz)

[**Book Now!**]

---

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Puppeteer** - Headless browser for scraping
- **Nodemailer** - Email notifications
- **Eversports** - Rothof's booking system

---

## 📝 License

MIT

---

## 🤝 Contributing

Issues and pull requests welcome!

---

**Get started**: [DEPLOY.md](DEPLOY.md) for cloud or [QUICKSTART.md](QUICKSTART.md) for local setup.
