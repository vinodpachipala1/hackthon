// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";
// dotenv.config();

// // Set SendGrid API Key
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendEmail = async (to, subject, html) => {
//   try {
//     await sgMail.send({
//       to,
//       from: process.env.SENDGRID_SENDER, // Verified sender in SendGrid
//       subject,
//       html,
//     });
//     console.log(`✅ Email sent to ${to}`);
//   } catch (err) {
//     console.error("❌ Error sending email:", err.response?.body || err);
//   }
// };
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  if (!to) {
    throw new Error("No recipient email provided");
  }

  await transporter.sendMail({
    from: `"India Post" <${process.env.SMTP_USER}>`,
    to,                 // 👈 THIS IS REQUIRED
    subject,
    html,
  });
};
