"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/context/ProductsContextProvider";
import { fetchSearchProduct } from "@/lib/action";
import Link from "next/link";
import Card from "@/components/Card";

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
  const searchParams = useSearchParams();
  const search = searchParams.get("search") as string;

  const [loading, setLoading] = useState<boolean>(true);
  const { productsData, setProductsData } = useProducts();

  const fetchProducts = async () => {
    const result = await fetchSearchProduct(search);
    setProductsData(result);
  };

  useEffect(() => {
    fetchProducts();
    setLoading(false);
  }, [search]);

  return (
    <main className="bg-gray-100 sm:py-5">
      <section className="sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] w-full m-auto bg-white md:p-5">
        {loading ? (
          <div>loading...</div>
        ) : (
          <div className="flex justify-evenly items-center">
            <ul className="grid grid-cols-4 gap-12">
              {productsData.products.map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.id}`}>
                    <Card
                      id={product.id}
                      title={product.title}
                      description={product.description}
                      price={product.price}
                      discountPercentage={product.discountPercentage}
                      rating={product.rating}
                      stock={product.stock}
                      brand={product.brand}
                      category={product.category}
                      thumbnail={product.thumbnail}
                      images={product.images}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
};

export default SearchResult;
