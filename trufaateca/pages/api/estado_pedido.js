// /pages/api/estado_pedido.js

import { sendEstadoUpdateEmail } from '@/lib/sendEstadoUpdateEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send({ error: 'Only POST allowed' });

  try {
    const { record } = req.body;

    if (!record) return res.status(400).json({ error: 'Missing record data' });

    const { email, nombre, estado,seguimiento } = record;

    if (!email || !estado) {
      return res.status(400).json({ error: 'Missing email or estado' });
    }

    if (estado) {
        console.log("📧 Enviando email de estado...");
        console.log("🧾 Datos recibidos del webhook:", { email, nombre, estado, seguimiento });
        await sendEstadoUpdateEmail({ to: email, name: nombre, estado, seguimiento });
        }


    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Error procesando el Webhook:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
