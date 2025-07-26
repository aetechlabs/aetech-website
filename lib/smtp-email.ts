import nodemailer from 'nodemailer';

// Create SMTP transporter using ZeptoMail SMTP
const createTransporter = () => {
  if (!process.env.ZEPTOMAIL_SMTP_HOST || !process.env.ZEPTOMAIL_SMTP_PASS) {
    throw new Error('ZeptoMail SMTP configuration is missing');
  }

  return nodemailer.createTransport({
    host: process.env.ZEPTOMAIL_SMTP_HOST,
    port: parseInt(process.env.ZEPTOMAIL_SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.ZEPTOMAIL_SMTP_USER || 'emailapikey',
      pass: process.env.ZEPTOMAIL_SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
}

export const sendEmailSMTP = async ({
  to,
  subject,
  html,
  text,
  fromName = process.env.ZEPTOMAIL_SENDER_NAME || 'AETech',
  fromEmail = process.env.ZEPTOMAIL_SENDER || 'noreply@nxditechsolutions.com.ng'
}: EmailOptions) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    console.log('📧 Sending email via SMTP:', {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject,
      host: process.env.ZEPTOMAIL_SMTP_HOST,
      port: process.env.ZEPTOMAIL_SMTP_PORT
    });

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected
    });

    return result;
  } catch (error) {
    console.error('❌ SMTP Email error:', error);
    throw error;
  }
};

// Test SMTP connection
export const testSMTPConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return false;
  }
};

// Contact notification email template
export const sendContactNotificationSMTP = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  subject: string;
  message: string;
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'support@nxditechsolutions.com.ng';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #c1272d; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { background: white; padding: 10px; border-radius: 4px; margin-top: 5px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Contact Form Submission</h1>
          <p>AETech Website Contact Form</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">👤 Name:</div>
            <div class="value">${contactData.name}</div>
          </div>
          
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value">${contactData.email}</div>
          </div>
          
          ${contactData.phone ? `
          <div class="field">
            <div class="label">📱 Phone:</div>
            <div class="value">${contactData.phone}</div>
          </div>
          ` : ''}
          
          ${contactData.country ? `
          <div class="field">
            <div class="label">🌍 Country:</div>
            <div class="value">${contactData.country}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">📋 Subject:</div>
            <div class="value">${contactData.subject}</div>
          </div>
          
          <div class="field">
            <div class="label">💬 Message:</div>
            <div class="value">${contactData.message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent from the AETech website contact form.</p>
          <p>Please respond to the customer at: ${contactData.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmailSMTP({
    to: adminEmail,
    subject: `🔔 New Contact: ${contactData.subject}`,
    html,
  });
};

// Contact confirmation email template
export const sendContactConfirmationSMTP = async (contactData: {
  name: string;
  email: string;
  subject: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #c1272d; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .cta { background: #c1272d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Thank you for contacting AETech!</h1>
        </div>
        
        <div class="content">
          <p>Dear ${contactData.name},</p>
          
          <p>We have successfully received your inquiry regarding <strong>"${contactData.subject}"</strong> and will get back to you within 24-48 hours.</p>
          
          <p>Our team is excited to learn more about your project and explore how we can help you achieve your technology goals.</p>
          
          <p>In the meantime, feel free to explore our services and recent work on our website.</p>
          
          <p>Best regards,<br>
          <strong>The AETech Research Labs Team</strong></p>
          
          <hr style="border: 1px solid #ddd; margin: 30px 0;">
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>📧 You'll receive a detailed response within 24-48 hours</li>
            <li>📞 We may call you if you provided a phone number</li>
            <li>💼 We'll discuss your project requirements in detail</li>
            <li>🎯 We'll provide a customized solution proposal</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>This is an automated confirmation email.</p>
          <p>AETech Research Labs | nxditechsolutions.com.ng</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmailSMTP({
    to: contactData.email,
    subject: '✅ Thank you for contacting AETech - We\'ll be in touch soon!',
    html,
  });
};

// New comment notification to admin
export const sendNewCommentNotificationSMTP = async (commentData: {
  postTitle: string;
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  isReply?: boolean;
  parentAuthor?: string;
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'support@nxditechsolutions.com.ng';
  const websiteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #c1272d; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .comment-box { background: white; border-left: 4px solid #c1272d; padding: 15px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .btn { display: inline-block; background: #c1272d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💬 New ${commentData.isReply ? 'Reply' : 'Comment'}</h1>
        </div>
        <div class="content">
          <h2>New ${commentData.isReply ? 'reply' : 'comment'} on "${commentData.postTitle}"</h2>
          
          <p><strong>👤 Author:</strong> ${commentData.authorName}</p>
          ${commentData.authorEmail ? `<p><strong>📧 Email:</strong> ${commentData.authorEmail}</p>` : ''}
          ${commentData.isReply && commentData.parentAuthor ? `<p><strong>↩️ Replying to:</strong> ${commentData.parentAuthor}</p>` : ''}
          
          <div class="comment-box">
            <p><strong>💬 Comment:</strong></p>
            <p>${commentData.content.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>
            <a href="${websiteUrl}/admin/comments" class="btn">🛡️ Manage Comments</a>
            <a href="${websiteUrl}/blog/${commentData.postSlug}" class="btn">👁️ View Post</a>
          </p>
        </div>
        <div class="footer">
          <p>This notification was sent from the AETech blog system.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmailSMTP({
    to: adminEmail,
    subject: `💬 New ${commentData.isReply ? 'Reply' : 'Comment'}: ${commentData.postTitle}`,
    html,
  });
};

// Comment approval notification
export const sendCommentApprovedNotificationSMTP = async (commentData: {
  authorName: string;
  authorEmail: string;
  postTitle: string;
  postSlug: string;
  content: string;
}) => {
  const websiteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .comment-box { background: white; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Comment Approved!</h1>
        </div>
        <div class="content">
          <h2>Great news, ${commentData.authorName}!</h2>
          <p>Your comment on "<strong>${commentData.postTitle}</strong>" has been approved and is now visible to other readers.</p>
          
          <div class="comment-box">
            <p><strong>Your comment:</strong></p>
            <p>${commentData.content.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>
            <a href="${websiteUrl}/blog/${commentData.postSlug}" class="btn">👁️ View Your Comment</a>
          </p>
          
          <p>Thank you for engaging with our content! We appreciate your contribution to the discussion.</p>
        </div>
        <div class="footer">
          <p>This email was sent from AETech Blog.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmailSMTP({
    to: commentData.authorEmail,
    subject: `✅ Your comment on "${commentData.postTitle}" has been approved!`,
    html,
  });
};

// Reply notification to original commenter
export const sendReplyNotificationSMTP = async (replyData: {
  originalAuthorName: string;
  originalAuthorEmail: string;
  replyAuthorName: string;
  postTitle: string;
  postSlug: string;
  originalComment: string;
  replyContent: string;
}) => {
  const websiteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .comment-box { background: white; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; }
        .reply-box { background: white; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💬 Someone Replied to Your Comment!</h1>
        </div>
        <div class="content">
          <h2>Hi ${replyData.originalAuthorName}!</h2>
          <p><strong>${replyData.replyAuthorName}</strong> replied to your comment on "<strong>${replyData.postTitle}</strong>"</p>
          
          <div class="comment-box">
            <p><strong>Your original comment:</strong></p>
            <p>${replyData.originalComment.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div class="reply-box">
            <p><strong>${replyData.replyAuthorName}'s reply:</strong></p>
            <p>${replyData.replyContent.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>
            <a href="${websiteUrl}/blog/${replyData.postSlug}" class="btn">👁️ View the Conversation</a>
          </p>
          
          <p>Join the discussion and keep the conversation going!</p>
        </div>
        <div class="footer">
          <p>This email was sent from AETech Blog. You can unsubscribe from reply notifications in your account settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmailSMTP({
    to: replyData.originalAuthorEmail,
    subject: `💬 ${replyData.replyAuthorName} replied to your comment on "${replyData.postTitle}"`,
    html,
  });
};

// Contact status update notification
export const sendContactStatusUpdateSMTP = async (contactData: {
  name: string;
  email: string;
  subject: string;
  status: string;
  message?: string;
}) => {
  const statusEmojis: { [key: string]: string } = {
    'NEW': '🆕',
    'IN_PROGRESS': '⏳',
    'RESOLVED': '✅',
    'CLOSED': '🔒'
  };

  const statusMessages: { [key: string]: string } = {
    'NEW': 'We have received your message and will review it shortly.',
    'IN_PROGRESS': 'We are currently working on your request.',
    'RESOLVED': 'Your request has been resolved. If you need further assistance, please contact us again.',
    'CLOSED': 'Your request has been closed. Thank you for contacting us.'
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #c1272d; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .status-box { background: white; border-left: 4px solid #c1272d; padding: 15px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusEmojis[contactData.status]} Contact Status Update</h1>
        </div>
        <div class="content">
          <h2>Hi ${contactData.name}!</h2>
          <p>Your contact request "<strong>${contactData.subject}</strong>" has been updated.</p>
          
          <div class="status-box">
            <p><strong>New Status:</strong> ${statusEmojis[contactData.status]} ${contactData.status.replace('_', ' ')}</p>
            <p>${statusMessages[contactData.status]}</p>
            ${contactData.message ? `<p><strong>Message from our team:</strong><br>${contactData.message}</p>` : ''}
          </div>
          
          <p>If you have any questions or need further assistance, please don't hesitate to contact us again.</p>
          
          <p>Thank you for choosing AETech!</p>
        </div>
        <div class="footer">
          <p>This email was sent from AETech Customer Support.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmailSMTP({
    to: contactData.email,
    subject: `${statusEmojis[contactData.status]} Update on your request: ${contactData.subject}`,
    html,
  });
};
