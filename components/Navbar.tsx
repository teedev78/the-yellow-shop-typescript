"use client";

import React from "react";
import Image from "next/image";
import CartBar from "./CartBar";
import SearchBar from "./SearchBar";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const userImg = "/images/profile-temp-image.jpg";
  const cart = useSelector((state: RootState) => state.cart);
  const cartLength = cart.cartItem.length;

  const goToHome = () => {
    if (pathname !== "/") {
      router.push("/");
    } else {
      location.reload();
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-400 from-10% via-blue-400 via-30% to-blue-500 to-90%">
      <div className="hidden sm:flex flex-row justify-center items-center w-full sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] m-auto h-[100px]">
        <div onClick={() => goToHome()} className="w-4/12">
          <h1 className="text-2xl font-bold text-white">Y | The Yellow Shop</h1>
        </div>
        <div className="w-6/12">
          <SearchBar />
        </div>
        <div className="w-1/12 cursor-pointer flex justify-center items-center">
          <CartBar cartLength={cartLength} />
        </div>
        <div className="w-1/12">
          <Image
            src={userImg}
            alt="profile-image"
            width="0"
            height="0"
            sizes="100vw"
            className="rounded-full w-[40px] object-cover cursor-pointer"
          />
        </div>
      </div>

      <div className="sm:hidden w-full h-[50px] fixed top-0 bg-blue-500 p-1 flex flex-row justify-center items-center">
        <div className="w-5/6">
          <SearchBar />
        </div>
        <div className="w-1/6 relative flex justify-center items-center cursor-pointer">
          <CartBar cartLength={cartLength} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
