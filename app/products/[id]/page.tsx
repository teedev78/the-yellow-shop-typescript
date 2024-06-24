"use client";

import { fetchGetProduct } from "@/lib/action";
import { calTotalPrice } from "../../../utilities/calTotalPrice";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaRegStar,
  FaRegStarHalfStroke,
  FaStar,
  FaCartPlus,
  FaPlus,
  FaMinus,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa6";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { updateCartFromDB } from "@/store/slices/cartSlice";
import Toast from "@/components/Toast";
import { showToast, showToastRemoveItem } from "@/store/slices/toastSlice";
import { useSession } from "next-auth/react";
import axios from "axios";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

const initialProductValue = {
  id: 0,
  title: "",
  description: "",
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  brand: "",
  category: "",
  thumbnail: "",
  images: ["/images/no-image.jpg"],
};

type CartItem = {
  product_id: number;
  thumbnail: string;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
};

const route = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const toast = useSelector((state: RootState) => state.toast);

  const [product, setProduct] = useState<Product>(initialProductValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImg, setMainImg] = useState<number>(0);
  const [imgIndex, setImgIndex] = useState<number[]>([0, 4]);
  const totalPrice = calTotalPrice(product.price, product.discountPercentage);

  // ดึงข้อมูลสินค้า
  const fetchProduct = async (id: string) => {
    const data = await fetchGetProduct(id);
    setProduct(data);
  };

  useEffect(() => {
    fetchProduct(params.id);
    setLoading(false);
  }, []);

  // ตัวควบคุมสไลด์รูปสินค้า
  const handlerImagesSlide = (slide: string) => {
    if (slide === "left" && imgIndex[0] !== 0) {
      setImgIndex(imgIndex.map((i) => i - 1));
      // console.log("left");
    } else if (slide === "right" && imgIndex[1] !== product.images.length - 1) {
      setImgIndex(imgIndex.map((i) => i + 1));
      // console.log("right");
    }
  };

  // เซ็ตจำนวนสินค้าจากช่องกรอกจำนวนสินค้า
  const handlerQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = Number(e.target.value.replace(/\D/g, ""));
    if (newQty === 0) {
      setQuantity(1);
    } else if (product.stock < newQty) {
      setQuantity(product.stock);
      dispatch(
        showToast({
          message: `You can only add ${product.stock} items.`,
        })
      );
    } else {
      setQuantity(newQty);
    }
  };

  // เพิ่มจำนวนสินค้าจากปุ่มเพิ่มสินค้า
  const increaseItem = async () => {
    const newQty = quantity + 1;
    if (product.stock >= newQty) {
      setQuantity(newQty);
    } else {
      setQuantity(product.stock);
      dispatch(
        showToast({
          message: `You can only add ${product.stock} items.`,
        })
      );
    }
  };

  // ลดจำนวนสินค้าจากปุ่มลดสินค้า
  const decreaseItem = () => {
    const newQty = quantity - 1;
    if (newQty <= 1) {
      setQuantity(1);
    } else {
      setQuantity(newQty);
    }
  };

  // เพิ่มสินค้าลงในตะกร้า
  const addToCart = async (
    product_id: number,
    thumbnail: string,
    title: string,
    price: number,
    discountPercentage: number,
    quantity: number
  ) => {
    if (status === "authenticated" && session.user) {
      await axios
        .put("/api/cart", {
          req_type: "add",
          userId: session.user.id,
          item: {
            product_id,
            thumbnail,
            title,
            price,
            discountPercentage,
            quantity,
          },
        })
        .then((res) => {
          const updatedCart: CartItem = res.data.data.cartItem;
          dispatch(updateCartFromDB({ cartItem: updatedCart }));
          dispatch(showToast({ message: "Add item successful." }));
        })
        .catch((error) => {
          console.log("Error : " + error);
        });
    }
  };

  return (
    <main className="bg-gray-100 mt-[50px] sm:mt-0 sm:py-5">
      {toast && <Toast />}
      <section className="sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] w-full m-auto bg-white md:p-5">
        {loading ? (
          <div>loading...</div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-start pb-5 border-b-2 border-gray-400">
            {/* Product Image */}
            <div className="flex flex-col justify-start items-center w-full md:w-1/2">
              <div className="flex justify-center items-center w-full aspect-square">
                <Image
                  src={product.images[mainImg]}
                  alt={product.title}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="w-full h-auto aspect-square object-contain"
                />
              </div>
              <div className="w-full">
                {product.images.length > 5 ? (
                  <ul className="flex flex-row justify-center items-center">
                    <div
                      onClick={() => handlerImagesSlide("left")}
                      className="flex justify-center items-center border-2 border-gray-500 w-[5%] h-[100px] cursor-pointer"
                    >
                      <FaAngleLeft className="fill-gray-600" />
                    </div>
                    {Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <li
                          key={index}
                          onClick={() => setMainImg(index + imgIndex[0])}
                          className={
                            mainImg === index + imgIndex[0]
                              ? "border-blue-400 " +
                                `flex justify-center items-center border-2 w-[18%] aspect-square cursor-pointer`
                              : "border-gray-500 " +
                                `flex justify-center items-center border-2 w-[18%] aspect-square cursor-pointer`
                          }
                        >
                          <Image
                            src={product.images[index + imgIndex[0]]}
                            alt={product.title}
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="w-full h-auto aspect-square object-contain"
                          />
                        </li>
                      ))}
                    <div
                      onClick={() => handlerImagesSlide("right")}
                      className="flex justify-center items-center border-2 border-gray-500 w-[5%] h-[100px] cursor-pointer"
                    >
                      <FaAngleRight className="fill-gray-600" />
                    </div>
                  </ul>
                ) : (
                  <ul className="flex flex-row justify-center items-center">
                    {product.images.map((image, index) => (
                      <li
                        key={index}
                        onClick={() => setMainImg(index + imgIndex[0])}
                        className={
                          mainImg === index + imgIndex[0]
                            ? "border-blue-400 " +
                              `flex justify-center items-center border-2 w-[18%] aspect-square cursor-pointer`
                            : "border-gray-500 " +
                              `flex justify-center items-center border-2 w-[18%] aspect-square cursor-pointer`
                        }
                      >
                        <Image
                          src={image}
                          alt={product.title}
                          width="0"
                          height="0"
                          sizes="100vw"
                          className="w-full h-auto aspect-square object-contain"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Product Details */}
            <div className="flex flex-col justify-start items-start w-full md:w-1/2 p-5 md:px-5 md:py-0">
              <h1 className="font-medium text-2xl">{product.title}</h1>
              <div className="flex flex-row justify-start items-center">
                <span className="text-blue-500">{product.rating}</span>
                <FaStar className="fill-blue-500 mx-1" />
                ratings
              </div>
              <div className="text-gray-500 mt-10">
                $
                <span className="line-through">{product.price.toFixed(2)}</span>
              </div>
              <div className="text-blue-500 font-semibold text-2xl">
                $<span>{totalPrice}</span>
              </div>
              <div className="flex flex-row justify-center items-center mt-10">
                <div className="flex flex-row justify-center items-center">
                  <FaMinus
                    onClick={decreaseItem}
                    className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1"
                  />
                  <span className="border-y-2 border-gray-500 w-12 h-8 flex justify-center items-center">
                    <input
                      type="text"
                      value={quantity}
                      onChange={handlerQuantity}
                      className="w-full text-center"
                    />
                  </span>
                  <FaPlus
                    onClick={increaseItem}
                    className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1"
                  />
                </div>
                <span className="ml-3">{product.stock} in stock</span>
              </div>
              <div className="mt-10">
                <button
                  onClick={() =>
                    addToCart(
                      product.id,
                      product.thumbnail,
                      product.title,
                      product.price,
                      product.discountPercentage,
                      quantity
                    )
                  }
                  className="flex flex-row justify-center items-center w-[200px] h-[36px] bg-blue-500 text-white rounded-sm"
                >
                  <FaCartPlus className="fill-white mr-2 text-xl" />
                  Add to Cart
                </button>
              </div>
              <div className="mt-10">
                <h2 className="font-semibold">Product Description</h2>
                <p className="ml-5">{product.description}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default route;
