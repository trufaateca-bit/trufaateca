import React from 'react';
import { urlFor } from '@/lib/sanity_client';

const HeroBanner = ({ heroBanner }) => {
  return (
    <div className="hero-banner-container">
      <img
        src={urlFor(heroBanner.image)}
        alt="trufas"
        className="hero-banner-image"
      />
      <div className="desc">
        <h5>Descripción</h5>
        <p>{heroBanner.desc}</p>
      </div>
    </div>
  );
};

export default HeroBanner;
