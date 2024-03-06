import React from "react";
import { FaBell, FaClipboardList, FaHouse, FaUserLarge } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="w-full bg-blue-400">
      <div className="hidden sm:block">Desktop</div>
      <div className="sm:hidden h-[50px] flex flex-row justify-evenly items-center">
        <div className="">
          <FaHouse />
        </div>
        <div className="">
          <FaClipboardList />
        </div>
        <div className="">
          <FaBell />
        </div>
        <div className="">
          <FaUserLarge />
        </div>
      </div>
    </div>
  );
};

export default Footer;
