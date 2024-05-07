import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

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
    const { userId, newCart } = data;

    // console.log(userId, newCart);

    const client = await connectToDatabase();
    const db = client.db();

    const query = { _id: new ObjectId(userId as string) };
    const user = await db.collection("users").findOne(query);

    if (!user) {
      client.close();
      return Response.json({ status: 422, message: "user not found." });
    }

    // const isInCart = user.cart.find((item: Cart) => item.id === product.id);
    // // console.log(isInCart);
    // // console.log(user.cart);

    // if (isInCart === undefined) {
    //   const newCart = [...user.cart, product];

    //   await db
    //     .collection("users")
    //     .updateOne(query, { $set: { cart: newCart } });
    // } else {
    //   user.cart.map((item: Cart) => {
    //     if (item.id === product.id) {
    //       item.quantity += product.quantity;
    //     }
    //   });

    await db.collection("users").updateOne(query, { $set: { cart: newCart } });

    // client.close();
    return Response.json({ status: 201, message: "Cart Updated." });
  } catch (error) {
    return Response.json({ status: 422, message: "Something went wrong..." });
  }
}
