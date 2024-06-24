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

//Get User Cart
export async function POST(request: any) {
  const data = await request.json();
  const { userId } = data;

  try {
    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    return Response.json({
      status: 200,
      message: "Get user cart successful.",
      userCart,
    });
  } catch (error) {
    return Response.json({
      status: 422,
      messsage: "Get user cart failed!",
    });
  }
}

//Add Item to User Cart Function + Use in POST Function
const addToCart = async (userId: string, new_Item: Cart) => {
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
    await prisma.cart.create({
      data: {
        userId,
        cartItem: [new_Item],
      },
    });
  }

  //Get Item in updated cart
  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
  });

  return updatedCart;
};

export async function PUT(request: any) {
  const data = await request.json();
  const { req_type, userId, item: new_Item } = data;

  if (req_type === "add") {
    try {
      const updatedCart = await addToCart(userId, new_Item);

      return Response.json({
        status: 201,
        message: "Add item successful.",
        data: updatedCart,
      });
    } catch (error) {
      return Response.json({ status: 400, message: "Error : " + error });
    }
  } else if (req_type === "increase") {
    try {
      const existingCart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (existingCart) {
        const userCart = JSON.parse(JSON.stringify(existingCart));
        userCart.cartItem.map((item: Cart) => {
          if (item.product_id === new_Item.product_id) {
            item.quantity += 1;
          }
        });

        const updatedCart = await prisma.cart.update({
          where: { userId },
          data: {
            cartItem: userCart.cartItem,
          },
        });

        return Response.json({
          status: 201,
          message: "Increase item quantity successful.",
          userCart: updatedCart,
        });
      }
    } catch (error) {
      return Response.json({
        status: 400,
        message: "Increase item failed!",
        error,
      });
    }
  } else if (req_type === "decrease") {
    try {
      const existingCart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (existingCart) {
        const userCart = JSON.parse(JSON.stringify(existingCart));

        userCart.cartItem.map((item: Cart) => {
          if (item.product_id === new_Item.product_id) {
            if (item.quantity >= 2) {
              item.quantity -= 1;
            } else {
              item.quantity = 1;
            }
          }
        });

        const updatedCart = await prisma.cart.update({
          where: { userId },
          data: {
            cartItem: userCart.cartItem,
          },
        });

        return Response.json({
          status: 201,
          message: "Decrease item quantity successful.",
          userCart: updatedCart,
        });
      }
    } catch (error) {
      return Response.json({
        status: 400,
        message: "Decrease item failed!",
        error,
      });
    }
  } else if (req_type === "byQTY") {
    try {
      // console.log(new_Item);
      const existingCart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (existingCart) {
        const userCart = JSON.parse(JSON.stringify(existingCart));
        userCart.cartItem.map((item: Cart) => {
          if (item.product_id === new_Item.product_id) {
            if (new_Item.quantity >= 1) {
              item.quantity = new_Item.quantity;
            }
          }
        });

        const updatedCart = await prisma.cart.update({
          where: { userId },
          data: {
            cartItem: userCart.cartItem,
          },
        });

        return Response.json({
          status: 201,
          message: "Change quantity successful.",
          userCart: updatedCart,
        });
      }
    } catch (error) {
      return Response.json({
        status: 400,
        message: "Change quantity failed!",
        error,
      });
    }
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
