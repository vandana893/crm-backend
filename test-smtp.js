require('dotenv').config();
const mailService = require('./services/mail/mail.service');

async function testSMTP() {
  try {
    console.log('Testing SMTP with credentials from .env:');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('User:', process.env.SMTP_USER);
    
    // The service constructor automatically calls transporter.verify()
    // We just need to wait a bit for the async verification log to print
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('SMTP test complete. Check the logs above for success/error.');
    process.exit(0);
  } catch (error) {
    console.error('SMTP test failed:', error);
    process.exit(1);
  }
}

testSMTP();
