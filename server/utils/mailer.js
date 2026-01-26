import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


export const sendMail = async ({ to, subject, html, attachments }) => {
  return transporter.sendMail({
    from: `Verification Code ${process.env.MAIL_USER} `,
    to,
    subject,
    html,
    attachments,
  });
};