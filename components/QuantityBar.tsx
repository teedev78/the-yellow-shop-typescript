"use client";
import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

const QuantityBar = () => {

  const handlerQuantity = () => {

  };

  return (
    <div className="flex flex-row justify-center items-center">
      <FaMinus
        onClick={() => ""}
        className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1"
      />
      <span className="border-y-2 border-gray-500 w-12 h-8 flex justify-center items-center">
        <input
          type="text"
          value={1}
          onChange={handlerQuantity}
          className="w-full text-center"
        />
      </span>
      <FaPlus
        onClick={() => ""}
        className="border-2 border-gray-500 w-8 h-8 fill-gray-600 p-1"
      />
    </div>
  );
};

export default QuantityBar;
