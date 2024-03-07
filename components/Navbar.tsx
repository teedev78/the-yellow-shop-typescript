"use client";

import React from "react";
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
import SearchBar from "./SearchBar";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const cart = 0;
  const userImg = "/images/profile-temp-image.jpg";

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
        <div className="w-1/12 relative cursor-pointer">
          <FaCartShopping className="fill-white w-9 h-9 p-1" />
          {cart > 0 && (
            <div className="absolute flex justify-center items-center top-[-5px] right-[-15px] bg-white text-blue-500 border-2 border-blue-200 rounded-full p-2 h-4 text-sm">
              <p className="">{cart}</p>
            </div>
          )}
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
          <FaCartShopping className="fill-white w-9 h-9 p-1" />
          {cart > 0 && (
            <div className="absolute flex justify-center items-center top-[-5px] right-[-15px] bg-white text-blue-500 border-2 border-blue-200 rounded-full p-2 h-4 text-sm">
              <p className="">{cart}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
