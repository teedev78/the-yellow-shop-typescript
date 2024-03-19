import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleToast } from "@/store/slices/toastSlice";

const Toast = () => {
  const toast = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();
  let display = "";

  if (toast.toggleToast) {
    display = "block z-10";
  } else {
    display = "hidden";
  }

  return (
    <div
      className={`${display} absolute m-auto left-0 right-0 w-[500px] h-[300px] bg-white border-2 border-orange-300 p-5 flex flex-col justify-between items-center`}
    >
      <p className="h-5/6 flex items-center">{toast.message}</p>
      <button
        onClick={() => dispatch(toggleToast({message: "close"}))}
        className="w-full h-1/6 bg-blue-400 p-2 rounded-sm bottom-0 text-white"
      >
        Okay
      </button>
    </div>
  );
};

export default Toast;
