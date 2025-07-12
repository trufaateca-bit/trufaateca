// lib/sendEmail.js
import nodemailer from 'nodemailer';

export async function sendEmailGmail({ to, name }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,     // tu email: trufaateca@gmail.com
      pass: process.env.GMAIL_PASS,     // contraseña de aplicación
    },
  });

  const mailOptions = {
    from: `"Trufateca" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Gracias por tu pedido 🍄',
    html: `
      <div style="font-family:sans-serif; padding: 20px; background-color:#fafafa; border-radius: 8px; color:#333;">
        <h2>¡Hola ${name || 'cliente'}!</h2>
        <p>Gracias por tu compra. Hemos recibido tu pedido.</p>
        <p>Lo prepararemos y enviaremos lo antes posible. Te mantendremos informado.</p>
        <br/>
        <p>📦 Si tienes dudas, escríbenos a <a href="mailto:trufaateca@gmail.com">trufaateca@gmail.com</a></p>
        <br/>
        <p>Atentamente,</p>
        <p><strong>El equipo de Trufateca</strong></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado con Gmail:', info.response);
    return { success: true };
  } catch (error) {
    console.error('❌ Error enviando email con Gmail:', error);
    return { success: false, error };
  }
}
