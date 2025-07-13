import React from 'react';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity_client';

const Producto = ({ product: { image, name, slug, price, temporada, stock } }) => {
  const enTemporada = temporada === "si";
  const disponible = stock === "si";
  const puedeComprar = enTemporada && disponible;

  const contenidoProducto = (
    <div className={`product-card ${!puedeComprar ? 'disabled' : ''}`}>
      <img
        src={urlFor(image && image[0])}
        width={250}
        height={250}
        className='product-image'
        style={!puedeComprar ? { filter: 'grayscale(100%)', opacity: 0.5 } : {}}
      />
      <p className='product-name'>{name}</p>
      <p className='product-price'>{price} euros</p>
      {!puedeComprar && (
        <p className="product-nota">
          {!enTemporada ? 'Fuera de temporada' : 'Sin stock'}
        </p>
      )}
    </div>
  );

  return (
    <div>
      {puedeComprar ? (
        <Link href={`/product/${slug.current}`}>
          {contenidoProducto}
        </Link>
      ) : (
        contenidoProducto
      )}
    </div>
  );
};

export default Producto;
