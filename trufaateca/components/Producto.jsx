import React from 'react';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity_client';

const Producto = ({ product: { image, name, slug, price, temporada, stock } }) => {
  const enTemporada = temporada === "si";
  const disponible = stock === "si";
  const puedeComprar = enTemporada && disponible;

  const Card = () => (
    <div className={`product-card ${!puedeComprar ? 'disabled' : ''}`}>
      
      {/* Imagen */}
      <div className="product-image-wrapper">
        <img
          src={urlFor(image && image[0])}
          alt={name}
          className="product-image"
        />

        {!enTemporada && (
          <span className="badge badge-temporada">
            Fuera de temporada
          </span>
        )}

        {!disponible && enTemporada && (
          <span className="badge badge-stock">
            Sin stock
          </span>
        )}
      </div>

      {/* Texto */}
      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <p className="product-price">
          {price} € <span className="price-unit">/ 100g</span>
        </p>
      </div>

    </div>
  );

  return puedeComprar ? (
    <Link href={`/product/${slug.current}`} className="product-link">
      <Card />
    </Link>
  ) : (
    <Card />
  );
};

export default Producto;
