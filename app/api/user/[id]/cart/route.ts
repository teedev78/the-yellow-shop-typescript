import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: any) {
  try {
    const userData = await request.json();
    const { userId } = userData;

    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    return Response.json({
      status: 200,
      message: "Get user cart successful.",
      userCart,
    });
  } catch (error) {
    return Response.json({ status: 422, messsage: "Something went wrong..." });
  }
}
