"use client";

import React, { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { remove, countTotalPrice } from "@/store/slices/cartSlice";
import { FaMinus, FaPlus } from "react-icons/fa6";
import QuantityBar from "@/components/QuantityBar";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState<number>(1);

  const removeItem = (id: number) => {
    dispatch(remove({ id }));
    // console.log(cart.cartItem);
  };

  const handlerQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handlerChangeQuantity = (qty: string) => {};

  useEffect(() => {
    dispatch(countTotalPrice());
  }, []);

  return (
    <main className="bg-gray-100 mt-[50px] sm:mt-0 sm:py-5">
      <section className="sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] m-auto bg-white p-5">
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
                <QuantityBar />
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
