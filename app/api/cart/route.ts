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

//Add Item to Cart
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

    //Get Item in updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
    });

    console.log(updatedCart);

    return Response.json({
      status: 201,
      message: "add item successful.",
      data: updatedCart,
    });
  } catch (error) {
    return Response.json({ status: 400, message: "Error : " + error });
  }
}

//Delete Item from Cart
export async function DELETE(request: any) {
  try {
    const data = await request.json();
    const { userId, itemId } = data;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      const userCart = JSON.parse(JSON.stringify(cart.cartItem));

      const removeItem = (item: Cart) => {
        if (item.product_id !== itemId) {
          return true;
        }
        return false;
      };
      const newCart = userCart.filter(removeItem);

      const updatedCart = await prisma.cart.update({
        where: { userId },
        data: {
          cartItem: newCart,
        },
      });

      return Response.json({
        status: 201,
        message: "Item removed.",
        data: updatedCart,
      });
    }
  } catch (error) {
    return Response.json({ status: 400, message: "Error : " + error });
  }
}
