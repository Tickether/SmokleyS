// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer';
/*
type Data = {
  name: string
}
*/
/*
export default function sendEmail(
  req: NextApiRequest,
  res: NextApiResponse /*<Data>*/
/*) {
  res.status(200).json({ name: 'John Doe' })
}
*/

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.NEXT_PUBLIC_USER,
        pass: process.env.NEXT_PUBLIC_PASS,
      },
    });

    const { email, firstname, lastname } = req.body;

    //first mail sent to buyer
    const options = {
      from: 'tickether@gmail.com',
      to: email, // Dynamic recipient email address
      subject: 'Hello World',
      html: `
        <p>Dear ${firstname} ${lastname},</p>
        <p>This is the body of the email.</p>
      `,
    };
    await transporter.sendMail(options);

    //second mail sent to owner
    const option = {
      from: 'tickether@gmail.com',// from sales/support account
      to: 'okley@newsbag.co.uk', // shippers recipient email address
      subject: 'Hello World',
      html: `
        <p>Dear ${firstname} ${lastname},</p>
        <p>This is the body of the email.</p>
      `,
    };
    await transporter.sendMail(option);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the email' });
  }
}

export default sendEmail;