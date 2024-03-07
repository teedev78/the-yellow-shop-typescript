"use client";

import React from "react";
import {
  FaBell,
  FaClipboardList,
  FaHouse,
  FaUserLarge,
  FaSquareFacebook,
  FaTiktok,
  FaSquareXTwitter,
  FaSquareYoutube,
} from "react-icons/fa6";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const goToHome = () => {
    if (pathname !== "/") {
      router.push("/");
    } else {
      location.reload();
    }
  };

  return (
    <div className="w-full bg-blue-500 sm:bg-gradient-to-r from-blue-400 from-10% via-blue-400 via-30% to-blue-500 to-90% p-2">
      {/* Desktop Style */}
      <div className="hidden sm:flex sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] h-[100px] m-auto flex-row justify-between items-center">
        <div onClick={() => goToHome()} className="w-3/6">
          <h1 className="text-2xl font-bold text-white cursor-pointer">
            Y | The Yellow Shop
          </h1>
        </div>
        <div className="w-2/6">
          <ul className="flex flex-col justify-center items-start text-white">
            <li className="hover:underline cursor-pointer">
              <Link href="/about-us">About Us</Link>
            </li>
            <li className="hover:underline cursor-pointer">
              <Link href="contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className="w-1/6">
          <h1 className="text-white text-xl text-center mb-1">Follow Us</h1>
          <ul className="flex flex-row justify-evenly items-center">
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              <li className="p-1 cursor-pointer">
                <FaSquareFacebook className="fill-white text-xl" />
              </li>
            </Link>
            <Link
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
            >
              <li className="p-1 cursor-pointer">
                <FaSquareYoutube className="fill-white text-xl" />
              </li>
            </Link>
            <Link
              href="https://www.tiktok.com"
              target="_blank"
              rel="noreferrer"
            >
              <li className="p-1 cursor-pointer">
                <FaTiktok className="fill-white text-xl" />
              </li>
            </Link>
            <Link href="https://www.x.com" target="_blank" rel="noreferrer">
              <li className="p-1 cursor-pointer">
                <FaSquareXTwitter className="fill-white text-xl" />
              </li>
            </Link>
          </ul>
        </div>
      </div>
      {/* Mobile Style */}
      <div className="sm:hidden h-[50px] flex flex-row justify-evenly items-center">
        <div
          onClick={() => goToHome()}
          className="flex flex-col justify-center items-center cursor-pointer"
        >
          <FaHouse className="fill-white text-xl" />
          <p className="text-white text-sm font-light">Home</p>
        </div>
        <Link href="/order-history">
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <FaClipboardList className="fill-white text-xl" />
            <p className="text-white text-sm font-light">Order History</p>
          </div>
        </Link>
        <Link href="/notification">
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <FaBell className="fill-white text-xl" />
            <p className="text-white text-sm font-light">Notification</p>
          </div>
        </Link>
        <Link href="/profile">
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <FaUserLarge className="fill-white text-xl" />
            <p className="text-white text-sm font-light">Profile</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
