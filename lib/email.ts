/**
 * Email Service for Contact Form
 */

interface EmailData {
  to: string;
  from: string;
  subject: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  company?: string;
  message: string;
  projectType?: string;
  budget?: string;
  currency?: string;
  timeline?: string;
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    // Use the backend API email service
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1/api';
    
    console.log('🔄 Attempting to send email via:', `${apiUrl}/contact`);
    
    const response = await fetch(`${apiUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: data.to,
        from: data.from,
        subject: data.subject,
        html: generateEmailHTML(data),
        replyTo: data.email
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Email sending failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        apiUrl: `${apiUrl}/contact`
      });
      return false;
    }

    const result = await response.json();
    console.log('✅ Contact Email sent successfully:', {
      to: data.to,
      from: data.from,
      subject: data.subject,
      timestamp: new Date().toISOString()
    });

    return true;

  } catch (error) {
    console.error('❌ Email sending failed with exception:', {
      error: error instanceof Error ? error.message : String(error),
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}

export async function sendConfirmationEmail(email: string, name: string): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1/api';
    
    console.log('🔄 Attempting to send confirmation email to:', email);
    
    const response = await fetch(`${apiUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        from: process.env.NEXT_PUBLIC_SENDER_EMAIL || 'noreply@aetechlabs.com',
        subject: 'Thank You for Contacting AETech Labs',
        html: generateConfirmationHTML(name),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Confirmation email failed:', {
        status: response.status,
        error: errorText
      });
      return false;
    }

    console.log('✅ Confirmation email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Confirmation email failed with exception:', {
      error: error instanceof Error ? error.message : String(error),
      email
    });
    return false;
  }
}

function generateEmailHTML(data: EmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: #f3f4f6; color: #111827; padding: 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb; }
          .logo-img { max-width: 180px; height: auto; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; color: #111827; }
          .header p { margin: 10px 0 0; font-size: 14px; color: #4b5563; }
          .content { padding: 40px 30px; }
          .field { margin-bottom: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; }
          .field:last-of-type { border-bottom: none; margin-bottom: 0; }
          .label { font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
          .value { color: #1f2937; font-size: 15px; line-height: 1.5; }
          .icon { display: inline-block; width: 16px; text-align: center; margin-right: 8px; }
          .footer { background: #f3f4f6; color: #4b5563; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer-logo { max-width: 150px; height: auto; margin-bottom: 15px; }
          .footer p { margin: 8px 0; font-size: 13px; line-height: 1.6; }
          .footer strong { color: #111827; }
          .social-links { margin: 25px 0 20px; padding: 20px 0; border-top: 1px solid #d1d5db; border-bottom: 1px solid #d1d5db; }
          .social-links a { display: inline-block; margin: 0 12px; color: #dc2626; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; vertical-align: middle; }
          .social-links a:hover { color: #ef4444; }
          .social-links svg { display: inline-block; vertical-align: middle; margin-right: 4px; }
          .contact-info { margin: 20px 0; font-size: 13px; line-height: 1.8; color: #4b5563; }
          .contact-info a { color: #dc2626; text-decoration: none; }
          .company-details { margin: 20px 0; padding: 15px; background: #e5e7eb; border-radius: 6px; font-size: 12px; line-height: 1.8; color: #374151; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://aetechlabs.com/logo-light.png" alt="AETech Labs" class="logo-img">
            <h1><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>New Contact Inquiry</h1>
            <p>Someone has reached out through your website</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <div class="value">${data.email}</div>
            </div>
            ${data.phone ? `
            <div class="field">
              <span class="label">Phone:</span>
              <div class="value">${data.phone}</div>
            </div>
            ` : ''}
            ${data.company ? `
            <div class="field">
              <span class="label">Company:</span>
              <div class="value">${data.company}</div>
            </div>
            ` : ''}
            ${data.country ? `
            <div class="field">
              <span class="label">Country:</span>
              <div class="value">${data.country}</div>
            </div>
            ` : ''}
            ${data.projectType ? `
            <div class="field">
              <span class="label">Project Type:</span>
              <div class="value">${data.projectType}</div>
            </div>
            ` : ''}
            ${data.budget ? `
            <div class="field">
              <span class="label">Budget:</span>
              <div class="value">${data.budget} (${data.currency || 'USD'})</div>
            </div>
            ` : ''}
            ${data.timeline ? `
            <div class="field">
              <span class="label">Timeline:</span>
              <div class="value">${data.timeline}</div>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Message:</span>
              <div class="value" style="white-space: pre-wrap;">${data.message}</div>
            </div>
            <div class="field">
              <span class="label">Submitted:</span>
              <div class="value">${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</div>
            </div>
          </div>
          <div class="footer">
            <img src="https://aetechlabs.com/logo-light.png" alt="AETech Labs" class="footer-logo">
            <p><strong>AETech Research Labs Limited</strong></p>
            <p>Empowering Innovation Through Technology</p>
            <div class="social-links">
              <a href="https://twitter.com/aetechlabs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
                Twitter/X
              </a>
              <a href="https://linkedin.com/company/aetechlabs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
              <a href="https://facebook.com/aetechlabs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
              <a href="https://instagram.com/aetechlabs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                Instagram
              </a>
              <a href="https://github.com/aetechlabs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                GitHub
              </a>
            </div>
            <div class="contact-info">
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <a href="mailto:info@aetechlabs.com">info@aetechlabs.com</a>
              </p>
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                <a href="https://aetechlabs.com">www.aetechlabs.com</a>
              </p>
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Suite 30, 2nd Floor Es-Em Plaza, No 34, Munguno Crescent<br>
                <span style="margin-left: 20px;">Behind Berger Yard, Utako, Abuja, Nigeria</span>
              </p>
            </div>
            <div class="company-details">
              <p><strong>AETech Research Labs Limited</strong> | RC 8627078</p>
              <p>Registered in Nigeria</p>
            </div>
            <p style="margin-top: 20px; font-size: 11px; color: #6b7280;">This email was sent from the AETech Labs contact form. Reply directly to respond to ${data.name}.</p>
            <p style="font-size: 11px; color: #6b7280;">© ${new Date().getFullYear()} AETech Research Labs Limited. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateConfirmationHTML(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: #f3f4f6; color: #111827; padding: 50px 30px; text-align: center; border-bottom: 1px solid #e5e7eb; }
          .logo-img { max-width: 200px; height: auto; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 32px; font-weight: 700; color: #111827; }
          .checkmark { font-size: 48px; margin-bottom: 10px; color: #10b981; }
          .content { padding: 40px 30px; }
          .content h2 { color: #dc2626; margin-top: 0; font-size: 24px; }
          .content p { color: #4b5563; font-size: 16px; line-height: 1.8; margin: 16px 0; }
          .icon { display: inline-block; width: 20px; text-align: center; margin-right: 8px; }
          .highlight-box { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; padding: 24px; margin: 24px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
          .highlight-box p { margin: 0; color: #991b1b; font-weight: 600; font-size: 15px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white !important; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2); transition: transform 0.2s, box-shadow 0.2s; }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(220, 38, 38, 0.3); }
          .footer { background: #f3f4f6; color: #4b5563; padding: 40px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer-logo { max-width: 160px; height: auto; margin-bottom: 20px; }
          .footer p { margin: 8px 0; font-size: 14px; line-height: 1.6; }
          .footer strong { color: #111827; font-size: 16px; }
          .social-links { margin: 30px 0 25px; padding: 25px 0; border-top: 1px solid #d1d5db; border-bottom: 1px solid #d1d5db; }
          .social-links a { display: inline-block; margin: 0 12px; color: #dc2626; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; vertical-align: middle; }
          .social-links a:hover { color: #ef4444; }
          .social-links svg { display: inline-block; vertical-align: middle; margin-right: 4px; }
          .contact-info { margin: 25px 0; font-size: 14px; line-height: 2; color: #4b5563; }
          .contact-info a { color: #dc2626; text-decoration: none; font-weight: 500; }
          .contact-info a:hover { color: #ef4444; }
          .company-details { margin: 20px 0; padding: 15px; background: #e5e7eb; border-radius: 6px; font-size: 12px; line-height: 1.8; color: #374151; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://aetechlabs.com/logo-light.png" alt="AETech Labs" class="logo-img">
            <div class="checkmark">✓</div>
            <h1>Thank You for Reaching Out!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for contacting <strong>AETech Research Labs Limited</strong>. We've received your message and truly appreciate you taking the time to reach out to us.</p>
            
            <div class="highlight-box">
              <p><span class="icon">✉</span>Our team will review your inquiry and get back to you within 24-48 hours.</p>
            </div>

            <p><strong>What happens next?</strong></p>
            <p>Our dedicated team is already reviewing your message. We'll respond to your inquiry as soon as possible with the information you need or to schedule a consultation if required.</p>

            <p><strong>In the meantime, feel free to explore:</strong></p>
            <p style="padding-left: 20px;">
              <span class="icon">📄</span>Our latest <a href="https://aetechlabs.com/blog" style="color: #dc2626; text-decoration: none; font-weight: 500;">blog posts</a> and insights<br>
              <span class="icon">👥</span>Learn more <a href="https://aetechlabs.com/about" style="color: #dc2626; text-decoration: none; font-weight: 500;">about us</a> and our mission<br>
              <span class="icon">🎓</span>Check out our <a href="https://aetechlabs.com/bootcamp" style="color: #dc2626; text-decoration: none; font-weight: 500;">bootcamp programs</a><br>
              <span class="icon">💼</span>Explore <a href="https://aetechlabs.com/volunteer" style="color: #dc2626; text-decoration: none; font-weight: 500;">volunteer opportunities</a>
            </p>

            <center>
              <a href="https://aetechlabs.com" class="cta-button">Visit Our Website</a>
            </center>

            <p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <strong>Need immediate assistance?</strong><br>
              Feel free to reach out directly at <a href="mailto:info@aetechlabs.com" style="color: #dc2626; text-decoration: none; font-weight: 500;">info@aetechlabs.com</a>
            </p>
          </div>
          <div class="footer">
            <img src="https://aetechlabs.com/logo-light.png" alt="AETech Labs" class="footer-logo">
            <p><strong>AETech Research Labs Limited</strong></p>
            <p>Empowering Innovation Through Technology</p>
            <div class="social-links">
              <a href="https://twitter.com/aetechlabs" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
                Twitter/X
              </a>
              <a href="https://linkedin.com/company/aetechlabs" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
              <a href="https://facebook.com/aetechlabs" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
              <a href="https://instagram.com/aetechlabs" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                Instagram
              </a>
              <a href="https://github.com/aetechlabs" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                GitHub
              </a>
            </div>
            <div class="contact-info">
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <a href="mailto:info@aetechlabs.com">info@aetechlabs.com</a>
              </p>
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                <a href="https://aetechlabs.com">www.aetechlabs.com</a>
              </p>
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Suite 30, 2nd Floor Es-Em Plaza, No 34, Munguno Crescent<br>
                <span style="margin-left: 20px;">Behind Berger Yard, Utako, Abuja, Nigeria</span>
              </p>
            </div>
            <div class="company-details">
              <p><strong>AETech Research Labs Limited</strong> | RC 8627078</p>
              <p>Registered in Nigeria</p>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280; line-height: 1.6;">
              Follow us @aetechlabs on all social media platforms for the latest updates,<br>
              tech insights, and innovation stories.
            </p>
            <p style="margin-top: 20px; font-size: 11px; color: #6b7280;">
              © ${new Date().getFullYear()} AETech Research Labs Limited. All rights reserved.<br>
              This email was sent because you submitted a contact form on our website.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
