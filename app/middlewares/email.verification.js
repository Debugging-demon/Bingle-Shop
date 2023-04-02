const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' })

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODE_EMAIL,
        pass: process.env.NODE_PASSWORD,
    },
});

async function sendVerificationEmail(newUser) {
    const token = newUser.verification_token;
    const url = `http://localhost:${process.env.PORT}/v1/verify-email?token=${token}&id=${newUser.id}`;
    const mailOptions = {
        from: "'Debugging Demon'<no-reply@gmail.com>",
        to: newUser.email,
        subject: 'Verify your email address',
        html: `Please click this link to verify your email address: <a href="${url}">${url}</a>`,
    };
    const info = await transport.sendMail(
        mailOptions
    );
    console.log(`Verification email sent to ${newUser.email}: ${info.messageId}`);
}

module.exports = {
    sendVerificationEmail,
};