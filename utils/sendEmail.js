import nodemailer from 'nodemailer';

const handleSendEmail = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      return 0;
    }
    console.log('Email send successfully');
    return 1;
  });
};

export default handleSendEmail;
