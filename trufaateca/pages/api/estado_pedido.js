import { sendEstadoUpdateEmail } from '@/lib/sendEstadoUpdateEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send({ error: 'Only POST allowed' });

  try {
    // ✅ Soporta Supabase Database Webhooks (record) y otros (old/new)
    const record =
      req.body?.record ||
      req.body?.new ||
      req.body?.nuevo ||
      req.body?.data?.record ||
      null;

    const oldRecord =
      req.body?.old_record ||
      req.body?.old ||
      req.body?.data?.old_record ||
      null;

    if (!record) return res.status(400).json({ error: 'Missing record data' });

    const { email, nombre, estado, seguimiento, stripe_session } = record;

    if (!email || !estado) {
      return res.status(400).json({ error: 'Missing email or estado' });
    }

    // ✅ Si tenemos oldRecord, solo enviamos si cambia el estado
    if (oldRecord?.estado && oldRecord.estado === estado) {
      return res.status(200).json({ success: true, skipped: true });
    }

    console.log("📧 Enviando email de estado...");
    console.log("🧾 Datos recibidos del webhook:", { email, nombre, estado, seguimiento, stripe_session });

    await sendEstadoUpdateEmail({
      to: email,
      name: nombre,
      estado,
      seguimiento,
      stripe_session,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Error procesando el Webhook:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
