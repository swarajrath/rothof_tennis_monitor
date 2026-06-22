require('dotenv').config();
const nodemailer = require('nodemailer');

class RothofMonitor {
  constructor(config) {
    this.config = {
      facilityId: 23288,
      sport: 'tennis',
      courtIds: [44656, 44657, 44658, 44920, 44921, 44922, 44644, 44645, 44646, 44647, 44643, 44648, 44649, 44650, 44651, 44652, 44653, 44654],
      checkIntervalMinutes: config.checkIntervalMinutes || 5,
      targetTimes: config.targetTimes || ['1800'], // e.g., ['1800', '1900']
      targetDates: config.targetDates || null,     // e.g., ['2026-06-23', '2026-06-24']
      daysAhead: config.daysAhead || 7,
      ...config
    };

    this.previousState = new Map(); // Track previous availability
    this.isFirstRun = true; // Skip notifications on first run
    this.setupEmailTransporter();
  }

  setupEmailTransporter() {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async checkAvailability() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const courtsParam = this.config.courtIds.map(id => `courts[]=${id}`).join('&');
    const url = `https://www.eversports.de/widget/api/slot?facilityId=${this.config.facilityId}&sport=${this.config.sport}&startDate=${dateStr}&${courtsParam}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // API returns 7 days of data in one call
      return data.slots || [];
    } catch (error) {
      console.error(`Error fetching availability:`, error.message);
      return [];
    }
  }

  async checkAllDates() {
    // Single API call returns all days (7 days from startDate)
    return await this.checkAvailability();
  }

  findNewlyAvailableSlots(slots) {
    const newlyAvailable = [];

    // Filter for target times and optionally target dates
    let targetSlots = slots.filter(slot => {
      const matchesTime = this.config.targetTimes.includes(slot.start);
      const matchesDate = !this.config.targetDates || this.config.targetDates.includes(slot.date);
      const isAvailable = !slot.booking;

      return matchesTime && matchesDate && isAvailable;
    });

    for (const slot of targetSlots) {
      const key = `${slot.date}-${slot.start}-${slot.court}`;

      // Check if this slot was previously unavailable
      const wasAvailable = this.previousState.get(key);

      // Only notify if it was previously tracked as unavailable (not undefined)
      if (wasAvailable === false) {
        // This is a newly available slot!
        newlyAvailable.push({
          date: slot.date,
          time: slot.start,
          court: slot.court,
          key
        });
      }

      // Update state
      this.previousState.set(key, true);
    }

    // Also track unavailable slots
    const unavailableSlots = slots.filter(slot => {
      const matchesTime = this.config.targetTimes.includes(slot.start);
      const matchesDate = !this.config.targetDates || this.config.targetDates.includes(slot.date);

      return matchesTime && matchesDate && slot.booking;
    });

    for (const slot of unavailableSlots) {
      const key = `${slot.date}-${slot.start}-${slot.court}`;
      this.previousState.set(key, false);
    }

    return newlyAvailable;
  }

  async sendNotification(newSlots) {
    if (newSlots.length === 0) return;

    const subject = `🎾 ${newSlots.length} Rothof Court${newSlots.length > 1 ? 's' : ''} Available!`;

    let body = '<h2>New Court Availability at Rothof München</h2>\n\n';
    body += '<ul>\n';

    for (const slot of newSlots) {
      const timeFormatted = `${slot.time.slice(0, 2)}:${slot.time.slice(2)}`;
      body += `<li><strong>${slot.date}</strong> at <strong>${timeFormatted}</strong> - Court ${slot.court}</li>\n`;
    }

    body += '</ul>\n\n';
    body += '<p><a href="https://rothof.de/online-buchen/">Book now at Rothof</a></p>';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL || process.env.EMAIL_USER,
      subject,
      html: body
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent: ${newSlots.length} new slot(s)`);
    } catch (error) {
      console.error('❌ Error sending email:', error.message);
    }
  }

  formatTime(timeStr) {
    return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
  }

  async runCheck() {
    console.log(`\n🔍 Checking availability at ${new Date().toLocaleString()}...`);

    const slots = await this.checkAllDates();
    const newlyAvailable = this.findNewlyAvailableSlots(slots);

    if (newlyAvailable.length > 0) {
      console.log(`\n🎾 Found ${newlyAvailable.length} newly available slot(s):`);
      newlyAvailable.forEach(slot => {
        console.log(`   ${slot.date} at ${this.formatTime(slot.time)} - Court ${slot.court}`);
      });

      await this.sendNotification(newlyAvailable);
    } else {
      console.log('   No new slots available at target times.');
    }

    // Log summary
    const totalAvailable = slots.filter(s => {
      const matchesTime = this.config.targetTimes.includes(s.start);
      const matchesDate = !this.config.targetDates || this.config.targetDates.includes(s.date);
      return matchesTime && matchesDate && !s.booking;
    }).length;

    console.log(`   Total available slots at target times: ${totalAvailable}`);
  }

  start() {
    console.log('🚀 Rothof Court Monitor Started');
    console.log(`   Monitoring times: ${this.config.targetTimes.map(t => this.formatTime(t)).join(', ')}`);
    if (this.config.targetDates) {
      console.log(`   Monitoring dates: ${this.config.targetDates.join(', ')}`);
    } else {
      console.log(`   Monitoring: Next ${this.config.daysAhead} days`);
    }
    console.log(`   Check interval: ${this.config.checkIntervalMinutes} minutes`);
    console.log(`   Notification email: ${process.env.NOTIFY_EMAIL || process.env.EMAIL_USER}`);
    console.log(`   ⚠️  First run will NOT send notifications (building baseline state)\n`);

    // Run first check immediately
    this.runCheck();

    // Schedule recurring checks
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
