import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    const existingUser = (await prisma.user.findUnique({
      where: { email },
    })) as any;

    if (existingUser) {
      return Response.json({ status: 422, message: "User exists already!" });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        image: "/images/profile-temp-image.jpg",
        role: "member",
      },
    });

    return Response.json({ status: 201, message: "Created user!" });
  } catch (error) {
    return Response.json({ message: "user could not be created" });
  }
}
