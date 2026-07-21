import nodemailer from "nodemailer";

const hasEmailConfig =
  process.env.EMAIL_HOST &&
  process.env.EMAIL_PORT &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS;

const transporter = hasEmailConfig
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

async function sendWelcomeEmail(toEmail, userName) {
  if (!transporter) {
    console.warn(
      "[MAILER] SMTP configuration is missing; email delivery is disabled.",
    );
    return;
  }

  if (!toEmail) {
    console.warn("[MAILER] Missing recipient email; skipping welcome message.");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Our E-Commerce Store" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Welcome to Our Store! 🎉",
      html: `<h2>Hello ${userName || "there"},</h2><p>Welcome aboard!</p>`,
    });

    console.log(`[EMAIL SENT] Welcome message delivered to ${toEmail}`);
  } catch (error) {
    console.error("[MAILER ERROR - SERVER SAFE]:", error.message);
  }
}

export default sendWelcomeEmail;
