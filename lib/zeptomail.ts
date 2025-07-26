import { SendMailClient } from 'zeptomail';

if (!process.env.ZEPTOMAIL_API_KEY) {
  throw new Error('ZEPTOMAIL_API_KEY is required');
}

export const zeptoClient = new SendMailClient({
  url: "api.zeptomail.com/",
  token: process.env.ZEPTOMAIL_API_KEY,
});

interface EmailData {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  fromName?: string;
  fromEmail?: string;
}

export const sendEmail = async ({
  to,
  subject,
  htmlBody,
  textBody,
  fromName = process.env.ZEPTOMAIL_SENDER_NAME || 'AETech Research Labs',
  fromEmail = process.env.ZEPTOMAIL_SENDER || 'noreply@nxditechsolutions.com.ng'
}: EmailData) => {
  try {
    console.log('Sending email with config:', {
      from: fromEmail,
      to: to,
      subject: subject
    });
    
    const response = await zeptoClient.sendMail({
      from: {
        address: fromEmail,
        name: fromName,
      },
      to: [
        {
          email_address: {
            address: to,
          },
        },
      ],
      subject,
      htmlbody: htmlBody,
      textbody: textBody || htmlBody.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });

    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Email config used:', { fromEmail, fromName, to, subject });
    throw error;
  }
};

// Template for contact form notifications
export const sendContactNotification = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  subject: string;
  message: string;
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nxditechsolutions.com.ng';
  
  const htmlBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${contactData.name}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
    ${contactData.country ? `<p><strong>Country:</strong> ${contactData.country}</p>` : ''}
    <p><strong>Subject:</strong> ${contactData.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${contactData.message.replace(/\n/g, '<br>')}</p>
    
    <hr>
    <p><small>This email was sent from the AETech website contact form.</small></p>
  `;

  return await sendEmail({
    to: adminEmail,
    subject: `New Contact: ${contactData.subject}`,
    htmlBody,
    fromName: 'AETech Website',
  });
};

// Template for contact form confirmation
export const sendContactConfirmation = async (contactData: {
  name: string;
  email: string;
  subject: string;
}) => {
  const htmlBody = `
    <h2>Thank you for contacting AETech!</h2>
    <p>Dear ${contactData.name},</p>
    
    <p>We have received your inquiry regarding "${contactData.subject}" and will get back to you within 24-48 hours.</p>
    
    <p>Our team is excited to learn more about your project and explore how we can help you achieve your technology goals.</p>
    
    <p>Best regards,<br>
    The AETech Team</p>
    
    <hr>
    <p><small>This is an automated confirmation. Please do not reply to this email.</small></p>
  `;

  return await sendEmail({
    to: contactData.email,
    subject: 'Thank you for contacting AETech',
    htmlBody,
  });
};
