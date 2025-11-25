import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CHIGGAS_EMAIL,
    pass: process.env.CHIGGAS_PASSWORD,
  },
});


export const sendMail = async ({ to, subject, html, attachments }) => {
  return transporter.sendMail({
    from: `Verification Code ${process.env.CHIGGAS_EMAIL}`,
    to,
    subject,
    html,
    attachments,
  });
};