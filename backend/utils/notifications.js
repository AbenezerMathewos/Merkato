/**
 * Mock Notification Service
 * Simulates sending Emails (via SendGrid/AWS SES) and SMS (via Twilio/EthioTelecom)
 */

const sendEmail = async (to, subject, htmlBody) => {
    // In production, this would use a real provider:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ to, from: 'noreply@merkato.com', subject, html: htmlBody });
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`\n======================================================`);
            console.log(`📧 [EMAIL SENT]`);
            console.log(`To:      ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body:    (HTML Content) ${htmlBody.substring(0, 100)}...`);
            console.log(`======================================================\n`);
            resolve(true);
        }, 500); // simulate network latency
    });
};

const sendSMS = async (phone, message) => {
    // In production, this would use a real provider:
    // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    // await client.messages.create({ body: message, from: '+123456789', to: phone });
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`\n======================================================`);
            console.log(`📱 [SMS SENT]`);
            console.log(`To:      ${phone}`);
            console.log(`Message: ${message}`);
            console.log(`======================================================\n`);
            resolve(true);
        }, 300); // simulate network latency
    });
};

module.exports = {
    sendEmail,
    sendSMS
};
