"use client";

import React, { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleToast, ToastRemoveItem } from "@/store/slices/toastSlice";
import { updateCartFromDB, increaseByQty } from "@/store/slices/cartSlice";
import Toast from "@/components/Toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/utilities/debounce";
import Image from "next/image";
import { FaMinus, FaPlus, FaTrashCan } from "react-icons/fa6";

type Cart = {
  product_id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  quantity: number;
};

const Cart = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  // const router = useRouter();

  const cart = useSelector((state: RootState) => state.cart);
  const toast = useSelector((state: RootState) => state.toast);
  // const [loading, setLoading] = useState<boolean>(true);
  const [newQty, setNewQty] = useState<number>(0);
  const [productId, setProductId] = useState<number>(0);
  const [overStock, setOverStock] = useState<any>({});
  // // const debouncedQty = useDebounce(qty);

  // // ดึงข้อมูลตะกร้าสินค้า
  const fetchCart = async () => {
    if (status === "authenticated" && session.user) {
      const { id: userId } = session.user;

      await axios
        .post(`/api/user/${userId}/cart`, {
          userId,
        })
        .then((res) => {
          // console.log(res.data.userCart.cartItem);
          const updatedCart = res.data.userCart.cartItem;
          dispatch(updateCartFromDB({ cartItem: updatedCart }));
        });
    } else {
      console.log("not authenticate.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // เซ็ตจำนวนสินค้าจากช่องกรอกจำนวนสินค้า
  const handlerQuantity = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    let quantity = Number(e.target.value.replace(/\D/g, ""));
    if (quantity === 0) {
      quantity = 1;
    }
    dispatch(
      increaseByQty({
        id: id,
        quantity: quantity,
      })
    );
    setNewQty(quantity);
    setProductId(id);
  };

  // เพิ่มจำนวนสินค้าจากปุ่มเพิ่มสินค้า
  const increaseItem = (id: number, quantity: number) => {
    dispatch(increaseByQty({ id: id, quantity: quantity + 1 }));
    setNewQty(quantity + 1);
    setProductId(id);
  };

  // ลดจำนวนสินค้าจากปุ่มลดสินค้า
  const decreaseItem = (id: number, quantity: number) => {
    if (quantity <= 1) {
      quantity = 1;
      dispatch(increaseByQty({ id, quantity }));
    } else {
      dispatch(increaseByQty({ id, quantity: quantity - 1 }));
    }
    setNewQty(quantity - 1);
    setProductId(id);
  };

  // ลบสินค้าออกจากตะกร้า
  const removeItem = (id: number) => {
    dispatch(
      ToastRemoveItem({
        message: "Do you want to remove this item?",
        item_id: id,
      })
    );
  };

  // เช็คจำนวนสินค้าจากฐานข้อมูลสินค้า
  const checkOverStock = async (product_id: number, newQuantity: number) => {
    let stock = { valid: false, quantity: 0 };

    try {
      const res = await axios.get(
        `https://dummyjson.com/products/${product_id}`
      );
      const product = res.data;
      if (product.stock >= newQuantity && newQuantity > 0) {
        return (stock = { valid: true, quantity: newQuantity });
      } else {
        return (stock = { valid: false, quantity: product.stock });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // เช็คจำนวนสินค้าในสต็อกและขึ้นแจ้งเตือนเมื่อสินค้าเกินกว่าในสต็อก
  useEffect(() => {
    const timer = setTimeout(async () => {
      // console.log("value changed..");
      // console.log(productId, newQty);
      if (productId === 0) return;

      const stock = await checkOverStock(productId, newQty);

      if (stock !== undefined && !stock.valid) {
        // console.log("over stock");
        dispatch(increaseByQty({ id: productId, quantity: stock.quantity }));
        dispatch(
          toggleToast({
            message: `You can only add ${stock.quantity} items.`,
          })
        );
        setNewQty(0);
        setProductId(0);
      } else {
        // console.log("added");
        setNewQty(0);
        setProductId(0);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [cart]);

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
                  item.price -
                  (item.price * item.discountPercentage) / 100
                ).toFixed(2)}
              </div>
              <div className="w-2/12">
                <div className="flex flex-row justify-center items-center">
                  <FaMinus
                    onClick={() => decreaseItem(item.product_id, item.quantity)}
                    className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1"
                  />
                  <span className="border-y-2 border-gray-500 w-12 h-8 flex justify-center items-center">
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handlerQuantity(e, item.product_id)}
                      className="w-full text-center"
                    />
                  </span>
                  <FaPlus
                    onClick={() => increaseItem(item.product_id, item.quantity)}
                    className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1"
                  />
                </div>
              </div>
              <div className="w-1/12 text-center">
                $
                {(
                  (item.price - (item.price * item.discountPercentage) / 100) *
                  item.quantity
                ).toFixed(2)}
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
        {/* <div>Total Price : ${cart.total_price}</div> */}
      </section>
    </main>
  );
};

export default Cart;
