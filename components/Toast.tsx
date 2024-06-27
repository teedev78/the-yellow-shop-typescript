import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/slices/toastSlice";
import { updateCartFromDB, subtotalCalc } from "@/store/slices/cartSlice";
import { useSession } from "next-auth/react";
import axios from "axios";

const Toast = () => {
  const toast = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();
  const { status, data: session } = useSession();

  //Remove Item in Cart DB
  const removeItem = () => {
    if (status === "authenticated" && session.user) {
      axios
        .delete("api/cart", {
          data: {
            userId: session.user.id,
            itemId: toast.item_id,
          },
        })
        .then((res) => {
          const updatedCart = res.data.data.cartItem;
          dispatch(
            updateCartFromDB({
              cartItem: updatedCart,
            })
          );
          dispatch(subtotalCalc({ updatedCart }));
        })
        .catch((error) => {
          console.log("Error : " + error);
        });
    }
    dispatch(showToast({ message: "close" }));
  };

  let display = "";

  if (toast.toggleToast) {
    display = "block z-10";
  } else {
    display = "hidden";
  }

  return (
    <div
      className={`${display} fixed m-auto sm:left-0 sm:right-0 sm:w-[500px] sm:h-[300px] sm:p-5  bg-white border-4 border-blue-400 
      flex flex-col justify-between items-center w-[240px] h-[200px] inset-0
      `}
    >
      <div className="flex justify-center items-center h-[150px]">
        {toast.message}
      </div>
      {toast.remove ? (
        <div className="flex flex-row justify-evenly items-evenly w-full">
          <div className="w-full mr-16">
            <button
              onClick={() => removeItem()}
              className="bg-red-400 border border-red-600 p-3 w-full"
            >
              Remove
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={() => dispatch(showToast({ message: "close" }))}
              className="bg-white border border-slate-600 p-3 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <button
            onClick={() => dispatch(showToast({ message: "close" }))}
            className="w-full bg-blue-400 p-2 rounded-sm bottom-0 text-white"
          >
            Okay
          </button>
        </div>
      )}
    </div>
  );
};

export default Toast;
