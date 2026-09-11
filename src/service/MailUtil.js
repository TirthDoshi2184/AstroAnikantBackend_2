const postmark = require('postmark');

// Server API Token from Postmark dashboard (Server > API Tokens)
const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

const sendingMail = async (to, subject, text) => {
    try {
        const response = await client.sendEmail({
            From: process.env.POSTMARK_FROM_EMAIL, // Must be a verified Sender Signature
            To: to,
            Subject: subject,
            HtmlBody: text, // controllers already pass HTML strings
            MessageStream: 'outbound', // maps to Default Transactional Stream
        });
        console.log('Email sent successfully to:', to, '| MessageID:', response.MessageID);
        return response;
    } catch (error) {
        console.error('Postmark Error:', error.message);
        throw error;
    }
}

module.exports = { sendingMail };