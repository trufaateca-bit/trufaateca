import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  const onAdd = (product, quantity, grams) => {
    const existingIndex = cartItems.findIndex(
      (item) => item._id === product._id && item.grams === grams
    );

    let updatedCart;
    if (existingIndex !== -1) {
      updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cartItems, { ...product, quantity, grams }];
    }

    setCartItems(updatedCart);
    const newTotal = calculateTotal(updatedCart);
    setTotalPrice(parseFloat(newTotal.toFixed(2)));

    const newQuantity = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantities(newQuantity);

    toast.success(`${quantity} x ${product.name} (${grams}g) añadido al carrito`);
  };

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => {
      return acc + item.price * (item.grams / 1000) * item.quantity;
    }, 0);
  };

  const toggleCartItemQuantity = (index, action) => {
    const updatedCart = [...cartItems];
    const item = updatedCart[index];

    if (action === 'inc') {
      item.quantity += 1;
    } else if (action === 'dec' && item.quantity > 1) {
      item.quantity -= 1;
    }

    setCartItems(updatedCart);
    setTotalQuantities(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
    setTotalPrice(parseFloat(calculateTotal(updatedCart).toFixed(2)));
  };

  const removeCartItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    setTotalQuantities(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
    setTotalPrice(parseFloat(calculateTotal(updatedCart).toFixed(2)));
  };

  const incQty = () => setQty((prev) => prev + 1);
  const decQty = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        removeCartItem,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
