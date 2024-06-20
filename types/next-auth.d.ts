import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  type CartItem = {
    product_id: number;
    thumbnail: string;
    title: string;
    price: number;
    discountedPrice: number;
    quantity: number;
  };

  type Cart = {
    cartItem: CartItem[];
    total_price: number;
    loading: false;
  };

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image: string;
      userCart: Cart;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    userCart: Cart;
    password: string;
  }
}
