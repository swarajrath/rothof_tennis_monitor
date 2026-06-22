# ☁️ Deploy to Cloud - No Computer Needed!

Your monitor will run 24/7 in the cloud and send you email notifications. Your Mac can be off!

---

## 🚀 Recommended: Railway.app (5 Minutes)

### Why Railway?
- ✅ Easiest setup (5 minutes)
- ✅ Free $5/month credit
- ✅ Automatic deploys from GitHub
- ✅ Simple dashboard

### Quick Setup:

**1. Deploy**
- Go to https://railway.app
- Sign in with GitHub
- Click "Deploy from GitHub repo"
- Select `swarajrath/rothof_tennis_monitor`

**2. Configure**

Add these environment variables in Railway dashboard:

```
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
NOTIFY_EMAIL=your@gmail.com
MONITOR_DATE=2026-06-24
MONITOR_TIME=19:00
MONITOR_COURT_TYPE=freiplatz
```

**Gmail App Password**: https://myaccount.google.com/apppasswords

**3. Done!**

Check logs to verify it's running. You'll get emails when courts are available!

---

## 📖 Detailed Guides

- **[RAILWAY-DEPLOYMENT.md](RAILWAY-DEPLOYMENT.md)** - Step-by-step Railway setup
- **[CLOUD-DEPLOYMENT.md](CLOUD-DEPLOYMENT.md)** - All cloud options (Railway, Render, AWS, DigitalOcean)

---

## Configuration Variables Explained

| Variable | What | Example |
|----------|------|---------|
| `MONITOR_DATE` | Date to monitor | `2026-06-24` |
| `MONITOR_TIME` | Time to monitor | `19:00` (7pm) |
| `MONITOR_COURT_TYPE` | Court filter | `freiplatz` / `halle` / `all` |
| `EMAIL_SERVICE` | Email provider | `gmail` |
| `EMAIL_USER` | Your email | `you@gmail.com` |
| `EMAIL_PASSWORD` | App password | `abcd efgh ijkl mnop` |
| `NOTIFY_EMAIL` | Who gets notified | `you@gmail.com` |

---

## Updating After Deployment

Want to monitor a different date/time?

**Railway/Render:**
1. Go to dashboard
2. Update environment variables
3. Save (auto-restarts)

**AWS EC2:**
```bash
ssh -i key.pem ubuntu@instance-ip
cd rothof_tennis_monitor
nano rothof-config.json  # Edit date/time
sudo systemctl restart rothof-monitor
```

---

## Cost Comparison

| Platform | Cost | Free Period |
|----------|------|-------------|
| Railway | $1.50/mo | 3 months (free $5 credit) |
| Render | Free | Forever (with limitations) |
| AWS EC2 | $0 / $8 | Free 1 year, then $8/mo |
| DigitalOcean | $4/mo | No free tier |

**Recommendation**: Start with Railway (easiest + free credit)

---

## What Happens When Running

1. **Every 5 minutes**: Scrapes Rothof calendar for your date/time
2. **Checks availability**: Counts available courts (filtered by type)
3. **Detects changes**: When a court becomes newly available
4. **Sends email**: "🎾 Court Available at Rothof!"
5. **Repeats**: Continuously monitors 24/7

---

## Troubleshooting

**Not receiving emails?**
- Check Gmail App Password (not regular password)
- Check spam folder
- Verify environment variables in dashboard

**Monitor not running?**
- Check deployment logs
- Verify date format: `YYYY-MM-DD`
- Verify time format: `HH:MM`

**Want to stop?**
- Railway: Dashboard → Settings → Delete service
- Render: Dashboard → Delete service
- AWS: Terminate instance

---

## Next Steps

1. **Deploy** to Railway (5 min) - [RAILWAY-DEPLOYMENT.md](RAILWAY-DEPLOYMENT.md)
2. **Configure** your email and monitoring preferences
3. **Relax** - You'll get notified when courts are available!

No more manual checking! 🎾📧
