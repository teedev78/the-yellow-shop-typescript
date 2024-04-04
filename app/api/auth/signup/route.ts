import { connectToDatabase } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(request: any) {
  try {
    const data = await request.json();
    const { email, password, name } = data;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 8
    ) {
      return Response.json({ status: 422, message: "Invalid Input." });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
      client.close();
      return Response.json({ status: 422, message: "User exists already!" });
    }

    const hashedPassword = await hash(password, 10);

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      name
    });

    client.close();
    return Response.json({ status: 201, message: "Created user!" });
  } catch (error) {
    return Response.json({ message: "user could not be created" });
  }
}
