import { connectToDatabase } from "@/lib/db";

export async function POST(request: any) {
  try {
    const data = await request.json();
    const { email, cart } = data;

    const client = await connectToDatabase();
    const db = client.db();

    await db.collection("users").updateOne({ email }, { $set: { cart } });

    client.close();

    return Response.json({ status: 201, message: "Cart Updated." });
  } catch (error) {
    return Response.json({ status: 422, message: "Something went wrong..." });
  }
}
