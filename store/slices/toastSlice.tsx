"use client";

import { createSlice } from "@reduxjs/toolkit";

type Toast = {
  toggleToast: boolean;
  message: string;
};

const initialValue: Toast = {
  toggleToast: false,
  message: "",
};

const toastSlice = createSlice({
  name: "toast",
  initialState: initialValue,
  reducers: {
    toggleToast: (state, action) => {
      // console.log(action.payload);
      state.message = action.payload.message;
      state.toggleToast = !state.toggleToast;
    },
  },
  extraReducers: (builder) => {},
});

export const { toggleToast } = toastSlice.actions;

export default toastSlice.reducer;
