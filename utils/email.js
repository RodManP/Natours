const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas Smith <${process.env.EMAIL_FROM}>`;
  }

  // 1 create a transporter
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //send grid email
      // return nodemailer.createTransport({
      //   service: 'SendGrid',
      //   auth: {
      //     user: process.env.SENDGRID_USERNAME,
      //     pass: process.env.SENDGRID_PASSWORD,
      //   },
      // });
      return 1
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      PORT: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the email
  async send(template, subject) {
    //Render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    //Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // Create transporter and send mail
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token');
  }
};
