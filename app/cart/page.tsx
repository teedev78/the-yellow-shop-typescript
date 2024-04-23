"use client";

import React, { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleToast } from "@/store/slices/toastSlice";
import Image from "next/image";
import {
  remove,
  countTotalPrice,
  increaseByQty,
} from "@/store/slices/cartSlice";
import Toast from "@/components/Toast";
import { FaMinus, FaPlus } from "react-icons/fa6";
import axios from "axios";
import { useSession } from "next-auth/react";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const toast = useSelector((state: RootState) => state.toast);
  const [quantity, setQuantity] = useState<number>(0);

  const { data: session } = useSession();


  // Get Cart
  


  const handlerQuantity = (
    e: React.ChangeEvent<HTMLInputElement>,
    stock: number,
    id: number
  ) => {
    let quantity = Number(e.target.value.replace(/\D/g, ""));
    if (quantity === 0) {
      quantity = 1;
      dispatch(increaseByQty({ id, quantity }));
    } else if (quantity > stock) {
      quantity = stock;
      dispatch(increaseByQty({ id, quantity }));
      dispatch(toggleToast({ message: `You can only add ${stock} items.` }));
    } else {
      dispatch(increaseByQty({ id, quantity }));
    }
  };

  const increaseItem = (id: number, stock: number, quantity: number) => {
    if (quantity > stock) {
      quantity = stock;
      dispatch(increaseByQty({ id, quantity }));
      dispatch(toggleToast({ message: `You can only add ${stock} items.` }));
    } else {
      dispatch(increaseByQty({ id, quantity }));
    }
  };

  const decreaseItem = (id: number, quantity: number) => {
    if (quantity <= 1) {
      quantity = 1;
      dispatch(increaseByQty({ id, quantity }));
    } else {
      dispatch(increaseByQty({ id, quantity }));
    }
  };

  const removeItem = (id: number) => {
    dispatch(remove({ id }));
    // console.log(cart.cartItem);
  };

  useEffect(() => {
    dispatch(countTotalPrice());
  }, []);

  useEffect(() => {
    // console.log(cart);
  }, [cart]);

  const handleSummit = () => {
    console.log("Test Complete");
    console.log(session);

    axios
      .post("/api/cart", {
        email: session?.user.email,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <main className="bg-gray-100 mt-[50px] sm:mt-0 sm:py-5">
      {toast && <Toast />}
      <section className="sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] m-auto bg-white p-5">
        {/* Test */}

        {/* <div className="bg-blue-500 p-2 w-fit">
          <button onClick={handleSummit}>Add</button>
        </div> */}

        {/* Test End */}
        <h1 className="text-center text-bold text-3xl">Cart</h1>
        <ul className="">
          {cart.cartItem.map((item) => (
            <li
              key={item.product_id}
              className="flex flex-row justify-evenly items-center"
            >
              <div className="border-2 border-blue-300 w-1/12">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="w-[100px] h-[100px] object-contain"
                />
              </div>
              <div className="border-2 border-blue-300 w-5/12">
                {item.title}
              </div>
              <div className="border-2 border-blue-300 w-1/12 line-through">
                ${item.price}
              </div>
              <div className="border-2 border-blue-300 w-1/12">
                ${item.discountPrice}
              </div>
              <div className="border-2 border-blue-300 w-2/12">
                <div className="flex flex-row justify-center items-center">
                  <FaMinus
                    onClick={() =>
                      decreaseItem(item.product_id, item.quantity - 1)
                    }
                    className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1"
                  />
                  <span className="border-y-2 border-gray-500 w-12 h-8 flex justify-center items-center">
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) =>
                        handlerQuantity(e, item.stock, item.product_id)
                      }
                      className="w-full text-center"
                    />
                  </span>
                  <FaPlus
                    onClick={() =>
                      increaseItem(
                        item.product_id,
                        item.stock,
                        item.quantity + 1
                      )
                    }
                    className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1"
                  />
                </div>
              </div>
              <div className="border-2 border-blue-300 w-1/12">
                ${(item.discountPrice * item.quantity).toFixed(2)}
              </div>
              <div
                className="border-2 border-blue-300 w-1/12"
                onClick={() => removeItem(item.product_id)}
              >
                Remove
              </div>
            </li>
          ))}
        </ul>
        <div>Total Price : ${cart.total_price}</div>
      </section>
    </main>
  );
};

export default Cart;
