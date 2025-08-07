const { SendMailClient } = require('zeptomail');
require('dotenv').config();

const client = new SendMailClient({
  url: "api.zeptomail.com/",
  token: process.env.ZEPTOMAIL_API_KEY,
});

async function testEmailSending() {
  console.log('Testing ZeptoMail configuration...');
  console.log('API Key (first 20 chars):', process.env.ZEPTOMAIL_API_KEY?.substring(0, 20) + '...');
  console.log('Default sender:', process.env.ZEPTOMAIL_SENDER);
  
  const testEmails = [
    'noreply@aetechlabs.com',
    'jonathan@aetechlabs.com',
    'marketing@aetechlabs.com',
    'info@aetechlabs.com',
    'admin@aetechlabs.com'
  ];
  
  for (const fromEmail of testEmails) {
    try {
      console.log(`\n🧪 Testing sending from: ${fromEmail}`);
      
      const response = await client.sendMail({
        from: {
          address: fromEmail,
          name: 'AETech Test',
        },
        to: [
          {
            email_address: {
              address: 'syipmong5@gmail.com', // Your test email
            },
          },
        ],
        subject: `Test from ${fromEmail}`,
        htmlbody: `<p>This is a test email from ${fromEmail}</p>`,
        textbody: `This is a test email from ${fromEmail}`,
      });

      console.log(`✅ SUCCESS - ${fromEmail}:`, response);
    } catch (error) {
      console.log(`❌ FAILED - ${fromEmail}:`, error.error || error.message || error);
    }
  }
}

testEmailSending().catch(console.error);
