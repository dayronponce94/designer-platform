// backend/src/utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4,
  });

  const mailOptions = {
    from: `"Llerandi Design" <${process.env.EMAIL_USER}>`, // Nombre actualizado
    to: options.email,
    subject: options.subject || 'Recuperación de Contraseña - Llerandi Design',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Llerandi Design</h2>
        <hr />
        <p>Hola,</p>
        <p>El equipo de <strong>Llerandi Design</strong> se pone en contacto con usted para asistirle en el cambio de su contraseña.</p>
        <p>Para restablecer su acceso, por favor haga clic en el siguiente enlace (válido por 10 minutos):</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${options.resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
        </div>
        <p>Si usted no solicitó este cambio, puede ignorar este correo de forma segura.</p>
        <br />
        <p>Atentamente,<br />El equipo de Soporte de Llerandi Design</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

const sendContactEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4,
  });

  const mailOptions = {
    from: `" Solicitud de Cotización" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Te llega a ti mismo
    subject: options.subject,
    html: options.html, // Aquí usamos el HTML que generaremos en el controlador de contacto
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail, sendContactEmail };