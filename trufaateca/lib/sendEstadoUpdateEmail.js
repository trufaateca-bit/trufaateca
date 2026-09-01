import nodemailer from 'nodemailer';

export async function sendEstadoUpdateEmail({ to, name, estado, seguimiento }) {
  const estados = ['Recibido', 'Preparando', 'Enviado', 'Entregado'];

  // Normalizar
  const estadoNormalizado =
    estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();

  const progresoHTML = estados.map(etapa => {
    const activo = estados.indexOf(etapa) <= estados.indexOf(estadoNormalizado);
    return `
      <span style="
        padding:6px 12px;
        border-radius:20px;
        margin-right:8px;
        background:${activo ? '#5a7c52' : '#e0e0e0'};
        color:${activo ? 'white' : '#666'};
        font-size:14px;
      ">
        ${etapa}
      </span>
    `;
  }).join('');

  let mensaje = "";
  if (estadoNormalizado === "Recibido") mensaje = "Hemos recibido tu pedido 🍄";
  if (estadoNormalizado === "Preparando") mensaje = "Estamos preparando tu pedido 👨‍🍳";
  if (estadoNormalizado === "Enviado") mensaje = "Tu pedido ha sido enviado 🚚";
  if (estadoNormalizado === "Entregado") mensaje = "Tu pedido ha sido entregado 🎉";

  const html = `
    <div style="font-family:Arial; background:#f8f3ec; padding:30px; border-radius:16px;">
      <h2>Hola ${name || 'cliente'} 👋</h2>
      <p>${mensaje}</p>

      <div style="margin:20px 0">
        ${progresoHTML}
      </div>

      ${seguimiento ? `<p><strong>Tracking:</strong> ${seguimiento}</p>` : ""}

      <a href="https://trufateca.com/estado_pedido?order=${seguimiento || ''}"
         style="display:inline-block;margin-top:20px;padding:12px 20px;
         background:#5a7c52;color:white;border-radius:30px;text-decoration:none;">
        Ver estado de mi pedido
      </a>

      <p style="margin-top:30px;font-size:14px;color:#666">
        Trufateca 🍄
      </p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Trufateca" <${process.env.GMAIL_USER}>`,
    to,
    subject: `📦 Estado de tu pedido: ${estadoNormalizado}`,
    html,
  });
}
