import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Cart = {
  product_id: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  quantity: number;
};

export async function POST(request: any) {
  try {
    const data = await request.json();
    const { userId, item: new_Item } = data.data;

    const existingCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (existingCart && existingCart.cartItem !== null) {
      const inCartItem = JSON.parse(JSON.stringify(existingCart.cartItem));

      const isInCart = inCartItem.find(
        (item: Cart) => item.product_id === new_Item.product_id
      );

      if (!isInCart) {
        await prisma.cart.update({
          where: { userId },
          data: {
            cartItem: [...inCartItem, new_Item],
          },
        });
      } else {
        inCartItem.map((item: Cart) => {
          if (item.product_id === new_Item.product_id) {
            item.quantity += new_Item.quantity;
          }
        });

        await prisma.cart.update({
          where: { userId },
          data: {
            cartItem: inCartItem,
          },
        });
      }
    } else {
      return Response.json({ status: 200, message: "no cart for this user." });
    }

    return Response.json({ status: 201, message: "add item successful." });
  } catch (error) {
    return Response.json({ status: 400, message: "Error : " + error });
  }
}
