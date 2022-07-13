const mailOption = (email, subject, html) => ({
  from: process.env.MAIL_ADMIN,
  to: email,
  subject,
  html: `
    <h2>${html}</h2>
  `,
});

export default mailOption;
