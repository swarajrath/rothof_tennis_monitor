# Rothof Monitor - Quick Usage Guide

## What You Have

A complete Node.js application that monitors tennis court availability at Rothof München and sends email notifications when courts become available at your preferred times.

## Project Location

```
~/rothof-monitor/
```

## Getting Started

### 1. Configure Email

Run the setup wizard:
```bash
cd ~/rothof-monitor
node setup.js
```

The wizard will ask you for:
- Email service (Gmail, Outlook, etc.)
- Your email address
- Your email password (App Password for Gmail)
- Who should receive notifications
- What times to monitor (e.g., 18:00, 19:00)
- How often to check

**Gmail Users:** You need to create an App Password:
1. Go to https://myaccount.google.com/apppasswords
2. Create a new app password for "Mail"
3. Use that 16-character password in the setup wizard

### 2. Test the Connection

```bash
npm test
```

This verifies the Eversports API is accessible and shows current availability.

### 3. Start Monitoring

```bash
npm start
```

The monitor will:
- Check availability every N minutes (you configured this)
- Look for available courts at your target times
- Send an email when a court becomes newly available
- Keep running until you stop it (Ctrl+C)

### 4. Run in Background (Optional)

To keep it running after you close the terminal:

```bash
nohup npm start > monitor.log 2>&1 &
```

To check the log:
```bash
tail -f ~/rothof-monitor/monitor.log
```

To stop it:
```bash
pkill -f "node index.js"
```

## How It Works

1. **Discovery**: The app polls the Eversports API (same data the booking widget uses)
2. **Tracking**: It remembers which slots were available/unavailable last check
3. **Detection**: When a previously unavailable slot becomes free, it triggers
4. **Notification**: You get an email with the date, time, and court number
5. **Smart**: Each slot only triggers one notification (no spam)

## Customization

Edit `index.js` to change:

```javascript
const monitor = new RothofMonitor({
  checkIntervalMinutes: 5,              // How often to check
  targetTimes: ['1800', '1900', '2000'], // Which times (18:00, 19:00, 20:00)
  daysAhead: 7                           // How many days to monitor
});
```

## Project Structure

```
rothof-monitor/
├── index.js           # Main entry point
├── monitor.js         # Core monitoring logic
├── setup.js           # Interactive configuration wizard
├── test-api.js        # API connectivity test
├── .env               # Your email configuration (gitignored)
├── .env.example       # Template for .env
├── README.md          # Full documentation
└── package.json       # Dependencies
```

## Troubleshooting

**No emails received?**
- Check `.env` has correct email credentials
- For Gmail, ensure you used an App Password (not regular password)
- Check spam folder
- Look at console output for error messages

**API not working?**
- Run `npm test` to verify connectivity
- Check if Eversports website is accessible
- The facility ID might have changed (check browser dev tools)

**Getting rate limited?**
- Increase `checkIntervalMinutes` in `index.js`
- The default 5 minutes should be safe

## Next Steps

The app is ready to use! Here are some ideas:

- **Deploy to a server**: Run on AWS, DigitalOcean, or a Raspberry Pi for 24/7 monitoring
- **Add more times**: Monitor breakfast slots (07:00) or late night (22:00)
- **Multiple recipients**: Edit the email code to notify multiple people
- **SMS notifications**: Add Twilio integration for text messages
- **Web dashboard**: Build a simple UI to see current availability

## Technical Details

- **Eversports API**: `https://www.eversports.de/widget/api/slot`
- **Facility ID**: 23288 (Rothof München)
- **Courts**: 18 tennis courts (IDs 44643-44658, 44920-44922)
- **Polling**: Direct API calls (no browser automation needed)
- **State**: In-memory tracking (resets on restart)

---

**Questions or issues?** Check the full README.md or modify the code to fit your needs!
