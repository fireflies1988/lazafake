const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

function sendMail({ to, subject, html }, callback) {
  const mailOptions = {
    from: {
      name: "LazaFake",
      address: process.env.MAIL_USERNAME,
    },
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, callback);
}

function sendVerificationCode(to, verificationCode, callback) {
  const mailOptions = {
    to: to,
    subject: `Email verification code: ${verificationCode}`,
    html: `<div>
    <h3>Thank You For Signing Up.</h3>
    <p>Use the following code to complete your Sign Up procedure: <span style="background-color:#d9f7be;padding:0.5rem;border-radius:5px;font-weight:bold;">${verificationCode}</span></p>
    <p>This code will expires in 15 minutes.</p>
    <p>If this wasn't you, you can safely ignore this email.</p>
  </div>`,
  };

  sendMail(mailOptions, callback);
}

// sendVerificationCode("tester2@gmail.com", "234123", (err, info) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(info);
//   }
// });

module.exports = {
  sendMail,
  sendVerificationCode,
};
