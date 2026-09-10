import { EventEmitter } from 'events';
import nodemailer from 'nodemailer';

// 1. Event Emitter instance banayein
export const emailEmitter = new EventEmitter();

// 2. Nodemailer Transporter Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// 3. Event Listener (Async Email Background Handler)
emailEmitter.on('sendTaskEmail', async (data: { to: string; taskTitle: string; userName: string }) => {
  try {
    const mailOptions = {
      from: `"Employee Portal" <${process.env.EMAIL_USER}>`,
      to: data.to,
      subject: 'New Task Assigned',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">New Task Notification</h2>
          <p>Hello <b>${data.userName}</b>,</p>
          <p>You have been assigned a new task: <span style="color: #2563eb; font-weight: bold;">${data.taskTitle}</span></p>
          <br/>
          <p style="font-size: 12px; color: #64748b;">This is an automated system notification.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Async Email Sent Successfully:', info.messageId);
  } catch (error) {
    console.error('Failed to send async email:', error);
  }
});