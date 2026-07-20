import prisma from "../utils/prismaClient.js";

// Add an item to the cart (or increment quantity)
async function addToCart(req, res) {
  try {
    const { productId } = req.body;
    const userId = 1; // Temporary placeholder until you add Auth middleware

    // 1. Ensure the user has a Cart. If not, findOrCreate it.
    let cart = await prisma.cart.findUnique({
      where: { userId: Number(userId) },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: Number(userId) },
      });
    }

    // 2. Use Upsert to create the CartItem or increment quantity if it exists
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId),
        },
      },
      update: {
        quantity: { increment: 1 }, // If it exists, add 1 to quantity
      },
      create: {
        cartId: cart.id,
        productId: Number(productId),
        quantity: 1, // If it's new, set quantity to 1
      },
    });

    return res.status(200).json({ message: "Item added to cart", cartItem });
  } catch (error) {
    console.error("Cart Database Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Fetch the complete cart details with product metadata for Cart.jsx
async function getCart(req, res) {
  try {
    const userId = 1; // Temporary placeholder

    const cart = await prisma.cart.findUnique({
      where: { userId: Number(userId) },
      include: {
        items: {
          include: {
            product: true, // Pulls Name, Price, and imageURL from Products table
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

// ... keep your existing getCart and addToCart logic above

// Update quantity directly from the input counter
async function updateQuantity(req, res) {
  try {
    const { cartId, productId, quantity } = req.body;

    // Guard against negative numbers or string formatting issues
    if (Number(quantity) <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: Number(cartId),
          productId: Number(productId),
        },
      },
      data: {
        quantity: Number(quantity),
      },
    });

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Update Quantity Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Remove an item entirely from the composite record
async function removeItem(req, res) {
  try {
    const { cartId, productId } = req.body;

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: Number(cartId),
          productId: Number(productId),
        },
      },
    });

    return res
      .status(200)
      .json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Remove Item Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default { addToCart, getCart, updateQuantity, removeItem };
