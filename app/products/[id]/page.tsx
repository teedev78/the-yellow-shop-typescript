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
  // const [product, setProduct] = useState<Product>({
  //   id: 0,
  //   title: "",
  //   description: "",
  //   price: 0,
  //   discountPercentage: 0,
  //   rating: 0,
  //   stock: 0,
  //   brand: "",
  //   category: "",
  //   thumbnail: "",
  //   images: [],
  // });

  const [product, setProduct] = useState<Product>({
    id: 1,
    title: "iPhone 9",
    description: "An apple mobile which is nothing like apple",
    price: 549,
    discountPercentage: 12.96,
    rating: 4.69,
    stock: 94,
    brand: "Apple",
    category: "smartphones",
    thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
    images: [
      "https://cdn.dummyjson.com/product-images/1/1.jpg",
      "https://cdn.dummyjson.com/product-images/1/2.jpg",
      "https://cdn.dummyjson.com/product-images/1/3.jpg",
      "https://cdn.dummyjson.com/product-images/1/4.jpg",
      "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
      "https://cdn.dummyjson.com/product-images/1/2.jpg",
      "https://cdn.dummyjson.com/product-images/1/4.jpg",
    ],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
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

  useEffect(() => {
    // fetchProduct(params.id);
    setLoading(false);
  }, [imgIndex]);

  return (
    <section className="border-2 border-black w-full sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] min-h-[400px] m-auto bg-white">
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="flex flex-row justify-between items-center p-5">
          <div className="flex flex-col justify-between items-center border-2 border-blue-400 w-1/2 h-[500px]">
            <div className="flex justify-center items-center h-[400px] w-[460px] border-2 border-orange-500">
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={400}
                height={400}
                className="border-2 border-red-500"
              />
            </div>

            <div className="flex flex-row justify-center items-center">
              <div className="flex justify-center items-center border-2 border-gray-500 w-[24px] h-[80px]">
                <FaAngleLeft
                  onClick={() => handlerImagesSlide("left")}
                  className="fill-gray-600"
                />
              </div>
              <ul className="flex flex-row justify-center items-center">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    // <li key={index} className="mx-1">
                    //   <Image
                    //     src={image}
                    //     alt={product.title}
                    //     width={80}
                    //     height={80}
                    //   />
                    // </li>
                    <li
                      key={index}
                      className="border-2 border-green-400 w-[80px] h-[80px]"
                    >
                      <Image
                        src={product.images[index + imgIndex[0]]}
                        alt={product.title}
                        width={80}
                        height={80}
                      />
                    </li>
                  ))}
              </ul>
              <div className="flex justify-center items-center border-2 border-gray-500 w-[24px] h-[80px]">
                <FaAngleRight
                  onClick={() => handlerImagesSlide("right")}
                  className="fill-gray-600"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start border-b-2 border-gray-400 w-1/2 h-[500px] p-5">
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
              <FaMinus className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1" />
              <span className="border-y-2 border-gray-500 w-12 h-8 flex justify-center items-center">
                {quantity}
              </span>
              <FaPlus className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1" />
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
