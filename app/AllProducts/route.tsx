"use client";

import Card from "@/components/Card";
import PaginationBar from "@/components/PaginationBar";
import { fetchGetProductsEachPage } from "@/lib/action";
import { useContext, useEffect, useState } from "react";
import { useProducts } from "@/context/ProductsContextProvider";

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

const AllProducts = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { productsData, setproductsData } = useProducts();
  const [maxPage, setMaxPage] = useState<number>(0);

  const fetchData = async () => {
    const tempProductsData: Products = await fetchGetProductsEachPage(0);
    setproductsData(tempProductsData);
    setMaxPage(Math.ceil(tempProductsData.total / tempProductsData.limit));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { products, total } = productsData;

  return (
    <div className="border-2 border-black w-full sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] min-h-[800px] m-auto bg-gray-100 ">
      <div>
        <p>Product May you like it!</p>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <PaginationBar {...{ total, maxPage }} />
            <div className="flex justify-evenly items-center">
              <ul className="grid grid-cols-4 gap-12">
                {products.map((product: Product) => (
                  <li key={product.id}>
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <p>Total product(s): {total}</p>
      </div>
    </div>
  );
};

export default AllProducts;
