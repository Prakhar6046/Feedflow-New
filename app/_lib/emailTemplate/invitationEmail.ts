import { SingleUser } from '@/app/_typeModels/User';
import nodemailer from 'nodemailer';
export const InvitationEmail = async (user: SingleUser) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use any other email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: user.email, // List of recipients
      subject: 'Welcome!', // Subject line
      text: 'Thank you for signing up!', // Plain text body
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />

          <title>Invitation Email</title>
        </head>
        <body style="margin: 0">
          <div
            class="container"
            style="
              background-color: #f2f2f2;
              line-height: 1.7rem;
              fontFamily: 'Arial', sans-serif;
              padding: 25px 0px;
              height: 100vh !important;
              font-size: 18px;
            "
          >
            <div class="main" style="margin: 0 auto; max-width: 650px; width: 90%">
              <div
                class="main-content"
                style="
                  background: #fff;
                  padding: 30px 20px;
                  margin-top: 10px;
                  box-shadow: 0 0 10px lightgray;
                  border-radius: 10px;
                "
              >
                <img
                  src="https://i.ibb.co/hyQDrVM/logo.png"
                  alt="Logo"
                  class="logo-img"
                  style="width: 200px; margin-bottom: 20px"
                />
                <h3 class="m-0" style="margin: 0">Hi ${user.name}</h3>
                <p class="m-0" style="margin: 10px 0">
                You are invited to join Feedflow.
                </p>
                
                <p
                  style="line-height: 1.4; font-size: 16px; color: #505050; margin:0"
                >
                 <a href="${process.env.BASE_URL}/joinOrganisation/${user.id}"> Click here</a> to join and set password.
                </p>
             
                <div style="margin-block: 15px; border: 1px solid #ededed"></div>
                <p style="font-size: 16px; fontWeight: 600; margin: 0">Thanks,</p>
                <p style="margin: 0">
                 Team Feedflow
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};
