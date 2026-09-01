import { sendEstadoUpdateEmail } from '@/lib/sendEstadoUpdateEmail';

export const config = {
  api: {
    bodyParser: false,   // 🔥 MUY IMPORTANTE
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    // Leer raw body
    let rawBody = '';
    await new Promise((resolve) => {
      req.on('data', chunk => {
        rawBody += chunk;
      });
      req.on('end', resolve);
    });

    console.log("📩 RAW BODY:", rawBody);

    const data = JSON.parse(rawBody);

    const record = data.record;

    if (!record) {
      console.error("❌ No hay record");
      return res.status(400).json({ error: 'No record in webhook' });
    }

    const { email, nombre, estado, seguimiento } = record;

    console.log("📦 Datos del pedido:", { email, nombre, estado, seguimiento });

    if (!email || !estado) {
      return res.status(400).json({ error: 'Missing email or estado' });
    }

    await sendEstadoUpdateEmail({
      to: email,
      name: nombre,
      estado,
      seguimiento,
    });

    console.log("✅ Email de estado enviado");

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Error procesando webhook:', err);
    return res.status(500).json({ error: err.message });
  }
}
