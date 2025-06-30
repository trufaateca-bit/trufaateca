const stripe = require('stripe')(process.env.NEXT_SECRET_STRIPE_KEY);

export const config = {
  api: {
    bodyParser: true, // Asegura que el body esté parseado
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (!req.body || !req.body.cartItems || !Array.isArray(req.body.cartItems)) {
      return res.status(400).json({ error: 'Cart items missing or invalid.' })}
      console.log(req.body.cartItems)
    try {
      const params = {
        submit_type: 'pay',
        locale: 'es', // idioma español
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        shipping_address_collection: {
            allowed_countries: ['ES'], // solo direcciones en España
        },
        shipping_options: [
          { shipping_rate: 'shr_1Rfj4kGdfIEovBFtvXxjvawa' },
          { shipping_rate: 'shr_1Rfj55GdfIEovBFtEEiSm2f3' },
        ],
        line_items: req.body.cartItems.map((item) => {
          const img = item.image[0].asset._ref;
          const newImage = img
            .replace('image-', 'https://csn.sanity.io/images/xhpb5q5u/production/')
            .replace('-webp', '.webp');
        
        

          return {
            price_data: {
              currency: 'eur',
              product_data: {
                name: item.name,
                images: [newImage],
              },
              unit_amount: Math.round(item.price * (item.grams / 1000) * 100),
            },
            quantity: item.quantity,
          };
        }),
        mode: 'payment',
        success_url: `${req.headers.origin}/gracias`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      };

      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (error) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
