// /pages/api/webhook-estado.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { old, new: nueva } = req.body;

    // Solo continúa si el estado cambió
    if (!old || !nueva || old.estado === nueva.estado) {
      return res.status(200).json({ message: 'Estado no cambió, no se envía email' });
    }

    const response = await fetch(`http://localhost:3000/api/estado-pedido`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: nueva.email,
        nombre: nueva.nombre,
        nuevo_estado: nueva.estado,
      }),
    });

    const resultado = await response.json();
    console.log("✅ Email enviado:", resultado);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Error en webhook:", err.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
