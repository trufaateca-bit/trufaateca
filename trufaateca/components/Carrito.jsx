import React, { createRef, useRef } from 'react'
import Link from 'next/link'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft,AiOutlineShopping } from 'react-icons/ai'
import {TiDeleteOutline} from 'react-icons/ti'
import { useStateContext } from '@/context/StateContext'
import toast from 'react-hot-toast'
import { urlFor } from '@/lib/sanity_client' 
const Carrito = () => {
  const cartRef = useRef()
  const {totalPrice,totalQuantities,cartItems,setShowCart} = useStateContext()

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button
        type='button'
        className='cart-heading'
        onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft/>
          <span className='heading'>Tu Carrito</span>
          <span className='cart-num-items'>({totalQuantities} cartItems)</span>
        </button>
        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150}/>
            <h3>Tu carrito esta vacio</h3>
            <Link href="/">
              <div className="buttons">
                  <button
                    type='button'
                    onClick={() => setShowCart(false)}
                    className='buy-now'
                  >
                    Continua Comprando
                  </button>
              </div>
            </Link>
          </div>
        )}
        <div className='product-container'>
          {cartItems.length >=1 && cartItems.map((item,index) => (
            <div className='product' key={item._id}>
              <img src={urlFor(item?.image[0])}
              className='cart-product-image'
              />
              <div className='item-desc'>
                <div className='flex top'>
                  <h3>{item.name}</h3>
                  <h3>{totalPrice} euros</h3>
                </div>
                <div className='flex bottom'>
                  <div>
                    <p>Gramos</p>
                    <p className="quantity-desc">
                          <span className="minus" onClick=""><AiOutlineMinus /></span>
                          <span className="num">500</span>
                          <span className="plus" onClick=""><AiOutlinePlus /></span>
                     </p>
                     <p>Cantidad</p>
                     <p className="quantity-desc">
                          <span className="minus" onClick=""><AiOutlineMinus /></span>
                          <span className="num">0</span>
                          <span className="plus" onClick=""><AiOutlinePlus /></span>
                      </p>
                  </div>
                  <button type='button' 
                  className='remove-item'
                  onClick=""
                  >
                    <TiDeleteOutline/>
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
        {cartItems.length >= 1 && (
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal:</h3>
              <h3>{totalPrice}euros</h3>
            </div>
            <div className='btn-container'>
              <button
                type='button'
                className='btn'
                onClick=""
              >
                Comprar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Carrito