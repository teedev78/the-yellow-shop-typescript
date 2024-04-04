import { connectToDatabase } from "@/lib/db";
import { getSession } from "next-auth/react";

export async function POST(request: any) {
  try {
    const data = await request.json();
    const { email } = data;

    const client = await connectToDatabase();
    const db = client.db();

    const cartItem = await db
      .collection("users")
      .updateOne({ email }, { $set: { cart: { id: 1, quantity: 1 } } });
    // console.log(cartItem);
    client.close();

    return Response.json({ status: 201, message: "Send.", data: { cartItem } });
  } catch (error) {
    return Response.json({ status: 422, message: "Something went wrong..." });
  }
}
