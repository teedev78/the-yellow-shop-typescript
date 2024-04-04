import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsContextProvider from "@/context/ProductsContextProvider";
import { Providers } from "@/store/provider";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Yellow Store",
  description: "Shopping will be fun.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Providers>
            <Navbar />
            <ProductsContextProvider>{children}</ProductsContextProvider>
            <Footer />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
