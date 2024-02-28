import ProductsContextProvider from "@/context/ProductsContextProvider";
import ProductsList from "./products/page";

export default function Home() {
  return (
    <main className="bg-gray-300 py-10">
      <ProductsContextProvider>
        <ProductsList />
      </ProductsContextProvider>
    </main>
  );
}
