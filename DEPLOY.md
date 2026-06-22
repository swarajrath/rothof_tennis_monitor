# 🚀 Deploy to Cloud - Complete Guide

Deploy to the cloud so the monitor runs 24/7 and you just receive email notifications.

---

## Quick Start: Railway.app (5 Minutes) ⭐ Recommended

**Why Railway?**
- ✅ Easiest setup (5 minutes)
- ✅ Free $5/month credit (~3 months free)
- ✅ Automatic deploys from GitHub
- ✅ Simple dashboard

### Step 1: Sign Up (1 min)
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub
4. Authorize Railway

### Step 2: Deploy (1 min)
1. Click "Deploy from GitHub repo"
2. Select `swarajrath/rothof_tennis_monitor`
3. Click "Deploy Now"

Railway automatically detects Node.js and starts building.

### Step 3: Configure (2 min)

Click your project → **"Variables"** tab

Add these environment variables:

```
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
NOTIFY_EMAIL=your@gmail.com
MONITOR_DATE=2026-06-24
MONITOR_TIME=19:00
MONITOR_COURT_TYPE=freiplatz
```

**Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2FA first
3. Create app password for "Mail"
4. Use the 16-character password (not your regular password)

### Step 4: Verify (1 min)

Go to **"Deployments"** → Click latest deployment → View **"Logs"**

You should see:
```
📡 Using configuration from environment variables

📋 Configuration loaded:
   Date: 2026-06-24
   Time: 19:00
   Court Type: freiplatz

🚀 Rothof Court Monitor Started
   Target date: 2026-06-24
   Target times: 19:00
   Court filter: 🌤️  Freiplatz only
   ...
```

### Done! 🎉

- Monitor runs 24/7 in the cloud
- You'll receive emails when courts become available
- No computer needed

**Cost**: ~$1.50/month (covered by free $5 credit for 3 months)

---

## Alternative Options

### Option 2: Render.com (Free Forever)

**Pros**: Free forever  
**Cons**: Spins down after 15 min idle

1. Sign up at https://render.com
2. New → "Background Worker"
3. Connect repo: `swarajrath/rothof_tennis_monitor`
4. Build Command: `npm install`
5. Start Command: `node start-from-config.js`
6. Add same environment variables as Railway
7. Deploy

### Option 3: AWS EC2 (Free 1 Year)

**Pros**: Full control, free for 1 year  
**Cons**: Complex setup

1. **Launch Instance**
   - Go to AWS Console → EC2
   - Launch t2.micro (free tier)
   - Ubuntu 22.04
   - Download key pair

2. **Connect**
   ```bash
   chmod 400 your-key.pem
   ssh -i your-key.pem ubuntu@instance-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   ```

4. **Clone & Setup**
   ```bash
   git clone https://github.com/swarajrath/rothof_tennis_monitor.git
   cd rothof_tennis_monitor
   npm install
   ```

5. **Configure**
   ```bash
   cat > .env << 'EOF'
   EMAIL_SERVICE=gmail
   EMAIL_USER=your@gmail.com
   EMAIL_PASSWORD=your-app-password
   NOTIFY_EMAIL=your@gmail.com
   EOF

   cat > rothof-config.json << 'EOF'
   {
     "date": "2026-06-24",
     "time": "19:00",
     "courtType": "freiplatz",
     "timestamp": "2026-06-22T16:00:00.000Z"
   }
   EOF
   ```

6. **Setup as Service**
   ```bash
   sudo nano /etc/systemd/system/rothof-monitor.service
   ```

   Paste:
   ```ini
   [Unit]
   Description=Rothof Court Monitor
   After=network.target

   [Service]
   Type=simple
   User=ubuntu
   WorkingDirectory=/home/ubuntu/rothof_tennis_monitor
   ExecStart=/usr/bin/node start-from-config.js
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

   Start:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable rothof-monitor
   sudo systemctl start rothof-monitor
   sudo systemctl status rothof-monitor
   ```

---

## Configuration Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONITOR_DATE` | Date to monitor (YYYY-MM-DD) | `2026-06-24` |
| `MONITOR_TIME` | Time to monitor (HH:MM) | `19:00` |
| `MONITOR_COURT_TYPE` | Court filter | `freiplatz` / `halle` / `all` |
| `EMAIL_SERVICE` | Email provider | `gmail` |
| `EMAIL_USER` | Your email address | `you@gmail.com` |
| `EMAIL_PASSWORD` | App password | `abcd efgh ijkl mnop` |
| `NOTIFY_EMAIL` | Who gets notified | `you@gmail.com` |

---

## Updating Configuration

### Railway/Render:
1. Go to dashboard
2. Click on "Variables"
3. Update `MONITOR_DATE`, `MONITOR_TIME`, or `MONITOR_COURT_TYPE`
4. Save (auto-restarts)

### AWS EC2:
```bash
ssh -i key.pem ubuntu@instance-ip
cd rothof_tennis_monitor
nano rothof-config.json  # Edit date/time/courtType
sudo systemctl restart rothof-monitor
```

---

## Monitoring & Logs

### Railway:
Dashboard → Project → "Deployments" → Latest deployment → "Logs"

### Render:
Dashboard → Service → "Logs" tab

### AWS EC2:
```bash
ssh -i key.pem ubuntu@instance-ip
sudo journalctl -u rothof-monitor -f
```

---

## Cost Comparison

| Platform | Monthly Cost | Free Period |
|----------|--------------|-------------|
| **Railway** | $1.50 | 3 months (free $5 credit) |
| **Render** | Free | Forever (with limitations) |
| **AWS EC2** | Free / $8 | Free 1 year, then $8/mo |
| **DigitalOcean** | $4 | None |

---

## Troubleshooting

**Not receiving emails?**
- Check you're using Gmail App Password (not regular password)
- Check spam folder
- Verify environment variables are set correctly
- Check logs for errors

**Monitor not starting?**
- Check logs for errors
- Verify date format: `YYYY-MM-DD` (e.g., `2026-06-24`)
- Verify time format: `HH:MM` (e.g., `19:00`)
- Ensure all environment variables are set

**Puppeteer errors?**
- Railway/Render handle this automatically
- On AWS: Puppeteer installs Chrome automatically

**Want to stop?**
- Railway: Dashboard → Settings → Delete service
- Render: Dashboard → Delete service
- AWS: Terminate instance

---

## What You'll Receive

When a court becomes available, you'll get an email:

**Subject**: 🎾 2 Rothof Courts Now Available!

**Body**:
- **June 24** at **19:00** - Court 44921
- **June 24** at **19:00** - Court 44922

[**Book Now!**]

---

## Next Steps

1. ⭐ **Deploy to Railway** (easiest, 5 min)
2. Add your email credentials
3. Set your monitoring date/time/court type
4. Relax! You'll be notified when courts are available

**Railway Dashboard**: https://railway.app/dashboard

No more manual checking! 🎾📧
