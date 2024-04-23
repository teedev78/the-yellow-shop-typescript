import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ status: 422, message: "not authenticate." });
    }
    const { email }: any = session.user;

    const client = await connectToDatabase();
    const db = client.db();
    const user = await db.collection("users").findOne({ email });
    console.log(user);

    client.close();
    return Response.json({ status: 200, message: "Loaded Cart Successful." });
  } catch (error) {
    return Response.json({ status: 422, message: "Something went wrong..." });
  }
}
