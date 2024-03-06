import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [value, setValue] = useState<string>("");

  const fetchProducts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/search-result?search=" + value);
  };

  return (
    <form
      onSubmit={fetchProducts}
      className="flex flex-row justify-start items-center"
    >
      <input
        type="text"
        placeholder="search"
        onChange={(e) => setValue(e.target.value)}
        className="border-2 border-white outline-none focus:border-black w-full sm:w-2/3 h-8 p-1 rounded-l-sm"
      />
      <button type="submit">
        <FaMagnifyingGlass className="fill-black sm:fill-white border-2 border-white p-1 w-8 h-8 rounded-r-sm cursor-pointer" />
      </button>
    </form>
  );
};

export default SearchBar;
