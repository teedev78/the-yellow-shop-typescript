import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: any) {
  try {
    const userData = await request.json();
    const { id } = userData;

    const client = await connectToDatabase();
    const db = client.db();

    const query = { _id: new ObjectId(id as string) };
    const options = { projection: { cart: 1 } };

    const userCart = await db.collection("users").findOne(query, options);
    // console.log(userCart);
    client.close();

    return Response.json({ status: 200, message: "Cart Ok.", userCart });
  } catch (error) {
    return Response.json({ status: 422, messsage: "Something went wrong..." });
  }
}
