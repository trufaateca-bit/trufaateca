import Link from 'next/link'
import { urlFor } from '@/lib/sanity_client'

const HeroBanner = ({ heroBanner }) => {
  const heroImg = heroBanner?.heroPhoto ? urlFor(heroBanner.heroPhoto).url() : null

  return (
    <section className="hero-marketing">
      <div className="hero-media">
        {heroImg && (
          <img
            src={heroImg}
            alt="Cosecha de trufas"
            className="hero-media-img"
          />
        )}

        <div className="hero-copy">
          <h1>Trufa fresca directa del bosque</h1>
          <p>Recolectadas a mano y enviadas en 24h. La auténtica experiencia gourmet.</p>

          <Link href="#productos" legacyBehavior>
            <a>
              <button className="hero-cta-btn">Comprar ahora</button>
            </a>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
