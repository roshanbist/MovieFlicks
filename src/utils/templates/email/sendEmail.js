import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const source = fs.readFileSync(
    path.join(import.meta.dirname, options.template),
    'utf-8'
  );

  const compiledTemplate = Handlebars.compile(source);

  const mailOptions = {
    from: '<movieflicks@mail.com>',
    to: options.to,
    subject: options.subject,
    html: compiledTemplate(options.payload),
  };

  await transporter.sendMail(mailOptions);
};
