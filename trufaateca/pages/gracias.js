import React, { useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { useStateContext } from '@/context/StateContext';
import { runFireworks } from '@/lib/utils';
import Stripe from 'stripe';
import Image from 'next/image';

const Gracias = ({ orderDetails }) => {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

  useEffect(() => {
    localStorage.clear();
    setCartItems?.([]);
    setTotalPrice?.(0);
    setTotalQuantities?.(0);
    runFireworks();
  }, []);

  return (
    <div className="gracias-wrapper">
      <div className="gracias-container">

        {/* Logo arriba */}
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
                {orderDetails.address.line1}, {orderDetails.address.postal_code}, {orderDetails.address.city},{orderDetails.address.state}, {orderDetails.address.country}
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

// ✅ Recuperar detalles de Stripe
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

    console.log('Dirección completa Stripe:', session.customer_details);

    const orderDetails = {
      name: session.customer_details?.name || null,
      email: session.customer_details?.email || null,
      address: session.customer_details?.address || null,
    };

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
