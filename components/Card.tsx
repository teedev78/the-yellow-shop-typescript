"use client";

import React from "react";
import Image from "next/image";

type Props = {
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

const Card = ({
  id,
  title,
  price,
  discountPercentage,
  thumbnail,
  images,
}: Props) => {
  const handleClick = () => {
    console.log("Clicked!");
  };

  return (
    <div className="flex flex-col justify-between items-center hover:border-2 border-black w-[160px] h-[280px] bg-white overflow-hidden">
      <div className="flex justify-center items-center w-[160px] h-[160px]">
        <Image
          src={thumbnail}
          alt={title}
          width="0"
          height="0"
          sizes="100vw"
          className="w-full h-auto aspect-square object-contain"
        />
      </div>
      <div className="w-full p-1 text-left text-sm font-medium h-[100px] overflow-hidden">{title}</div>
      <div className="w-full p-1 text-right text-sm font-medium">
        $
        {discountPercentage > 0
          ? (price * (discountPercentage / 100)).toFixed(2)
          : price.toFixed(2)}
      </div>
      <button
        onClick={handleClick}
        className="bg-blue-400 text-white w-full p-2 hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Card;
