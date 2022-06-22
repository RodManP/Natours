const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1 create a transporterver
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // activate in gmail 'less secure option app'
  });
  // 2 define email options
  const mailOptions = {
    from: 'user <user@email.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3 send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
