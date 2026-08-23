import supabase from "../config/supabase.js";
import logActivity from "../utils/activityLogger.js";

// Get or create the user's cart
const getOrCreateCart = async (userId) => {
  let { data: cart, error } = await supabase
    .from("carts")
    .select("id")
    .eq("userId", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!cart) {
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({
        userId,
      })
      .select("id")
      .single();

    if (createError) {
      throw createError;
    }

    cart = newCart;
  }

  return cart;
};

// Get the full cart with product details
const getCartData = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const { data: cartItems, error } = await supabase
    .from("cart_item")
    .select(
      `
      quantity,
      product:products (
        id,
        name,
        description,
        price,
        image_url,
        category
      )
    `,
    )
    .eq("cartId", cart.id);

  if (error) {
    throw error;
  }

  return {
    id: cart.id,
    items: cartItems.map((item) => ({
      quantity: item.quantity,
      product: item.product,
    })),
  };
};

// GET /cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await getCartData(userId);

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);

    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// POST /cart/items
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userName = req.user.name;

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await getOrCreateCart(userId);

    const { data: existingItem, error: existingError } = await supabase
      .from("cart_item")
      .select("quantity")
      .eq("cartId", cart.id)
      .eq("productId", Number(productId))
      .maybeSingle();

    if (existingError) {
      return res.status(500).json({
        message: existingError.message,
      });
    }

    const newQuantity = existingItem
      ? existingItem.quantity + Number(quantity)
      : Number(quantity);

    const { error: upsertError } = await supabase.from("cart_item").upsert(
      {
        cartId: cart.id,
        productId: Number(productId),
        quantity: newQuantity,
      },
      {
        onConflict: "cartId,productId",
      },
    );

    if (upsertError) {
      return res.status(500).json({
        message: upsertError.message,
      });
    }

    await logActivity({
      userId,
      userName,
      action: "ADD_TO_CART",
      targetType: "PRODUCT",
      targetId: String(productId),
      details: {
        quantityAdded: Number(quantity),
        newQuantity,
      },
    });

    const updatedCart = await getCartData(userId);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);

    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// PUT /cart/items/:productId
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userName = req.user.name;

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await getOrCreateCart(userId);

    const { error } = await supabase
      .from("cart_item")
      .update({
        quantity: Number(quantity),
      })
      .eq("cartId", cart.id)
      .eq("productId", Number(productId));

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    await logActivity({
      userId,
      userName,
      action: "UPDATE_CART",
      targetType: "PRODUCT",
      targetId: String(productId),
      details: {
        quantity: Number(quantity),
      },
    });

    const updatedCart = await getCartData(userId);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);

    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// DELETE /cart/items/:productId
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userName = req.user.name;

    const { productId } = req.params;

    const cart = await getOrCreateCart(userId);

    const { error } = await supabase
      .from("cart_item")
      .delete()
      .eq("cartId", cart.id)
      .eq("productId", Number(productId));

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    await logActivity({
      userId,
      userName,
      action: "REMOVE_FROM_CART",
      targetType: "PRODUCT",
      targetId: String(productId),
    });

    const updatedCart = await getCartData(userId);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error removing from cart:", error);

    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// DELETE /cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userName = req.user.name;

    const cart = await getOrCreateCart(userId);

    const { error } = await supabase
      .from("cart_item")
      .delete()
      .eq("cartId", cart.id);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    await logActivity({
      userId,
      userName,
      action: "CLEAR_CART",
      targetType: "CART",
      targetId: String(cart.id),
    });

    const updatedCart = await getCartData(userId);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error clearing cart:", error);

    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
