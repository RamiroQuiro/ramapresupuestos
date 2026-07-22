import nodemailer from "nodemailer";
import { createBaseEmail, type EmailData } from "./templates/email/BaseEmail";

// Configuración de SMTP (usando variables de entorno)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendClubEmail(to: string, data: EmailData) {
  const html = createBaseEmail(data);

  try {
    const info = await transporter.sendMail({
      from: `"${data.clubName}" <${process.env.SMTP_USER}>`,
      to,
      subject: data.title,
      html,
    });
    console.log("Email enviado: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error enviando email:", error);
    return { success: false, error };
  }
}
