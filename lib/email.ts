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
    
    const response = await fetch(`${apiUrl}/contact/email`, {
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
      console.error('Email sending failed:', await response.text());
      return false;
    }

    console.log('Contact Email Data:', {
      to: data.to,
      from: data.from,
      subject: data.subject,
      timestamp: new Date().toISOString()
    });

    return true;

  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export async function sendConfirmationEmail(email: string, name: string): Promise<boolean> {
  try {
    console.log('Sending confirmation to:', email);
    
    // TODO: Send confirmation email to user
    // This would contain a thank you message and what to expect next
    
    return true;
  } catch (error) {
    console.error('Confirmation email failed:', error);
    return false;
  }
}

function generateEmailHTML(data: EmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #4b5563; display: block; margin-bottom: 5px; }
          .value { color: #111827; padding: 10px; background: white; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
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
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
