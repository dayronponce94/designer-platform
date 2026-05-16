const { sendContactEmail } = require('../utils/email');

exports.sendContactForm = async (req, res) => {
    const { name, email, phone, company, service, message, budget, timeline } = req.body;

    try {
        const htmlContent = `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; background: #fdfdfd;">
  <h2 style="color: #4F46E5; text-align: center; margin-bottom: 10px;">Nuevo Mensaje</h2>
  <hr style="border: none; border-top: 2px solid #4F46E5; width: 60px; margin: 15px auto;" />
  
  <p style="color: #374151; font-size: 15px; margin-bottom: 8px;">
    <strong>De:</strong> ${name} <span style="color: #6b7280;">(${email})</span>
  </p>
  <p style="color: #374151; font-size: 15px; margin-bottom: 8px;">
    <strong>Teléfono:</strong> ${phone || 'No proporcionado'}
  </p>
  <p style="color: #374151; font-size: 15px; margin-bottom: 8px;">
    <strong>Empresa:</strong> ${company || 'No proporcionada'}
  </p>
  <p style="color: #374151; font-size: 15px; margin-bottom: 8px;">
    <strong>Servicio:</strong> ${service}
  </p>
  <p style="color: #374151; font-size: 15px; margin-bottom: 8px;">
    <strong>Presupuesto:</strong> ${budget || 'No definido'}
  </p>
  <p style="color: #374151; font-size: 15px; margin-bottom: 8px;">
    <strong>Timeline:</strong> ${timeline || 'No definido'}
  </p>

  <br />
  <p style="color: #111827; font-weight: bold; margin-bottom: 10px;">Mensaje:</p>
  <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; color: #374151; font-size: 14px; line-height: 1.5;">
    ${message}
  </div>

  <br />
  <p style="text-align: center; font-size: 13px; color: #6b7280; margin-top: 20px;">
    Este mensaje fue enviado desde el formulario de contacto de <strong>Llerandi Design</strong>.
  </p>
</div>

        `;

        await sendContactEmail({
            email: process.env.EMAIL_USER, // Te lo envías a ti mismo
            subject: `Nuevo Proyecto: ${service} - ${name}`,
            html: htmlContent
        });

        res.status(200).json({
            success: true,
            message: 'Correo enviado correctamente'
        });
    } catch (error) {
        console.error("Error enviando contacto:", error);
        res.status(500).json({
            success: false,
            message: 'No se pudo enviar el correo'
        });
    }
};