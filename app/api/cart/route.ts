import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

type Cart = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
};

export async function POST(request: any) {
  try {
    const data = await request.json();
    const { email, product } = data;

    const client = await connectToDatabase();
    const db = client.db();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      client.close();
      return NextResponse.json({ status: 422, message: "user not found." });
    }

    const isInCart = user.cart.find((item: Cart) => item.id === product.id);
    // console.log(isInCart);
    // console.log(user.cart);

    if (isInCart === undefined) {
      const newCart = [...user.cart, product];

      await db
        .collection("users")
        .updateOne({ email }, { $set: { cart: newCart } });
    } else {
      user.cart.map((item: Cart) => {
        if (item.id === product.id) {
          item.quantity += product.quantity;
        }
      });

      await db
        .collection("users")
        .updateOne({ email }, { $set: { cart: user.cart } });
    }

    client.close();
    return Response.json({ status: 201, message: "Cart Updated." });
  } catch (error) {
    return Response.json({ status: 422, message: "Something went wrong..." });
  }
}
