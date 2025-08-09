interface EmailTemplateProps {
  studentName: string;
  notes?: string;
  selectedCourse?: string;
  enrollmentDate?: string;
  baseUrl?: string;
}

export const createEmailTemplate = (content: string, props: EmailTemplateProps) => {
  const { studentName, baseUrl = process.env.NEXTAUTH_URL || 'https://aetechlabs.com' } = props;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AETech Research Labs</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #c1272d 0%, #8B1538 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .header img {
          max-width: 180px;
          height: auto;
          margin-bottom: 20px;
          filter: brightness(0) invert(1);
        }
        
        .header h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .content {
          padding: 30px;
        }
        
        .greeting {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          border-left: 4px solid #c1272d;
        }
        
        .greeting p {
          font-size: 16px;
          margin: 0;
          color: #2c3e50;
        }
        
        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }
        
        .approved {
          background-color: #d4edda;
          color: #155724;
          border: 2px solid #c3e6cb;
        }
        
        .rejected {
          background-color: #f8d7da;
          color: #721c24;
          border: 2px solid #f5c6cb;
        }
        
        .waitlist {
          background-color: #fff3cd;
          color: #856404;
          border: 2px solid #ffeaa7;
        }
        
        .info-box {
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #007bff;
        }
        
        .info-box.success {
          background-color: #d4edda;
          border-left-color: #28a745;
        }
        
        .info-box.warning {
          background-color: #fff3cd;
          border-left-color: #ffc107;
        }
        
        .info-box.error {
          background-color: #f8d7da;
          border-left-color: #dc3545;
        }
        
        .info-box h3 {
          color: #c1272d;
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .course-list {
          list-style: none;
          padding: 0;
        }
        
        .course-list li {
          background: #f8f9fa;
          padding: 10px 15px;
          margin: 8px 0;
          border-radius: 6px;
          border-left: 3px solid #c1272d;
        }
        
        .schedule-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        
        .schedule-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .schedule-item h4 {
          color: #c1272d;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .schedule-item p {
          margin: 4px 0;
          font-size: 13px;
          color: #6c757d;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #c1272d 0%, #8B1538 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(193, 39, 45, 0.3);
          transition: all 0.3s ease;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(193, 39, 45, 0.4);
        }
        
        .footer {
          background: #2c3e50;
          color: #ecf0f1;
          padding: 30px;
          text-align: center;
        }
        
        .footer-logo {
          max-width: 120px;
          height: auto;
          margin-bottom: 20px;
          filter: brightness(0) invert(1);
        }
        
        .contact-info {
          margin: 20px 0;
        }
        
        .contact-info a {
          color: #c1272d;
          text-decoration: none;
        }
        
        .contact-info a:hover {
          text-decoration: underline;
        }
        
        .disclaimer {
          background: #34495e;
          padding: 15px;
          margin-top: 20px;
          border-radius: 6px;
          font-size: 12px;
          color: #bdc3c7;
        }
        
        .social-links {
          margin-top: 20px;
        }
        
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #c1272d;
          text-decoration: none;
          font-weight: 500;
        }
        
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 8px;
          }
          
          .header, .content, .footer {
            padding: 20px;
          }
          
          .schedule-grid {
            grid-template-columns: 1fr;
          }
          
          .header h1 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <img src="${baseUrl}/logo-light.png" alt="AETech Research Labs Limited" />
          <h1>AETech Bootcamp Application Update</h1>
        </div>
        
        <!-- Content -->
        <div class="content">
          <div class="greeting">
            <p>Dear <strong>${studentName}</strong>,</p>
          </div>
          
          ${content}
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <img src="${baseUrl}/logo-light.png" alt="AETech Research Labs" class="footer-logo" />
          
          <div class="contact-info">
            <p><strong>AETech Research Labs Limited</strong></p>
            <p>Engineering Tomorrow's Solutions</p>
            <p>
              Email: <a href="mailto:info@aetechlabs.com">info@aetechlabs.com</a><br>
              Phone: +234 704 440 0347
            </p>
          </div>
          
          <div class="social-links">
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
          </div>
          
          <div class="disclaimer">
            <p>
              This is an automated message. Please do not reply to this email. 
              For questions, contact us at <a href="mailto:info@aetechlabs.com">info@aetechlabs.com</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const approvalEmailContent = (props: EmailTemplateProps & { 
  selectedCourse?: string; 
  courseAvailability?: any;
  enrollmentInterests?: string[];
}) => {
  const { selectedCourse, courseAvailability, enrollmentInterests, notes } = props;
  
  const courseInfo = selectedCourse ? courseAvailability?.[selectedCourse] : null;
  const isSelectedCourseAvailable = courseInfo?.available !== false;
  
  if (!isSelectedCourseAvailable && selectedCourse) {
    return `
      <div class="status-badge waitlist">Course Selection Required</div>
      
      <div class="info-box warning">
        <h3>⚠️ Course Availability Update</h3>
        <p>Thank you for your interest in our bootcamp program. We have reviewed your application and would like to offer you admission, however we need to discuss your course selection.</p>
      </div>
      
      <div class="info-box error">
        <h3>📚 Course Availability Issue</h3>
        <p><strong>Selected Course:</strong> ${selectedCourse}</p>
        <p><strong>Status:</strong> ${courseInfo?.message || 'Currently unavailable'}</p>
      </div>
      
      <div class="info-box success">
        <h3>🔄 Alternative Options</h3>
        <p>We'd love to have you in our bootcamp! Here are available alternatives:</p>
        <ul class="course-list">
          ${enrollmentInterests
            ?.filter((course: string) => courseAvailability?.[course]?.available !== false && course !== selectedCourse)
            .map((course: string) => `<li><strong>${course}</strong></li>`).join('') || ''}
        </ul>
      </div>
      
      <div class="info-box">
        <h3>📋 Next Steps</h3>
        <ol>
          <li>Reply to this email with your preferred alternative course</li>
          <li>Or schedule a call with our admissions team to discuss options</li>
          <li>We'll confirm your new course selection within 24 hours</li>
          <li>Once confirmed, you'll receive your full admission package</li>
        </ol>
      </div>
      
      ${notes ? `
      <div class="info-box">
        <h3>📝 Additional Information</h3>
        <p>${notes}</p>
      </div>
      ` : ''}
    `;
  }
  
  return `
    <div class="status-badge approved">✅ Application Approved</div>
    
    <div class="info-box success">
      <h3>🎉 Congratulations! You're Accepted!</h3>
      <p>We're excited to inform you that your application for the AETech Bootcamp has been <strong>APPROVED</strong>!</p>
    </div>
    
    <div class="info-box">
      <h3>📚 Your Course Details</h3>
      <div class="course-list">
        <li><strong>Selected Course:</strong> ${selectedCourse || 'To be confirmed'}</li>
        <li><strong>Format:</strong> Online (Google Meet & Zoom)</li>
        <li><strong>Duration:</strong> 8 weeks intensive program</li>
        <li><strong>Start Date:</strong> September 15, 2025</li>
      </div>
    </div>
    
    <div class="info-box">
      <h3>📅 Class Schedule</h3>
      <div class="schedule-grid">
        <div class="schedule-item">
          <h4>📚 Tuesday Sessions</h4>
          <p><strong>Time:</strong> 6:00pm – 8:00pm</p>
          <p><strong>Focus:</strong> Theory & Concepts</p>
          <p>Core learning sessions with interactive lectures</p>
        </div>
        <div class="schedule-item">
          <h4>💻 Thursday Sessions</h4>
          <p><strong>Time:</strong> 6:00pm – 8:00pm</p>
          <p><strong>Focus:</strong> Practical Projects</p>
          <p>Hands-on coding and project development</p>
        </div>
        <div class="schedule-item">
          <h4>❓ Monday Q&A (Optional)</h4>
          <p><strong>Time:</strong> 9:00am – 11:00am</p>
          <p><strong>Cost:</strong> ₦15,000/session</p>
          <p>Get answers and clarify concepts</p>
        </div>
        <div class="schedule-item">
          <h4>🔧 Friday Support (Optional)</h4>
          <p><strong>Time:</strong> 7:00pm – 9:00pm</p>
          <p><strong>Cost:</strong> ₦15,000/session</p>
          <p>Extra support for challenging topics</p>
        </div>
      </div>
    </div>
    
    <div class="info-box">
      <h3>📋 Next Steps</h3>
      <ol>
        <li>Join our orientation session (details coming soon)</li>
        <li>Set up your development environment</li>
        <li>Join our exclusive student Slack/Discord community</li>
        <li>Prepare for an amazing learning journey!</li>
      </ol>
    </div>
    
    <a href="#" class="cta-button">Join Student Portal</a>
    
    ${notes ? `
    <div class="info-box">
      <h3>📝 Additional Information</h3>
      <p>${notes}</p>
    </div>
    ` : ''}
  `;
};

export const rejectionEmailContent = (props: EmailTemplateProps) => {
  const { notes } = props;
  
  return `
    <div class="status-badge rejected">❌ Application Status Update</div>
    
    <div class="info-box error">
      <h3>Application Review Complete</h3>
      <p>Thank you for your interest in the AETech Bootcamp. After careful review of your application, we regret to inform you that we cannot offer you a place in our current cohort.</p>
    </div>
    
    <div class="info-box">
      <h3>🚀 Don't Give Up!</h3>
      <p>While we cannot accept you at this time, we encourage you to:</p>
      <ul class="course-list">
        <li>Continue developing your programming skills</li>
        <li>Join our free monthly tech meetups</li>
        <li>Follow our blog for industry insights</li>
        <li>Apply for future cohorts</li>
      </ul>
    </div>
    
    <div class="info-box">
      <h3>📈 Recommended Resources</h3>
      <ul class="course-list">
        <li>Free coding courses on our learning platform</li>
        <li>Open source projects to contribute to</li>
        <li>Tech community events and workshops</li>
        <li>One-on-one mentorship opportunities</li>
      </ul>
    </div>
    
    ${notes ? `
    <div class="info-box">
      <h3>📝 Feedback</h3>
      <p>${notes}</p>
    </div>
    ` : ''}
  `;
};

export const waitlistEmailContent = (props: EmailTemplateProps) => {
  const { notes } = props;
  
  return `
    <div class="status-badge waitlist">⏳ Added to Waitlist</div>
    
    <div class="info-box warning">
      <h3>You're on our Priority Waitlist!</h3>
      <p>Thank you for your application to the AETech Bootcamp. While we were impressed with your submission, our current cohort is at capacity. We've added you to our priority waitlist.</p>
    </div>
    
    <div class="info-box">
      <h3>🎯 What This Means</h3>
      <ul class="course-list">
        <li>You'll be first in line for any openings</li>
        <li>Priority consideration for the next cohort</li>
        <li>Access to pre-bootcamp preparation materials</li>
        <li>Invitation to exclusive community events</li>
      </ul>
    </div>
    
    <div class="info-box">
      <h3>📚 While You Wait</h3>
      <ul class="course-list">
        <li>Keep building your programming skills</li>
        <li>Join our free monthly tech meetups</li>
        <li>Follow our blog for industry insights</li>
        <li>Network with our alumni community</li>
      </ul>
    </div>
    
    <a href="#" class="cta-button">Access Preparation Materials</a>
    
    ${notes ? `
    <div class="info-box">
      <h3>📝 Additional Information</h3>
      <p>${notes}</p>
    </div>
    ` : ''}
  `;
};
