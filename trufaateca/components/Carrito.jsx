import React, { useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useStateContext } from '@/context/StateContext';
import { urlFor } from '@/lib/sanity_client';
import getStripe from '@/lib/getStripe';
import toast from 'react-hot-toast';

const Carrito = () => {
  const cartRef = useRef();
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuantity,
    removeCartItem,
  } = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems }), // ✅ esto debe ser un objeto con "cartItems"
    });

    if (response.statusCode === 500) return;
    const data = await response.json()

    toast.loading('Redirigiendo....')

    stripe.redirectToCheckout({sessionId : data.id})
  }

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button className="cart-heading" onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className="heading">Tu Carrito</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 ? (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Tu carrito está vacío</h3>
            <Link href="/">
              <div className="buttons">
                <button onClick={() => setShowCart(false)} className="buy-now">
                  Continúa Comprando
                </button>
              </div>
            </Link>
          </div>
        ) : (
          <>
            <div className="product-container">
              {cartItems.map((item, index) => (
                <div className="product" key={`${item._id}-${item.grams}-${index}`}>
                  <img
                    src={urlFor(item?.image[0])}
                    className="cart-product-image"
                    alt={item.name}
                  />
                  <div className="item-desc">
                    <div className="flex top">
                      <h3>{item.name}</h3>
                      <h4>{(item.price * (item.grams / 1000) * item.quantity).toFixed(2)} €</h4>
                    </div>
                    <div className="flex bottom">
                      <div>
                        <p><strong>Gramos:</strong> {item.grams}g</p>
                        <p><strong>Cantidad:</strong>{item.quantity}</p>
                        <p className="quantity-desc">
                          <span
                            className="minus"
                            onClick={() => toggleCartItemQuantity(index, 'dec')}
                          >
                            <AiOutlineMinus />
                          </span>
                          <span className="num">{item.quantity}</span>
                          <span
                            className="plus"
                            onClick={() => toggleCartItemQuantity(index, 'inc')}
                          >
                            <AiOutlinePlus />
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        className="remove-item"
                        onClick={() => removeCartItem(index)}
                      >
                        <TiDeleteOutline />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-bottom">
              <div className="total">
                <h3>Subtotal:</h3>
                <h3>{totalPrice.toFixed(2)} €</h3>
              </div>
              <div className="btn-container">
                <button type="button" className="btn" onClick={handleCheckout}>
                  Comprar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Carrito;
