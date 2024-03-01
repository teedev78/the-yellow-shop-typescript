"use client";

import { fetchGetProduct } from "@/lib/action";
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

const route = ({ params }: { params: { id: string } }) => {
  const [product, setProduct] = useState<Product>({
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
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImg, setMainImg] = useState<number>(0);
  const [imgIndex, setImgIndex] = useState<number[]>([0, 4]);

  const fetchProduct = async (id: string) => {
    const data = await fetchGetProduct(id);
    setProduct(data);
  };

  const handlerImagesSlide = (slide: string) => {
    if (slide === "left" && imgIndex[0] !== 0) {
      setImgIndex(imgIndex.map((i) => i - 1));
      // console.log("left");
    } else if (slide === "right" && imgIndex[1] !== product.images.length - 1) {
      setImgIndex(imgIndex.map((i) => i + 1));
      // console.log("right");
    }
  };

  const handlerQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value.replace(/\D/g, ""));
    if (num === 0) {
      setQuantity(1);
    } else if (num > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(num);
    }
  };

  const handlerChangeQuantity = (qty: string) => {
    if (qty === "plus" && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (qty === "minus" && quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      return;
    }
  };

  useEffect(() => {
    fetchProduct(params.id);
    setLoading(false);
  }, [imgIndex]);

  return (
    <section className="border-2 border-black w-full sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] h-full m-auto bg-white md:p-5">
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
              $<span className="line-through">{product.price.toFixed(2)}</span>
            </div>
            <div className="text-blue-500 font-semibold text-2xl">
              $
              <span>
                {(
                  product.price *
                  (1 - product.discountPercentage / 100)
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex flex-row justify-center items-center mt-10">
              <FaMinus
                onClick={() => handlerChangeQuantity("minus")}
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
                onClick={() => handlerChangeQuantity("plus")}
                className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1"
              />
              <span className="ml-3">{product.stock} in stock</span>
            </div>
            <div className="mt-10">
              <button className="flex flex-row justify-center items-center w-[200px] h-[36px] bg-blue-500 text-white rounded-sm">
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
  );
};

export default route;
