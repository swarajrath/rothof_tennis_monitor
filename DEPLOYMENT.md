# Deployment Guide - 24/7 Monitoring

## Option 1: Free Tier Cloud (Recommended for Beginners)

### Render.com (Free Tier)
**Easiest deployment, zero cost**

1. **Prepare the app:**
```bash
cd ~/rothof-monitor
```

2. **Create a start script for cloud:**
Add to `package.json`:
```json
"scripts": {
  "start": "node index.js",
  "setup": "node setup.js",
  "test": "node test-api.js"
}
```

3. **Deploy to Render:**
- Go to https://render.com (sign up free)
- Click "New +" → "Background Worker"
- Connect your GitHub repo: `swarajrath/rothof_tennis_monitor`
- Settings:
  - Name: `rothof-monitor`
  - Build Command: `npm install`
  - Start Command: `node index.js`
- Add Environment Variables:
  - `EMAIL_SERVICE=gmail`
  - `EMAIL_USER=your-email@gmail.com`
  - `EMAIL_PASSWORD=your-app-password`
  - `NOTIFY_EMAIL=your-email@gmail.com`
- Click "Create Background Worker"

**Pros:** Free forever, automatic restarts, simple setup
**Cons:** Spins down after 15 min inactivity on free tier

---

## Option 2: Railway.app (Free $5/month credit)

1. Go to https://railway.app
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select `rothof_tennis_monitor`
5. Add environment variables (same as above)
6. Deploy!

**Pros:** Always running, good free tier, simple
**Cons:** Free credit runs out eventually

---

## Option 3: AWS EC2 Free Tier (Best for 24/7)

### Setup (One-time, ~15 minutes)

1. **Launch EC2 Instance:**
   - Go to AWS Console → EC2
   - Launch Instance (t2.micro - free tier)
   - OS: Ubuntu 22.04
   - Create/download key pair
   - Allow SSH (port 22) in security group

2. **Connect and setup:**
```bash
# Connect to your instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Clone your repo
git clone https://github.com/swarajrath/rothof_tennis_monitor.git
cd rothof_tennis_monitor
npm install

# Configure environment
cp .env.example .env
nano .env
# Add your email credentials, save and exit (Ctrl+X, Y, Enter)
```

3. **Setup as system service (runs 24/7):**
```bash
sudo nano /etc/systemd/system/rothof-monitor.service
```

Paste this:
```ini
[Unit]
Description=Rothof Court Monitor
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/rothof_tennis_monitor
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Save and exit. Then:
```bash
# Start the service
sudo systemctl daemon-reload
sudo systemctl enable rothof-monitor
sudo systemctl start rothof-monitor

# Check status
sudo systemctl status rothof-monitor

# View logs
sudo journalctl -u rothof-monitor -f
```

**Pros:** True 24/7, free for 12 months, full control
**Cons:** Requires AWS account, more setup

---

## Option 4: Raspberry Pi (If you have one)

Perfect for home deployment!

```bash
# SSH into your Pi
ssh pi@raspberrypi.local

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Clone and setup
git clone https://github.com/swarajrath/rothof_tennis_monitor.git
cd rothof_tennis_monitor
npm install
cp .env.example .env
nano .env  # Add your credentials

# Run with PM2 (process manager)
sudo npm install -g pm2
pm2 start index.js --name rothof-monitor
pm2 startup  # Make it start on boot
pm2 save
```

**Pros:** No cost, full control, always running
**Cons:** Requires Raspberry Pi, home network dependency

---

## Option 5: DigitalOcean Droplet ($4/month)

Similar to AWS but simpler interface:

1. Create account at https://digitalocean.com
2. Create Droplet (Basic, $4/mo)
3. Follow same steps as AWS EC2 above

---

## Option 6: Keep Your Mac Running

If you have a Mac that's always on:

```bash
cd ~/rothof-monitor

# Create LaunchAgent
mkdir -p ~/Library/LaunchAgents
nano ~/Library/LaunchAgents/com.rothof.monitor.plist
```

Paste:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.rothof.monitor</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/i531810/rothof-monitor/index.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/i531810/rothof-monitor</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/i531810/rothof-monitor/logs/stdout.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/i531810/rothof-monitor/logs/stderr.log</string>
</dict>
</plist>
```

Then:
```bash
# Create logs directory
mkdir -p ~/rothof-monitor/logs

# Load the service
launchctl load ~/Library/LaunchAgents/com.rothof.monitor.plist

# Check if running
launchctl list | grep rothof

# View logs
tail -f ~/rothof-monitor/logs/stdout.log
```

To stop:
```bash
launchctl unload ~/Library/LaunchAgents/com.rothof.monitor.plist
```

**Pros:** Free, simple, no cloud needed
**Cons:** Mac must stay on and connected to internet

---

## My Recommendation

**For you:** Start with **Render.com** (free, 5 min setup) or **your Mac** if it's always on.

**Best long-term:** AWS EC2 (free for 1 year, then ~$5/month) or Raspberry Pi (one-time $35, free forever).

---

## Quick Health Check

After deploying, test it:

1. Check logs to see it's running
2. Wait for first check cycle
3. You should see console output showing availability checks
4. If no courts available now, it will email you when one becomes free

## Troubleshooting

**Service not starting:**
```bash
# Check logs
journalctl -u rothof-monitor -n 50
```

**Not receiving emails:**
- Verify `.env` has correct credentials
- Check spam folder
- Test with: `npm test` first

**Memory issues on small instances:**
- The app uses ~50MB RAM
- t2.micro (1GB) is plenty
- Free tiers are sufficient

Let me know which option you'd like to pursue and I can help with detailed setup!
