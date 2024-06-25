"use client";

import { calTotalPrice } from "@/utilities/calTotalPrice";
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
    updateCartFromDB: (state, action) => {
      const data = action.payload;
      state.cartItem = data.cartItem;
    },
    inputQtyBar: (state, action) => {
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
    // Old addItem not use DB
    // addItem: (state, action) => {
    //   // state.value += action.payload;
    //   const {
    //     product_id,
    //     thumbnail,
    //     title,
    //     price,
    //     discountPercentage,
    //     quantity,
    //   } = action.payload;

    //   const hasItem = state.cartItem.find(
    //     (item) => item.product_id === product_id
    //   );
    //   if (hasItem === undefined) {
    //     state.cartItem.push({
    //       product_id: product_id,
    //       thumbnail: thumbnail,
    //       title: title,
    //       price: price,
    //       discountPercentage: calTotalPrice(price, discountPercentage),
    //       quantity: quantity,
    //     });
    //   } else {
    //     state.cartItem.map((item) => {
    //       if (item.product_id === product_id) {
    //         const total_qty = (item.quantity += quantity);
    //         item.quantity = total_qty;
    //       }
    //     });
    //   }
    // },
  },
  extraReducers: (builder) => {},
});

export const {
  updateCartFromDB,
  inputQtyBar,
  remove,
  // addItem,
} = cartSlice.actions;

export default cartSlice.reducer;
