const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendMail({ to, subject, text }) {
  return transporter.sendMail({
    from: `"ExcelLens" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}

module.exports = sendMail;