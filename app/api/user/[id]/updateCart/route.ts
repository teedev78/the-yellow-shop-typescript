import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: any) {
  try {
    const data = await request.json();
    const { userId, cartItem } = data;

    // console.log(userId, newCart);

    const client = await connectToDatabase();
    const db = client.db();

    const query = { _id: new ObjectId(userId as string) };
    const user = await db.collection("User").findOne(query);

    if (!user) {
      client.close();
      return Response.json({ status: 422, message: "user not found." });
    }

    const cart = await db.collection("Cart").findOne(query);
    if (!cart) {
      await db.collection("Cart").insertOne({
        userId: query,
        cartItem: cartItem,
        updatedAt: Date.now(),
      });

      client.close();
      return Response.json({ status: 201, message: "Cart created." });
    }

    await db
      .collection("Cart")
      .updateOne(query, { $set: { cartItem } });

    client.close();
    return Response.json({ status: 201, message: "Cart Updated." });
  } catch (error) {
    return Response.json({ status: 422, message: "Something went wrong..." });
  }
}
