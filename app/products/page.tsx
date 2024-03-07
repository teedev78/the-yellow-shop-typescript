"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/context/ProductsContextProvider";
import { fetchGetProductsEachPage } from "@/lib/action";
import Card from "@/components/Card";
import PaginationBar from "@/components/PaginationBar";
import Link from "next/link";

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

const ProductsList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { productsData, setProductsData } = useProducts();
  const [maxPage, setMaxPage] = useState<number>(0);

  // ดึงข้อมูลสินค้ารอบแรก
  const fetchData = async () => {
    const tempProductsData: Products = await fetchGetProductsEachPage(0);
    setProductsData(tempProductsData);
    setMaxPage(Math.ceil(tempProductsData.total / tempProductsData.limit));
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  // destructuring
  const { products, total } = productsData;

  return (
    <main className="bg-gray-100 mt-[50px] sm:mt-0 sm:py-5">
      <section className="sm:w-[480px] md:w-[640px] lg:w-[960px] xl:w-[1100px] m-auto bg-white">
        {/* รายการสินค้าหน้าแรก */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="">
            <div className="flex flex-col justify-between items-center">
              <ul className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-12">
                {products.map((product: Product) => (
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
            {/* แทบเลือกหน้ารายการสินค้า */}
            <div className="p-10">
              <PaginationBar {...{ total, maxPage }} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductsList;
