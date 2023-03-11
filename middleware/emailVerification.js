const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({
    path: '.env'
})

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendVerificationEmail(users) {
    const token = users.verification_token;
    const url = `http://localhost:8080/v1/verify-email/${token}`;
    const mailOptions = {
        from: "'Debugging Demon'<no-reply@gmail.com>",
        to: users.email,
        subject: 'Verify your email address',
        html: `Please click this link to verify your email address: <a href="${url}">${url}</a>`,
    };
    const info = await transport.sendMail(
        mailOptions
    );
    console.log(`Verification email sent to ${users.email}: ${info.messageId}`);
}

module.exports = {
    sendVerificationEmail,
};