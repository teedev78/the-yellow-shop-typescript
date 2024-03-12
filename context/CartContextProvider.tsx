"use client";
import { ReactNode, createContext, useContext, useState } from "react";

type CartProviderProps = {
  children: ReactNode;
};

type CartItems = {
  id: number;
  thumbnail: string;
  quantity: number;
};

type CartContext = {
  cartItems: CartItems[];
  addToCart: (id: number, thumbnail: string, quantity: number) => void;
};

const CartContext = createContext({} as CartContext);

export function useCart() {
  return useContext(CartContext);
}

const CartContextProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItems[]>([{id:0, thumbnail: "", quantity: 0}]);

  const addToCart = (id: number, thumbnail: string, quantity: number) => {
    const newItem = { id: id, thumbnail: thumbnail, quantity: quantity };
    // console.log(newItem);

    
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
