import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using your email provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any other email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

export async function POST(req: NextRequest) {
  try {
    const email = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // List of recipients
      subject: 'Welcome!', // Subject line
      text: 'Thank you for signing up!', // Plain text body
      html: '<h1>Welcome!</h1><p>Thank you for signing up!</p>', // HTML body
    };

    const info = await transporter.sendMail(mailOptions);

    // Return a success response
    return NextResponse.json({
      message: 'Email sent successfully',
      info: info.response,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
