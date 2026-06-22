# Cloud Deployment Guide - Run 24/7 Without Your Computer

Deploy to the cloud so the monitor runs 24/7 and you just receive email notifications.

---

## Option 1: Railway.app (Easiest - Recommended)

**Cost**: Free $5/month credit (~2-3 months free)  
**Setup Time**: 5 minutes  
**Difficulty**: ⭐ Easy

### Steps:

1. **Sign up at Railway.app**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `swarajrath/rothof_tennis_monitor`
   - Railway will auto-detect and deploy

3. **Configure Environment Variables**
   
   In Railway dashboard, add these variables:
   
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   NOTIFY_EMAIL=your-email@gmail.com
   ```

4. **Upload Configuration**
   
   Railway doesn't support file uploads easily, so we'll use environment variables:
   
   Add these to Railway:
   ```
   MONITOR_DATE=2026-06-24
   MONITOR_TIME=19:00
   MONITOR_COURT_TYPE=freiplatz
   ```

5. **Deploy!**
   - Railway will automatically build and start
   - Check logs to verify it's running
   - You'll get emails when courts become available

**Dashboard**: https://railway.app/dashboard

---

## Option 2: Render.com (Also Easy - Always Free Tier)

**Cost**: Free forever (spins down after 15 min idle)  
**Setup Time**: 5 minutes  
**Difficulty**: ⭐ Easy

### Steps:

1. **Sign up at Render.com**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Background Worker**
   - Click "New +" → "Background Worker"
   - Connect GitHub repo: `swarajrath/rothof_tennis_monitor`
   - Name: `rothof-monitor`
   - Build Command: `npm install`
   - Start Command: `node start-from-config.js`

3. **Add Environment Variables**
   
   In Render dashboard:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   NOTIFY_EMAIL=your-email@gmail.com
   MONITOR_DATE=2026-06-24
   MONITOR_TIME=19:00
   MONITOR_COURT_TYPE=freiplatz
   ```

4. **Deploy**
   - Click "Create Background Worker"
   - Wait for build to complete
   - Check logs

**Dashboard**: https://dashboard.render.com/

---

## Option 3: AWS EC2 (Most Control - Free for 1 Year)

**Cost**: Free for 12 months (t2.micro), then ~$8/month  
**Setup Time**: 15 minutes  
**Difficulty**: ⭐⭐⭐ Advanced

### Steps:

1. **Launch EC2 Instance**
   - Go to AWS Console → EC2
   - Click "Launch Instance"
   - Choose Ubuntu 22.04 (free tier eligible)
   - Instance type: t2.micro
   - Create key pair (download .pem file)
   - Launch

2. **Connect to Instance**
   ```bash
   chmod 400 your-key.pem
   ssh -i your-key.pem ubuntu@your-instance-ip
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
   # Create .env
   cat > .env << 'EOF'
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   NOTIFY_EMAIL=your-email@gmail.com
   EOF

   # Create config
   cat > rothof-config.json << 'EOF'
   {
     "date": "2026-06-24",
     "time": "19:00",
     "courtType": "freiplatz",
     "timestamp": "2026-06-22T16:00:00.000Z"
   }
   EOF
   ```

6. **Setup as System Service**
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

7. **Start Service**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable rothof-monitor
   sudo systemctl start rothof-monitor
   
   # Check status
   sudo systemctl status rothof-monitor
   
   # View logs
   sudo journalctl -u rothof-monitor -f
   ```

---

## Option 4: DigitalOcean ($4/month)

Same as AWS EC2 but simpler interface.

1. Create Droplet (Basic, $4/mo)
2. Follow same steps as AWS EC2
3. Done!

---

## Comparison

| Service | Cost | Ease | Best For |
|---------|------|------|----------|
| **Railway** | $5 free credit | ⭐ Easiest | Quick setup, low maintenance |
| **Render** | Free forever | ⭐ Easy | Long-term free hosting |
| **AWS EC2** | Free 1 year | ⭐⭐⭐ Hard | Full control, learning |
| **DigitalOcean** | $4/month | ⭐⭐ Medium | Reliable paid option |

---

## My Recommendation

**Start with Railway.app**:
- Easiest setup (5 minutes)
- Free for 2-3 months
- Automatic deploys when you update GitHub
- Easy to configure via web interface

**Steps**:
1. Sign up: https://railway.app
2. Deploy from GitHub
3. Add environment variables
4. Done! Runs 24/7 in the cloud

You'll receive emails when courts become available. No computer needed!

---

## Updating Configuration in the Cloud

### Railway/Render:
1. Update environment variables in dashboard:
   ```
   MONITOR_DATE=2026-06-25  (new date)
   MONITOR_TIME=20:00       (new time)
   ```
2. Restart the service
3. Done!

### AWS EC2:
1. SSH into instance
2. Edit `rothof-config.json`
3. Restart: `sudo systemctl restart rothof-monitor`

---

## Monitoring & Logs

### Railway:
- Dashboard → Your project → "Deployments" tab → Click deployment → View logs

### Render:
- Dashboard → Your service → "Logs" tab

### AWS EC2:
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
sudo journalctl -u rothof-monitor -f
```

---

## Cost Comparison (Per Month)

- **Railway**: Free (~$0 for 2-3 months with credit)
- **Render**: $0 (free forever, with limitations)
- **AWS EC2**: $0 (year 1), then ~$8
- **DigitalOcean**: $4
- **Your Mac**: $0 (electricity ~$2/month)

**Cheapest long-term**: Render.com (free) or Your Mac (already have it)  
**Best experience**: Railway.app (easiest setup)
