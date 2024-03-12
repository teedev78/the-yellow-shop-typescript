"use client";

import { createSlice } from "@reduxjs/toolkit";

type CartItem = {
  product_id: number;
  thumbnail: string;
  quantity: number;
};

type Cart = {
  cartItem: CartItem[];
  loading: false;
};

const initialValue: Cart = {
  cartItem: [],
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialValue,
  reducers: {
    increment: (state, action) => {
      // state.value += action.payload;
      // console.log(action.payload.id);
      const { id, thumbnail, quantity, stock } = action.payload;

      const hasItem = state.cartItem.find((item) => item.product_id === id);
      // console.log(hasItem);
      if (hasItem === undefined) {
        state.cartItem.push({
          product_id: id,
          thumbnail: thumbnail,
          quantity: quantity,
        });
      } else {
        state.cartItem.map((item) => {
          if (item.product_id === id) {
            const total_qty = (item.quantity += quantity);
            if (total_qty <= stock) {
              item.quantity = total_qty;
            } else {
              item.quantity = stock;
            }
          }
        });
      }
      // console.log(state.cartItem);
    },
  },
  extraReducers: (builder) => {},
});

export const { increment } = cartSlice.actions;

export default cartSlice.reducer;
