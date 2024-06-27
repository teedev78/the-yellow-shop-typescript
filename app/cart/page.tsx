"use client";

import React, { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { showToast, showToastRemoveItem } from "@/store/slices/toastSlice";
import {
  updateCartFromDB,
  inputQtyBar,
  subtotalCalc,
} from "@/store/slices/cartSlice";
import Toast from "@/components/Toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaMinus, FaPlus, FaTrashCan } from "react-icons/fa6";
import { useRouter } from "next/navigation";

type Cart = {
  product_id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  quantity: number;
};

const Cart = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const toast = useSelector((state: RootState) => state.toast);

  const [loading, setLoading] = useState<boolean>(true);
  const [newQty, setNewQty] = useState<number>(0);
  const [productId, setProductId] = useState<number>(0);
  const [disableInput, setDisableInput] = useState<boolean>(false);

  // ดึงข้อมูลตะกร้าสินค้า
  const fetchCart = async () => {
    if (status === "authenticated" && session.user.id !== undefined) {
      const { id: userId } = await session.user;

      await axios
        .post(`/api/cart`, {
          userId,
        })
        .then((res) => {
          const updatedCart = res.data.userCart.cartItem;
          dispatch(updateCartFromDB({ cartItem: updatedCart }));
          dispatch(subtotalCalc({ updatedCart }));
        })
        .catch((error) => {
          console.log("Error : " + error);
        });
    }
  };

  // เช็คการล็อคอินและโหลดตะกร้าสินค้า
  useEffect(() => {
    if (status === "unauthenticated" || session === null) {
      router.push("/sign-in");
    } else {
      fetchCart();
      setLoading(false);
    }
  }, [session]);

  // เพิ่มจำนวนสินค้าจากปุ่มเพิ่มสินค้า
  const increaseItem = async (id: number) => {
    if (status === "authenticated" && session.user) {
      setDisableInput(true);
      await axios
        .put("/api/cart", {
          req_type: "increase",
          userId: session.user.id,
          item: {
            product_id: id,
          },
        })
        .then((res) => {
          const updatedCart = res.data.userCart.cartItem;
          dispatch(updateCartFromDB({ cartItem: updatedCart }));
          dispatch(subtotalCalc({ updatedCart }));
          setDisableInput(false);
        })
        .catch((error) => {
          console.log("Error : " + error);
        });
    }
  };

  // ลดจำนวนสินค้าจากปุ่มลดสินค้า
  const decreaseItem = async (id: number) => {
    if (status === "authenticated" && session.user) {
      setDisableInput(true);
      await axios
        .put("/api/cart", {
          req_type: "decrease",
          userId: session.user.id,
          item: {
            product_id: id,
          },
        })
        .then((res) => {
          const updatedCart = res.data.userCart.cartItem;
          dispatch(updateCartFromDB({ cartItem: updatedCart }));
          dispatch(subtotalCalc({ updatedCart }));
          setDisableInput(false);
        })
        .catch((error) => {
          console.log("Error : " + error);
        });
    }
  };

  // ลบสินค้าออกจากตะกร้า
  const removeItem = (id: number) => {
    dispatch(
      showToastRemoveItem({
        message: "Do you want to remove this item?",
        item_id: id,
      })
    );
  };

  // ตัวควบคุมช่องกรอกเลขจำนวนสินค้า
  const handlerQuantity = async (
    e: React.ChangeEvent<HTMLInputElement>,
    product_id: number
  ) => {
    let newQuantity = Number(e.target.value.replace(/\D/g, ""));
    if (newQuantity === 0) {
      newQuantity = 1;
    }

    dispatch(inputQtyBar({ id: product_id, quantity: newQuantity }));
    setProductId(product_id);
    setNewQty(newQuantity);
  };

  // เช็คจำนวนสินค้าจากฐานข้อมูลสินค้า
  const checkOverStock = async () => {
    await axios
      .get(`https://dummyjson.com/products/${productId}`)
      .then((res) => {
        const product = res.data;
        if (product.stock >= newQty) {
          //in stock
          editItemQty(newQty);
        } else {
          //over stock. set item qty = stock qty
          editItemQty(product.stock);
        }
      })
      .catch((error) => {
        console.log("Error : " + error);
      });
  };

  // เก็บค่าจำนวนสินค้าใหม่จากช่องกรอกเลข
  const editItemQty = async (newQuantity: number) => {
    if (status === "authenticated" && session.user) {
      setDisableInput(true);
      await axios
        .put("/api/cart", {
          req_type: "byQTY",
          userId: session.user.id,
          item: {
            product_id: productId,
            quantity: newQuantity,
          },
        })
        .then((res) => {
          const updatedCart = res.data.userCart.cartItem;
          dispatch(updateCartFromDB({ cartItem: updatedCart }));
          dispatch(subtotalCalc({ updatedCart }));
          setDisableInput(false);
        });
    }
  };

  // ตัวรอกรอกเลขให้เสร็จก่อนไปเช็คจำนวนสินค้า
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (newQty !== 0) {
        checkOverStock();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [newQty]);

  return (
    <main className="bg-gray-100 mt-[50px] sm:mt-0 sm:py-5">
      {toast && <Toast />}
      <section className="sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] m-auto bg-white p-5">
        <h1 className="text-center text-bold text-3xl mb-5">Cart</h1>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-6/12 text-left">Product</div>
          <div className="w-2/12 text-center">Price</div>
          <div className="w-2/12 text-center">Quantity</div>
          <div className="w-1/12 text-center">Subtotal</div>
          <div className="w-1/12 text-center">Remove</div>
        </div>
        {loading ? (
          <div>Loading Cart...</div>
        ) : (
          <ul className="">
            {cart.cartItem.map((item: Cart) => (
              <li
                key={item.product_id}
                className="flex flex-row justify-evenly items-center"
              >
                <div className="w-1/12">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width="0"
                    height="0"
                    sizes="100vw"
                    priority
                    className="w-[100px] h-[100px] object-contain"
                  />
                </div>
                <div className="w-5/12">{item.title}</div>
                <div className="w-1/12 line-through text-right mr-1">
                  ${item.price}
                </div>
                <div className="w-1/12 text-left ml-1">
                  $
                  {(
                    Math.round(
                      (item.price -
                        (item.price * item.discountPercentage) / 100) *
                        100
                    ) / 100
                  ).toFixed(2)}
                </div>
                <div className="w-2/12">
                  <div className="flex flex-row justify-center items-center">
                    <button
                      onClick={() => decreaseItem(item.product_id)}
                      disabled={disableInput || item.quantity === 1}
                      className="disabled:opacity-50 w-8 h-8 border-2 border-gray-500 p-1 flex justify-center items-center"
                    >
                      <FaMinus className="fill-gray-600" />
                    </button>
                    <span className="border-y-2 border-gray-500 w-12 h-8 flex justify-center items-center">
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handlerQuantity(e, item.product_id)}
                        disabled={disableInput}
                        className="w-full text-center"
                      />
                    </span>
                    <button
                      onClick={() => increaseItem(item.product_id)}
                      disabled={disableInput}
                      className="disabled:opacity-50 w-8 h-8 border-2 border-gray-500 p-1 flex justify-center items-center"
                    >
                      <FaPlus className="fill-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="w-1/12 text-center">
                  $
                  {((Math.round(
                    (item.price -
                      (item.price * item.discountPercentage) / 100) *
                      100
                  ) /
                    100) *
                    item.quantity).toFixed(2)}
                </div>
                <div className="w-1/12 flex justify-center items-center">
                  <FaTrashCan
                    onClick={() => removeItem(item.product_id)}
                    className="w-6 h-6 cursor-pointer"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* Show Subtotal and item */}
        <div className="text-right">
          {cart.item_qty > 1 ? (
            <div>
              {"Subtotal (" + cart.item_qty + " items) : "}
              <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
            </div>
          ) : (
            <div>
              {"Subtotal (" + cart.item_qty + " item) : "}
              <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Cart;
