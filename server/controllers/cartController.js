import prisma from "../utils/prismClient.js";
import logActivity from "../utils/logger.js";

async function getCart(req, res) {
  try {
    const activeUserId = req.headers["x-user-id"];

    if (!activeUserId) {
      return res
        .status(401)
        .json({ message: "User identity required to pull cart" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: Number(activeUserId) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Fetch Cart Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function addToCart(req, res) {
  try {
    const { productId } = req.body;
    const activeUserId = req.headers["x-user-id"];

    if (!activeUserId) {
      return res.status(401).json({ message: "User identity required" });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: Number(activeUserId) },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: Number(activeUserId) },
      });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId: Number(productId) },
      },
      update: { quantity: { increment: 1 } },
      create: {
        cartId: Math.floor(cart.id),
        productId: Number(productId),
        quantity: 1,
      },
    });

    await logActivity({
      userId: activeUserId,
      action: "CART_ADD_ITEM",
      entityId: productId,
      details: { cartId: cart.id },
    });

    return res.status(200).json({ message: "Item added to cart", cartItem });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateQuantity(req, res) {
  try {
    const { cartId, productId, quantity } = req.body;
    const activeUserId = req.headers["x-user-id"] || 0;

    await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: Number(cartId),
          productId: Number(productId),
        },
      },
      data: { quantity: Number(quantity) },
    });

    await logActivity({
      userId: activeUserId,
      action: "CART_UPDATE_QTY",
      entityId: productId,
      details: { cartId, targetQuantity: Number(quantity) },
    });

    return res.status(200).json({ message: "Quantity updated" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function removeItem(req, res) {
  try {
    const { cartId, productId } = req.body;
    const activeUserId = req.headers["x-user-id"] || 0;

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: Number(cartId),
          productId: Number(productId),
        },
      },
    });

    await logActivity({
      userId: activeUserId,
      action: "CART_REMOVE_ITEM",
      entityId: productId,
      details: { cartId },
    });

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default { getCart, addToCart, updateQuantity, removeItem };
