"use client";

import { createContext, useState, useContext } from "react";

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

type T = {
  productsData: Products;
  setProductsData: React.Dispatch<React.SetStateAction<Products>>;
};

const productsContextDefaultValues: T = {
  productsData: {
    products: [],
    total: 0,
    skip: 0,
    limit: 0,
  },
  setProductsData: () => [],
};

const ProductsContext = createContext<T>(productsContextDefaultValues);

export function useProducts() {
  return useContext(ProductsContext);
}

const ProductsContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [productsData, setProductsData] = useState<Products>({
    products: [],
    total: 0,
    skip: 0,
    limit: 0,
  });

  return (
    <ProductsContext.Provider value={{ productsData, setProductsData }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContextProvider;
