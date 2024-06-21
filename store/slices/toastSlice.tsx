"use client";

import { createSlice } from "@reduxjs/toolkit";

type Toast = {
  toggleToast: boolean;
  message: string;
  remove: boolean;
  item_id: number;
};

const initialValue: Toast = {
  toggleToast: false,
  message: "",
  remove: false,
  item_id: 0,
};

const toastSlice = createSlice({
  name: "toast",
  initialState: initialValue,
  reducers: {
    showToast: (state, action) => {
      // console.log(action.payload);
      state.message = action.payload.message;
      state.toggleToast = !state.toggleToast;
      state.remove = false;
    },
    showToastRemoveItem: (state, action) => {
      state.message = action.payload.message;
      state.toggleToast = !state.toggleToast;
      state.remove = true;
      state.item_id = action.payload.item_id;
    },
  },
  extraReducers: (builder) => {},
});

export const { showToast, showToastRemoveItem } = toastSlice.actions;

export default toastSlice.reducer;
