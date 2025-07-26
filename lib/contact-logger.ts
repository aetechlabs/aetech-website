// Simple notification system for contact form submissions
// This file logs contact submissions and provides alternative notification methods

interface ContactSubmission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  subject: string;
  message: string;
  status: string;
}

class ContactLogger {
  private static instance: ContactLogger;
  private submissions: ContactSubmission[] = [];

  static getInstance(): ContactLogger {
    if (!ContactLogger.instance) {
      ContactLogger.instance = new ContactLogger();
    }
    return ContactLogger.instance;
  }

  logSubmission(data: Omit<ContactSubmission, 'timestamp'>): void {
    const submission: ContactSubmission = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    this.submissions.push(submission);
    
    // Log to console with formatting
    console.log('\n' + '='.repeat(80));
    console.log('🔔 NEW CONTACT FORM SUBMISSION');
    console.log('='.repeat(80));
    console.log(`📅 Time: ${submission.timestamp}`);
    console.log(`👤 Name: ${submission.name}`);
    console.log(`📧 Email: ${submission.email}`);
    if (submission.phone) console.log(`📱 Phone: ${submission.phone}`);
    if (submission.country) console.log(`🌍 Country: ${submission.country}`);
    console.log(`📋 Subject: ${submission.subject}`);
    console.log(`💬 Message: ${submission.message}`);
    console.log(`📊 Status: ${submission.status}`);
    console.log('='.repeat(80) + '\n');

    // Keep only last 100 submissions in memory
    if (this.submissions.length > 100) {
      this.submissions = this.submissions.slice(-100);
    }
  }

  getRecentSubmissions(limit: number = 10): ContactSubmission[] {
    return this.submissions.slice(-limit).reverse();
  }

  getAllSubmissions(): ContactSubmission[] {
    return [...this.submissions].reverse();
  }
}

export const contactLogger = ContactLogger.getInstance();

// Email troubleshooting guide
export const EMAIL_TROUBLESHOOTING = {
  zeptomailTM4001: {
    error: 'TM_4001 Access Denied',
    causes: [
      'Domain not verified in ZeptoMail dashboard',
      'Invalid or expired API key',
      'Incorrect API permissions',
      'Wrong API endpoint configuration'
    ],
    solutions: [
      '1. Login to ZeptoMail dashboard and verify your domain',
      '2. Check if the API key has correct permissions',
      '3. Regenerate API key if necessary',
      '4. Ensure sender email domain matches verified domain',
      '5. Check ZeptoMail documentation for API endpoint changes'
    ]
  },
  alternatives: [
    'Use Gmail SMTP with app passwords',
    'Use SendGrid free tier',
    'Use Resend.com',
    'Use Nodemailer with custom SMTP',
    'Set up webhook notifications to Slack/Discord'
  ]
};

// Alternative notification method using browser notification (for development)
export const createBrowserNotification = (title: string, body: string) => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
};
