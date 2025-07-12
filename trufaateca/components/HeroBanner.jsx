import React from 'react';
import { urlFor } from '@/lib/sanity_client';

const HeroBanner = ({ heroBanner }) => {
  return (
    <div className="hero-banner-container">
      <img
        src={urlFor(heroBanner.image)}
        alt="Trufateca Logo"
        className="hero-banner-image"
      />

      <div className="hero-banner-text">
        <div className="intro-text">
          <h3>Descubre el Tesoro de Nuestras Trufas Frescas</h3>
          <p>{heroBanner.desc}</p>
        </div>
        <div className="trufas-tipos">
          <div className="tipo">
            <h4>🍂 Trufa Negra de Invierno</h4>
            <p>{heroBanner.Trufa}</p>
          </div>
          <div className="tipo">
            <h4>🌸 Trufa de Primavera</h4>
            <p>{heroBanner.Trufa2}</p>
          </div>
          <div className="tipo">
            <h4>🌞 Trufa de Verano</h4>
            <p>{heroBanner.Trufa3}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
