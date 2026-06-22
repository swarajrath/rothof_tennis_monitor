# Web Interface for Rothof Monitor

A simple web page to configure the court monitoring settings without editing code.

## Setup & Usage

### Option 1: Use Locally (Easiest)

1. **Open the interface:**
   ```bash
   cd ~/rothof-monitor/web-interface
   open index.html
   # Or double-click index.html in Finder
   ```

2. **Configure monitoring:**
   - Select the date you want to monitor
   - Select the time (e.g., 18:00)
   - Choose court type (Freiplatz/Halle/All)
   - Click "Save & Start Monitoring"
   - A `rothof-config.json` file will download

3. **Move config file:**
   ```bash
   mv ~/Downloads/rothof-config.json ~/rothof-monitor/
   ```

4. **Start monitoring:**
   ```bash
   cd ~/rothof-monitor
   node start-from-config.js
   ```

5. **Keep running in background:**
   ```bash
   # macOS/Linux
   nohup node start-from-config.js > monitor.log 2>&1 &
   
   # To stop:
   pkill -f "start-from-config"
   ```

---

### Option 2: Deploy to GitHub Pages (For Remote Access)

**⚠️ Important**: GitHub Pages only hosts the web interface. The actual monitoring MUST run on your local machine.

1. **Create GitHub Pages branch:**
   ```bash
   cd ~/rothof-monitor
   
   # Create gh-pages branch
   git checkout --orphan gh-pages
   git reset --hard
   
   # Copy web interface
   cp -r web-interface/* .
   git add index.html
   git commit -m "Deploy web interface"
   git push origin gh-pages
   ```

2. **Enable GitHub Pages:**
   - Go to https://github.com/swarajrath/rothof_tennis_monitor/settings/pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `root`
   - Click Save

3. **Access your interface:**
   - URL: `https://swarajrath.github.io/rothof_tennis_monitor/`
   - Configure from any device
   - Download the config file
   - Transfer it to your local machine

4. **Run monitoring locally:**
   ```bash
   # On your Mac where the code is:
   cd ~/rothof-monitor
   # Place the downloaded rothof-config.json here
   node start-from-config.js
   ```

---

## How It Works

### Web Interface (GitHub Pages)
- ✅ Runs in browser (any device)
- ✅ Creates configuration JSON
- ❌ Cannot run Puppeteer/Node.js
- ❌ Cannot send emails
- ❌ Cannot scrape websites

### Local Monitor (Your Mac)
- ✅ Reads configuration from web interface
- ✅ Runs Puppeteer scraper
- ✅ Sends email notifications
- ✅ Monitors 24/7 (if kept running)

### Why Not Fully in the Cloud?

Puppeteer (headless browser) requires:
- Node.js runtime
- Chrome/Chromium browser
- Significant CPU/memory

**Solutions for 24/7 cloud monitoring:**
1. **Deploy to Heroku/Railway** (see DEPLOYMENT.md)
2. **AWS EC2 instance** (see DEPLOYMENT.md)
3. **DigitalOcean Droplet** ($4/month)
4. **Your Mac + LaunchAgent** (free, see DEPLOYMENT.md)

---

## Running in Background on Mac

### Option A: Keep Terminal Open
```bash
cd ~/rothof-monitor
node start-from-config.js
# Don't close terminal
```

### Option B: Background Process
```bash
cd ~/rothof-monitor
nohup node start-from-config.js > monitor.log 2>&1 &

# Check if running:
ps aux | grep start-from-config

# View logs:
tail -f monitor.log

# Stop:
pkill -f "start-from-config"
```

### Option C: LaunchAgent (Auto-start on login)
See DEPLOYMENT.md section "Option 6: Keep Your Mac Running"

---

## Updating Configuration

1. Open the web interface again
2. Change date/time/court type
3. Click Save
4. Move new `rothof-config.json` to `~/rothof-monitor/`
5. Restart the monitor:
   ```bash
   pkill -f "start-from-config"
   node start-from-config.js
   ```

---

## Troubleshooting

**"Configuration file not found"**
- Make sure `rothof-config.json` is in `~/rothof-monitor/` (not in `web-interface/`)

**Monitor not sending emails**
- Check `.env` file has correct email credentials
- Run `node test-api.js` to verify API access

**Web page not loading**
- Just open `web-interface/index.html` directly in browser
- No web server needed for local use
