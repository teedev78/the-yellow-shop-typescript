import { useContext } from "react";

import AllProducts from "./AllProducts/route";
import ProductsContextProvider from "@/context/ProductsContextProvider";


export default function Home() {
  return (
    <main className="bg-gray-300 py-10">
      <ProductsContextProvider>
        <AllProducts />
      </ProductsContextProvider>
    </main>
  );
}
