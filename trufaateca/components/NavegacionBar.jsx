import React from 'react'
import Link from 'next/link'
import { AiOutlineShopping } from 'react-icons/ai'
import { Carrito } from './'
import { useStateContext } from '@/context/StateContext'
import { urlFor } from '@/lib/sanity_client'

const NavegacionBar = ({ heroBanner }) => {
  const { showCart, setShowCart, totalQuantities } = useStateContext()

  // ✅ Si viene de Sanity, lo usamos. Si no, usamos un logo local (no falla nunca).
  const logoSrc = heroBanner?.image ? urlFor(heroBanner.image).url() : '/logo.png'

  return (
    <div className="navbar-container">
      <div className="logo">
        <Link href="/" legacyBehavior>
          <a className="nav-logo-link">
            <img src={logoSrc} alt="Trufateca" className="nav-logo-img" />
          </a>
        </Link>
      </div>

      <button
        type="button"
        className="cart-icon"
        onClick={() => setShowCart(true)}
        aria-label="Abrir carrito"
      >
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>

      {showCart && <Carrito />}
    </div>
  )
}

export default NavegacionBar
