# Rothof Court Availability Monitor

Monitors court availability at Rothof München and sends email notifications when courts become free at your target times.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run setup wizard (interactive)
node setup.js

# 3. Start monitoring
npm start
```

That's it! You'll receive emails when courts become available at your target times.

## Features

- 🎾 Monitors tennis court availability at Rothof München via Eversports API
- ⏰ Configurable target times (e.g., 18:00, 19:00, 20:00)
- 📧 Email notifications when courts become newly available
- 🔄 Runs continuously with configurable check intervals
- 🎯 Only notifies about newly available slots (no spam)

## Setup

### Quick Setup (Recommended)

Run the interactive setup wizard:
```bash
node setup.js
```

This will guide you through email configuration and monitoring preferences.

### Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure email settings:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your email credentials

   **For Gmail users:**
   - Go to Google Account → Security
   - Enable 2-factor authentication
   - Generate an "App Password" for this application
   - Use the app password (not your regular password) in `.env`

3. **Customize monitoring settings** (optional):
   Edit `index.js` to change:
   - `checkIntervalMinutes`: How often to check (default: 5 minutes)
   - `targetTimes`: Which times to monitor (default: 1800, 1900, 2000)
   - `daysAhead`: How many days to check (default: 7)

## Usage

**Start monitoring:**
```bash
npm start
# or
node index.js
```

**Test API connection (optional):**
```bash
npm test
```

The monitor will:
- Check availability every 5 minutes (configurable)
- Send email when a court becomes free at your target times
- Continue running until you stop it (Ctrl+C)

**Run in background:**
```bash
# macOS/Linux
nohup node index.js > monitor.log 2>&1 &

# To stop:
pkill -f "node index.js"
```

**Run as a service (recommended for 24/7 monitoring):**

On macOS, create a LaunchAgent. On Linux, create a systemd service.

## How It Works

1. Polls the Eversports API every N minutes
2. Checks next 7 days for availability at target times
3. Compares current availability with previous state
4. Sends email notification when a previously unavailable slot becomes free
5. Only notifies once per newly available slot (no repeated notifications)

## API Details

- **Facility**: Rothof München (ID: 23288)
- **Sport**: Tennis
- **Courts**: 18 courts monitored
- **Data Source**: Eversports widget API

## Troubleshooting

**No emails received:**
- Check your `.env` file has correct credentials
- For Gmail, ensure you're using an App Password (not regular password)
- Check spam folder
- Look at console output for error messages

**Rate limiting:**
- The app includes 500ms delays between API calls
- Default 5-minute check interval is conservative
- Reduce `checkIntervalMinutes` carefully if needed

## Configuration Examples

**Monitor only 18:00:**
```javascript
targetTimes: ['1800']
```

**Check every 2 minutes:**
```javascript
checkIntervalMinutes: 2
```

**Monitor prime evening times:**
```javascript
targetTimes: ['1700', '1730', '1800', '1830', '1900', '1930', '2000']
```

## License

MIT
