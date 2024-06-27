"use client";

import { createSlice } from "@reduxjs/toolkit";

type CartItem = {
  product_id: number;
  thumbnail: string;
  title: string;
  price: number;
  discountPercentage: number;
  quantity: number;
};

type Cart = {
  cartItem: CartItem[];
  subtotal: number;
  item_qty: number;
};

const initialValue: Cart = {
  cartItem: [],
  subtotal: 0,
  item_qty: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialValue,
  reducers: {
    updateCartFromDB: (state, action) => {
      const data = action.payload;
      state.cartItem = data.cartItem;
    },
    inputQtyBar: (state, action) => {
      const { id, quantity } = action.payload;

      state.cartItem.map((item) => {
        if (item.product_id === id) {
          item.quantity = quantity;
        }
      });
    },
    remove: (state, action) => {
      const { id } = action.payload;

      const removeById = (item: CartItem) => {
        if (item.product_id !== id) {
          return true;
        }
        return false;
      };

      const newArray = state.cartItem.filter(removeById);
      state.cartItem = newArray;
    },
    subtotalCalc: (state, action) => {
      const { updatedCart: cartItem } = action.payload;
      let subtotal = 0;
      let item_qty = 0;

      for (let i = 0; i < cartItem.length; i++) {
        let discount_price =
          cartItem[i].price -
          (cartItem[i].price * cartItem[i].discountPercentage) / 100;

        let discount_price_round = Math.round(discount_price * 100) / 100;

        subtotal += discount_price_round * cartItem[i].quantity;
        item_qty += cartItem[i].quantity;
      }

      state.subtotal = subtotal;
      state.item_qty = item_qty;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  updateCartFromDB,
  inputQtyBar,
  remove,
  subtotalCalc,
} = cartSlice.actions;

export default cartSlice.reducer;
