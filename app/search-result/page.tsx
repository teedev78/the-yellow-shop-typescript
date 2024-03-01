"use client";

import Card from "@/components/Card";
import { useProducts } from "@/context/ProductsContextProvider";
import Link from "next/link";
import React, { useEffect } from "react";

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

const SearchResult = () => {
  const { productsData } = useProducts();
  console.log(productsData);
  
  

  useEffect(()=>{
    console.log("searched");
  },[]);

  return (
    <div>
      {/* <div className="flex justify-evenly items-center">
        {products.map(product => (
          <p key={product.id}>{product.title}</p>
        ))}
      </div> */}
    </div>
  );
};

export default SearchResult;
