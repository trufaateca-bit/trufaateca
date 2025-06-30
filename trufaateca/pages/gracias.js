import React, { useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { useStateContext } from '@/context/StateContext';
import { runFireworks } from '@/lib/utils';
import { client, urlFor } from '@/lib/sanity_client';

const Gracias = ({ heroBanner }) => {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

  useEffect(() => {
    localStorage.clear();
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    runFireworks();
  }, []);

  return (
    <div className="gracias-wrapper">
      <div className="gracias-container">

        <div className="gracias-logo">
          <Image src={logo} alt="Trufateca" width={120} height={120} />
        </div>

        <div className="gracias-content">
          <p className="icon">
            <BsBagCheckFill />
          </p>
          <h2>¡Gracias Por Tu Pedido!</h2>
          <p className="gracias-text">Revisaremos tu pedido y te lo enviaremos lo antes posible.</p>
          <p className="gracias-contacto">
            Si tienes alguna duda, contáctanos por email: 
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

export const getServerSideProps = async () => {
  const bannerQuery = '*[_type == "banner"][0]';
  const heroBanner = await client.fetch(bannerQuery);

  return {
    props: {
      heroBanner,
    },
  };
};

export default Gracias;
