import Link from "next/link";
import React from "react";
import { FaCartShopping } from "react-icons/fa6";

type Props = {
  cartLength: number;
};

const CartBar = ({ cartLength }: Props) => {
  return (
    <Link href="/cart" className="relative">
      <FaCartShopping className="fill-white w-9 h-9 p-1" />
      {cartLength > 0 && (
        <div className="absolute flex justify-center items-center top-[-5px] right-[-10px] bg-white text-blue-500 border-2 border-blue-200 rounded-full p-2 h-4 text-sm">
          <p className="">{cartLength}</p>
        </div>
      )}
    </Link>
  );
};

export default CartBar;
