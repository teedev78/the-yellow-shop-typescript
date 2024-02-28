"use client";

import { useProducts } from "@/context/ProductsContextProvider";
import { fetchGetProductsEachPage } from "@/lib/action";
import React, { useEffect, useState } from "react";
import { FaAngleLeft , FaAngleRight } from "react-icons/fa6";

type Props = {
  total: number;
  maxPage: number;
};

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

type Products = {
  products: Array<Product>;
  total: number;
  skip: number;
  limit: number;
};

const PaginationBar = ({ total, maxPage }: Props) => {
  const [currPage, setCurrPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const { setproductsData } = useProducts();

  const fetchData = async (page: number) => {
    const tempProductsData: Products = await fetchGetProductsEachPage(
      (page - 1) * 12
    );
    setproductsData(tempProductsData);
  };

  useEffect(() => {
    if (total !== 0) {
      setLoading(false);
    }
  }, [total, currPage]);

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= maxPage) {
      setCurrPage(page);
      fetchData(page);
    } else if (page < 1) {
      setCurrPage(1);
    } else if (page > maxPage) {
      setCurrPage(maxPage);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center">
      <div onClick={() => handleChangePage(currPage - 1)}>
        <FaAngleLeft
          className={`border-2 w-[30px] h-[30px] p-1 rounded-md cursor-pointer ${
            currPage === 1
              ? "fill-gray-500 border-gray-500"
              : "fill-blue-500 border-blue-500"
          }`}
        />
      </div>
      <div className="flex flex-row justify-center items-center">
        {!loading &&
          Array(maxPage)
            .fill(null)
            .map((_, index) => (
              <li
                key={index}
                onClick={() => handleChangePage(index + 1)}
                className={`h-[30px] w-[30px] p-2 mx-1 flex justify-center items-center ${
                  index + 1 === currPage
                    ? "bg-blue-500 rounded-md text-white"
                    : "text-gray-600"
                }`}
              >
                {index + 1}
              </li>
            ))}
      </div>
      <div onClick={() => handleChangePage(currPage + 1)}>
        <FaAngleRight
          className={`border-2 w-[30px] h-[30px] p-1 rounded-md cursor-pointer ${
            currPage === maxPage
              ? "fill-gray-500 border-gray-500"
              : "fill-blue-500 border-blue-500"
          }`}
        />
      </div>
    </div>
  );
};

export default PaginationBar;
