import nodemailer from 'nodemailer';

export async function sendEstadoUpdateEmail({ to, name, estado, seguimiento }) {
  const estados = ['Recibido', 'Preparando', 'Enviado', 'Entregado'];
  const estadoActual = estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();

  // Generar barra visual de progreso
  const progresoHTML = estados.map(etapa => {
    const completado = estados.indexOf(etapa) <= estados.indexOf(estadoActual);
    return `<span style="
      display:inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      margin-right: 10px;
      background-color: ${completado ? '#4CAF50' : '#ddd'};
      color: ${completado ? 'white' : '#555'};">
      ${etapa}
    </span>`;
  }).join('');

  // Mensaje personalizado por estado
  let mensajeEstado = '';
  switch (estadoActual) {
    case 'Recibido':
      mensajeEstado = 'Hemos recibido tu pedido y pronto empezaremos a prepararlo.';
      break;
    case 'Preparando':
      mensajeEstado = 'Estamos preparando cuidadosamente tu pedido.';
      break;
    case 'Enviado':
      mensajeEstado = `¡Tu pedido ha sido enviado!${seguimiento ? `<br><br>🔍 Código de seguimiento: <strong>${seguimiento}</strong>` : ''}`;
      break;
    case 'Entregado':
      mensajeEstado = '¡Tu pedido ha sido entregado! Esperamos que lo disfrutes.';
      break;
    default:
      mensajeEstado = 'Tu pedido está en proceso.';
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family:sans-serif; padding: 20px;">
      <h2>¡Hola ${name || 'cliente'}!</h2>
      <p>${mensajeEstado}</p>
      <br/>
      <div style="margin-top: 10px;">
        ${progresoHTML}
      </div>
      <br/>
      <p>📦 Si tienes dudas, escríbenos a <a href="mailto:trufaateca@gmail.com">trufaateca@gmail.com</a></p>
      <br/>
      <p><strong>El equipo de Trufateca</strong></p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Trufateca" <${process.env.GMAIL_USER}>`,
      to,
      subject: `📦 Estado actualizado: ${estadoActual}`,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Error enviando email:", error.message);
    return { success: false, error };
  }
}
