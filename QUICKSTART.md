# 🎾 Rothof Monitor - Quick Start with Web Interface

## Step-by-Step Guide

### 1. Open the Configuration Page

```bash
cd ~/rothof-monitor/web-interface
open index.html
```

Or just double-click `index.html` in Finder.

### 2. Configure Your Monitoring

The web page will show:
- **📅 Date**: Pick the date you want to monitor (e.g., June 24)
- **🕐 Time**: Pick the time slot (e.g., 19:00)
- **🏟️ Court Type**: Choose one:
  - 🌤️ **Freiplatz** (Outdoor) - 12 courts
  - 🏢 **Halle** (Indoor) - 6 courts
  - 🎾 **All Courts** - All 18 courts

Click **"Save & Start Monitoring"**

A file called `rothof-config.json` will download.

### 3. Move Config File

```bash
mv ~/Downloads/rothof-config.json ~/rothof-monitor/
```

### 4. Start Monitoring

```bash
cd ~/rothof-monitor
node start-from-config.js
```

You'll see:
```
📋 Configuration loaded:
   Date: 2026-06-24
   Time: 19:00
   Court Type: freiplatz
   
🚀 Rothof Court Monitor Started
   ...
```

**Leave this terminal window open!** The monitor is now running.

### 5. (Optional) Run in Background

To run in background and close terminal:

```bash
cd ~/rothof-monitor
nohup node start-from-config.js > monitor.log 2>&1 &
```

To check logs:
```bash
tail -f ~/rothof-monitor/monitor.log
```

To stop:
```bash
pkill -f "start-from-config"
```

---

## Deploy Web Interface to GitHub Pages (Optional)

This lets you access the configuration page from any device (phone, tablet, work computer).

### Deploy Steps:

```bash
cd ~/rothof-monitor

# Switch to gh-pages branch
git checkout -b gh-pages

# Only keep web interface
git rm -rf .
git checkout HEAD -- web-interface/
mv web-interface/* .
rm -rf web-interface

git add index.html
git commit -m "Deploy web interface"
git push origin gh-pages

# Go back to main branch
git checkout main
```

### Enable GitHub Pages:

1. Go to: https://github.com/swarajrath/rothof_tennis_monitor/settings/pages
2. **Source**: Deploy from branch
3. **Branch**: `gh-pages` / `root`
4. Click **Save**

Wait 1-2 minutes, then access at:
**https://swarajrath.github.io/rothof_tennis_monitor/**

### Using Remote Interface:

1. Open `https://swarajrath.github.io/rothof_tennis_monitor/` on any device
2. Configure date/time/court type
3. Download the `rothof-config.json`
4. Transfer file to your Mac (email, AirDrop, USB, etc.)
5. Move to `~/rothof-monitor/rothof-config.json`
6. Run `node start-from-config.js` on your Mac

**Important**: The monitoring MUST run on your Mac (or cloud server). GitHub Pages only hosts the configuration interface.

---

## Auto-Start on Mac Boot (24/7 Monitoring)

To make it start automatically when your Mac boots:

```bash
cd ~/rothof-monitor
mkdir -p ~/Library/LaunchAgents

cat > ~/Library/LaunchAgents/com.rothof.monitor.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.rothof.monitor</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/i531810/rothof-monitor/start-from-config.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/i531810/rothof-monitor</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/i531810/rothof-monitor/monitor.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/i531810/rothof-monitor/monitor.log</string>
</dict>
</plist>
EOF

# Load the service
launchctl load ~/Library/LaunchAgents/com.rothof.monitor.plist
```

To stop the service:
```bash
launchctl unload ~/Library/LaunchAgents/com.rothof.monitor.plist
```

---

## Summary

✅ **Configuration**: Web interface (visual, easy)  
✅ **Monitoring**: Runs on your Mac (Node.js + Puppeteer)  
✅ **Notifications**: Email when courts become available  
✅ **Background**: Can run 24/7 with LaunchAgent  
✅ **Remote Access**: Deploy to GitHub Pages (optional)  

**Next steps**: Open `web-interface/index.html` and configure your first monitoring session!
