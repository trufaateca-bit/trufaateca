import React, { useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { useStateContext } from '@/context/StateContext';
import { runFireworks } from '@/lib/utils';
import Stripe from 'stripe';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { sendEmailGmail } from '@/lib/sendEmail'; // Gmail version

// ✅ FUNCIÓN PARA Pushover (fuera del componente)
async function sendPushoverNotification({ title, message }) {
  try {
    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        token: process.env.PUSHOVER_APP_TOKEN,
        user: process.env.PUSHOVER_USER_KEY,
        title,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error al enviar notificación Pushover:", data.errors || data);
    } else {
      console.log("✅ Notificación enviada a Pushover con éxito:", data);
    }
  } catch (error) {
    console.error("❌ Error inesperado al enviar notificación Pushover:", error);
  }
}

const Gracias = ({ orderDetails }) => {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

  useEffect(() => {
    localStorage.clear();
    setCartItems?.([]);
    setTotalPrice?.(0);
    setTotalQuantities?.(0);
  }, []);

  return (
    <div className="gracias-wrapper">
      <div className="gracias-container">
        <div className="gracias-logo">
          <Image
            src="https://cdn.sanity.io/images/xhpb5q5u/production/70f3be134e08c35ab73fcc5d7ba2faf51bb3c9c8-277x247.png"
            alt="Trufateca Logo"
            width={150}
            height={150}
          />
        </div>

        <div className="gracias-content">
          <p className="icon">
            <BsBagCheckFill />
          </p>
          <h2>¡Gracias Por Tu Pedido!</h2>
          <p className="gracias-text">
            Revisaremos tu pedido y te lo enviaremos lo antes posible.
          </p>

          {orderDetails?.name && (
            <p className="gracias-text">
              A nombre de: <strong>{orderDetails.name}</strong>
            </p>
          )}

          {orderDetails?.email && (
            <p className="gracias-text">
              Confirmación enviada a: <strong>{orderDetails.email}</strong>
            </p>
          )}

          {orderDetails?.address && (
            <p className="gracias-text">
              Dirección: <br />
              <strong>
                {orderDetails.address.line1}, {orderDetails.address.postal_code}, {orderDetails.address.city},{' '}
                {orderDetails.address.state}, {orderDetails.address.country}
              </strong>
            </p>
          )}

          <p className="gracias-contacto">
            ¿Tienes dudas? Contáctanos:
            <a className="email" href="mailto:trufaateca@gmail.com"> trufaateca@gmail.com</a>
          </p>

          <Link href="/">
            <button type="button" className="btn-gracias">SEGUIR COMPRANDO</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_KEY);
  const { session_id } = context.query;

  if (!session_id) {
    return { props: { orderDetails: {} } };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer_details'],
    });

    const lineItems = await stripe.checkout.sessions.listLineItems(session_id, {
      limit: 100,
    });

    const metadata = session.metadata?.cart ? JSON.parse(session.metadata.cart) : [];
    const productos = lineItems.data.map((item, index) => ({
      name: item.description,
      quantity: item.quantity,
      price: parseFloat(metadata[index]?.price) || null,
      grams: metadata[index]?.grams || null,
    }));

    const productos_legibles = productos.map(p =>
      `${p.name} - ${p.grams}g x${p.quantity}`
    ).join('\n');

    const orderDetails = {
      name: session?.customer_details?.name || null,
      email: session?.customer_details?.email || null,
      address: session.customer_details?.address || null,
    };

    const fullAddress = [orderDetails.address.line1, orderDetails.address.line2]
      .filter(Boolean)
      .join(', ');

    const { error } = await supabase.from('compras').insert([{
      email: orderDetails.email || null,
      nombre: orderDetails.name || null,
      direccion_envio: fullAddress || null,
      ciudad: orderDetails.address.city || null,
      provincia: orderDetails.address.state || null,
      codigo_postal: orderDetails.address.postal_code || null,
      precio_total: session.amount_total ? session.amount_total / 100 : null,
      stripe_session: session.id,
      fecha: new Date().toISOString(),
      productos_facil: productos_legibles,
      productos,
      estado: "Recibido",
      seguimiento: "Sustituir por tracking"
    }]);

    if (error) {
      console.error("❌ Error al insertar en Supabase:", error.message);
    } else {
      console.log("✅ Pedido guardado en Supabase");
    }


    // 📧 Envío de correo con Gmail
    const email = orderDetails.email;
    const name = orderDetails.name;
    const { success, error: emailError } = await sendEmailGmail({ to: email, name });

    if (!success) console.error("❌ Error al enviar email con Gmail:", emailError?.message);
    else console.log("✅ Email enviado correctamente");
    await sendPushoverNotification({
      title: "📦 Nuevo pedido recibido",
      message: `Cliente: ${orderDetails.name}\nProductos: ${productos_legibles}`,
    });

    return {
      props: {
        orderDetails,
      },
    };
  } catch (error) {
    console.error('Error recuperando la sesión de Stripe:', error.message);
    return {
      props: {
        orderDetails: {},
      },
    };
  }
};

export default Gracias;
