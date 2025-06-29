import React from 'react'
import Link from 'next/link'
import {AiOutlineShopping} from 'react-icons/ai'
import {Carrito} from './' 
import { useStateContext } from '@/context/StateContext'

const NavegacionBar = () => {
  const {showCart,setShowCart,totalQuantities} = useStateContext()



  return (
    <div className='navbar-container'>
      <p className='logo'>
        <Link href="">
          Trufaateca
        </Link>
      </p>
      <button type='button' className='cart-icon' onClick={() =>setShowCart(true) }>  
        <AiOutlineShopping/>
        <span className='cart-item-qty'>{totalQuantities}</span>
      </button>
      {showCart && <Carrito />}
    </div>
  )
}

export default NavegacionBar