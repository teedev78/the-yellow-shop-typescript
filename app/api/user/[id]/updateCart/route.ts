import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: any) {
  try {
    const data = await request.json();
    const { userId, cartItem } = data;

    console.log(userId, cartItem);

    // const query = { _id: new ObjectId(userId as string) };
    const existingCart = (await prisma.cart.findUnique({
      where: { userId },
    })) as any;

    if (existingCart) {
      await prisma.cart.update({
        where: { userId },
        data: {
          cartItem,
        },
      });

      return Response.json({ status: 201, message: "Cart Updated." });
    }

    const newCart = await prisma.cart.create({
      data: {
        userId,
        cartItem,
      },
    });

    return Response.json({ status: 201, message: "Cart Created." });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 422, message: "Something went wrong..." });
  }
}
