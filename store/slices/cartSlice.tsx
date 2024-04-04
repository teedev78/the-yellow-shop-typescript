"use client";

import { calTotalPrice } from "@/utilities/calTotalPrice";
import { createSlice } from "@reduxjs/toolkit";

type CartItem = {
  product_id: number;
  thumbnail: string;
  title: string;
  price: number;
  discountPrice: number;
  quantity: number;
  stock: number;
};

type Cart = {
  cartItem: CartItem[];
  total_price: number;
  loading: false;
};

const initialValue: Cart = {
  cartItem: [],
  total_price: 0,
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialValue,
  reducers: {
    countTotalPrice: (state) => {
      let total_price = 0;
      state.cartItem.forEach((item) => {
        total_price += item.discountPrice * item.quantity;
      });
      state.total_price = Number(total_price.toFixed(2));
    },
    increment: (state, action) => {
      // state.value += action.payload;
      const {
        id,
        thumbnail,
        title,
        price,
        discountPercentage,
        quantity,
        stock,
      } = action.payload;

      const hasItem = state.cartItem.find((item) => item.product_id === id);
      if (hasItem === undefined) {
        state.cartItem.push({
          product_id: id,
          thumbnail: thumbnail,
          title: title,
          price: price,
          discountPrice: calTotalPrice(price, discountPercentage),
          quantity: quantity,
          stock: stock,
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
    },
    increaseByQty: (state, action) => {
      // console.log(action.payload);
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
  },
  extraReducers: (builder) => {},
});

export const { countTotalPrice, increment, increaseByQty, remove } =
  cartSlice.actions;

export default cartSlice.reducer;
