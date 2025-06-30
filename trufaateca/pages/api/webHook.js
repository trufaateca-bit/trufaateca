import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_KEY);
export const config = {
  api: {
    bodyParser: false,
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err) {
      console.error('❌ Error verificando webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ CUANDO EL PAGO SE COMPLETA
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Aquí puedes hacer console.log de lo que quieras
      console.log('✅ PAGO COMPLETADO');
      console.log('Email:', session.customer_details.email);
      console.log('Dirección de envío:', session.shipping_details.address);
      console.log('Nombre:', session.customer_details.name);
      console.log('Carrito (en metadata):', session.metadata.cart);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
