import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "://gmail.com",
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendWelcomeEmail(toEmail, userName) {
  // ABSOLUTE PROTECTION: Wrap the entire execution so email network drops can't crash your server
  try {
    const mailOptions = {
      from: `"Our E-Commerce Store" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Welcome to Our Store! 🎉",
      html: `<h2>Hello ${userName || "there"},</h2><p>Welcome aboard!</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SENT] Welcome message delivered to ${toEmail}`);
  } catch (error) {
    // This logs the SMTP problem to your terminal but ALLOWS the user to sign up anyway!
    console.error("[MAILER ERROR - SERVER SAFE]:", error.message);
  }
}

export default sendWelcomeEmail;
