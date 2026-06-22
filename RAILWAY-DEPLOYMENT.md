# Step-by-Step: Deploy to Railway.app (5 Minutes)

## What You'll Get
- ✅ Runs 24/7 in the cloud
- ✅ Email notifications when courts are available
- ✅ No computer needed
- ✅ Free for 2-3 months ($5 credit)

---

## Step 1: Sign Up (1 minute)

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign in with GitHub
4. Authorize Railway to access your GitHub

---

## Step 2: Deploy Your Code (1 minute)

1. Click **"Deploy from GitHub repo"**
2. Select **`swarajrath/rothof_tennis_monitor`**
3. Click **"Deploy Now"**

Railway will automatically:
- Detect it's a Node.js app
- Run `npm install`
- Start the monitor

---

## Step 3: Configure (2 minutes)

Click on your project, then click **"Variables"** tab.

Add these environment variables:

### Required Variables:

| Variable | Value | Example |
|----------|-------|---------|
| `EMAIL_SERVICE` | Your email provider | `gmail` |
| `EMAIL_USER` | Your email address | `your@gmail.com` |
| `EMAIL_PASSWORD` | Your app password | `abcd efgh ijkl mnop` |
| `NOTIFY_EMAIL` | Who to notify | `your@gmail.com` |
| `MONITOR_DATE` | Date to monitor | `2026-06-24` |
| `MONITOR_TIME` | Time to monitor | `19:00` |
| `MONITOR_COURT_TYPE` | Court filter | `freiplatz` |

**Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2FA first
3. Create app password for "Mail"
4. Use the 16-character password

### Example Configuration:

```
EMAIL_SERVICE=gmail
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
NOTIFY_EMAIL=yourname@gmail.com
MONITOR_DATE=2026-06-24
MONITOR_TIME=19:00
MONITOR_COURT_TYPE=freiplatz
```

---

## Step 4: Verify (1 minute)

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Check the **"Logs"**

You should see:
```
📡 Using configuration from environment variables

📋 Configuration loaded:
   Date: 2026-06-24
   Time: 19:00
   Court Type: freiplatz

🚀 Rothof Court Monitor Started
   ...
```

---

## Done! 🎉

Your monitor is now running 24/7 in the cloud!

- You'll receive emails when courts become available
- No need to keep your computer on
- Automatically restarts if it crashes

---

## Updating Configuration

Want to monitor a different date/time?

1. Go to Railway dashboard
2. Click your project
3. Go to **"Variables"** tab
4. Update:
   - `MONITOR_DATE` (e.g., `2026-06-25`)
   - `MONITOR_TIME` (e.g., `20:00`)
   - `MONITOR_COURT_TYPE` (e.g., `halle`)
5. Railway will automatically restart with new settings

---

## Monitoring

### View Logs:
1. Dashboard → Your project
2. Click **"Deployments"**
3. Click latest deployment
4. View real-time logs

### Check Status:
Look for messages like:
```
🔍 Checking 2026-06-24 at 19:00...
   Available: 2 courts
   Booked: 10 courts
```

---

## Troubleshooting

**"Module not found" error:**
- Railway is building correctly
- Just wait for the build to complete

**No emails:**
- Check EMAIL_PASSWORD is correct (use App Password for Gmail)
- Check spam folder
- Verify variables are saved correctly

**Monitor not running:**
- Check logs for errors
- Verify all environment variables are set
- Make sure MONITOR_DATE is in format: `YYYY-MM-DD`
- Make sure MONITOR_TIME is in format: `HH:MM`

---

## Cost

Railway gives you **$5 free credit per month**.

This app uses minimal resources:
- **Estimated cost**: ~$1.50/month
- **Free credit covers**: ~3 months

After credit runs out, you can:
- Add a credit card ($1.50/month)
- Switch to Render.com (free forever)
- Deploy to your own server

---

## Next Steps

- Monitor is running! ✅
- Wait for email notifications
- Update configuration anytime via Railway dashboard

**Railway Dashboard**: https://railway.app/dashboard
