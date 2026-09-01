import { sendEstadoUpdateEmail } from '@/lib/sendEstadoUpdateEmail';

export default async function handler(req, res) {
  try {
    const payload = req.body;

    // Supabase manda esto
    const record = payload.record;
    const old = payload.old_record;

    if (!record) {
      return res.status(400).json({ error: "No record" });
    }

    const { email, nombre, estado, seguimiento } = record;

    // Solo enviar si el estado ha cambiado
    if (!old || old.estado === estado) {
      console.log("ℹ️ Estado no cambió, no se envía email");
      return res.json({ ok: true });
    }

    console.log("📦 Estado cambiado:", old.estado, "→", estado);

    await sendEstadoUpdateEmail({
      to: email,
      name: nombre,
      estado,
      seguimiento
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({ error: err.message });
  }
}
