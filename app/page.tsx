import ProductsContextProvider from "@/context/ProductsContextProvider";
import ProductsList from "./products/page";
import SearchResult from "./search-result/page";

export default function Home() {
  return (
    <main className="bg-gray-300 py-10">
      <ProductsList />
    </main>
  );
}
