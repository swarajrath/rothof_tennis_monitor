require('dotenv').config();
const RothofWebScraper = require('./web-scraper');
const nodemailer = require('nodemailer');

class RothofMonitor {
  constructor(config) {
    this.config = {
      checkIntervalMinutes: config.checkIntervalMinutes || 5,
      targetDate: config.targetDate, // e.g., '2026-06-23'
      targetTimes: config.targetTimes || ['1800'],
      notifyEmail: process.env.NOTIFY_EMAIL || process.env.EMAIL_USER,
      ...config
    };

    this.scraper = new RothofWebScraper();
    this.previousState = new Map();
    this.setupEmailTransporter();
  }

  setupEmailTransporter() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async checkAvailability() {
    console.log(`\n🔍 Checking ${this.config.targetDate} at ${this.config.targetTimes.map(t => t.slice(0,2)+':'+t.slice(2)).join(', ')}...`);

    const availability = await this.scraper.scrapeAvailability(
      this.config.targetDate,
      this.config.targetTimes
    );

    return availability;
  }

  findNewlyAvailable(current) {
    const newlyAvailable = [];

    current.forEach(slot => {
      const key = `${slot.date}-${slot.time}-${slot.courtId}`;
      const wasAvailable = this.previousState.get(key);

      // Newly available = was booked (!available), now available
      if (wasAvailable === false && slot.available) {
        newlyAvailable.push(slot);
      }

      this.previousState.set(key, slot.available);
    });

    return newlyAvailable;
  }

  async sendNotification(newSlots) {
    if (newSlots.length === 0) return;

    const subject = `🎾 ${newSlots.length} Rothof Court${newSlots.length > 1 ? 's' : ''} Now Available!`;

    let body = `<h2>Courts just became available at Rothof München!</h2>\n\n<ul>\n`;

    newSlots.forEach(slot => {
      const time = `${slot.time.slice(0,2)}:${slot.time.slice(2)}`;
      body += `<li><strong>${slot.date}</strong> at <strong>${time}</strong> - ${slot.court}</li>\n`;
    });

    body += `</ul>\n\n`;
    body += `<p><a href="https://rothof.de/online-buchen/" style="background: #1aaf42; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Book Now!</a></p>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: this.config.notifyEmail,
      subject,
      html: body
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${this.config.notifyEmail}`);
    } catch (error) {
      console.error('❌ Email error:', error.message);
    }
  }

  async runCheck() {
    try {
      const availability = await this.checkAvailability();
      const newlyAvailable = this.findNewlyAvailable(availability);

      const available = availability.filter(s => s.available);
      const booked = availability.filter(s => !s.available);

      console.log(`   Available: ${available.length} courts`);
      console.log(`   Booked: ${booked.length} courts`);

      if (newlyAvailable.length > 0) {
        console.log(`\n🎾 ${newlyAvailable.length} court(s) just became available!`);
        newlyAvailable.forEach(s => {
          console.log(`   ${s.court} at ${s.time.slice(0,2)}:${s.time.slice(2)}`);
        });

        await this.sendNotification(newlyAvailable);
      } else {
        console.log(`   No new courts became available`);
      }
    } catch (error) {
      console.error('❌ Check failed:', error.message);
    }
  }

  start() {
    console.log('🚀 Rothof Court Monitor Started (Web Scraper Mode)');
    console.log(`   Target date: ${this.config.targetDate}`);
    console.log(`   Target times: ${this.config.targetTimes.map(t => t.slice(0,2)+':'+t.slice(2)).join(', ')}`);
    console.log(`   Check interval: ${this.config.checkIntervalMinutes} minutes`);
    console.log(`   Notification email: ${this.config.notifyEmail}`);
    console.log(`   ⚠️  Using Puppeteer web scraper (slower but accurate)\n`);

    this.runCheck();

    this.interval = setInterval(
      () => this.runCheck(),
      this.config.checkIntervalMinutes * 60 * 1000
    );
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      console.log('🛑 Monitor stopped');
    }
  }
}

module.exports = RothofMonitor;
