import { useProducts } from "@/context/ProductsContextProvider";
import { fetchSearchProduct } from "@/lib/action";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

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

const SearchBar = () => {
  const router = useRouter();
  const { productsData, setproductsData } = useProducts();
  const [value, setValue] = useState<string>("");

  const fetchProducts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(productsData);
    const result: Products = await fetchSearchProduct(value);
    console.log(result);
    console.log(productsData);
    setproductsData(result);
    console.log(productsData);
    // router.push("/search-result");
  };

  useEffect(() => {
    console.log("search successful");
  }, [productsData]);

  return (
    <form
      onSubmit={fetchProducts}
      className="flex flex-row justify-start items-center"
    >
      <input
        type="text"
        placeholder="search"
        onChange={(e) => setValue(e.target.value)}
        className="border-2 border-white outline-none focus:border-black w-2/3 h-8 p-1 rounded-l-sm"
      />
      <button type="submit">
        <FaMagnifyingGlass className="fill-white border-2 border-white p-1 w-8 h-8 rounded-r-sm cursor-pointer" />
      </button>
    </form>
  );
};

export default SearchBar;
