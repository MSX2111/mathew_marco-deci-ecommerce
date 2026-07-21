import prisma from "../utils/prismaClient.js";
import logActivity from "../utils/logger.js";
import { parseUserId, jsonError, toNumber } from "../utils/http.js";

async function getCart(req, res) {
  const userId = parseUserId(req);
  if (!userId)
    return jsonError(res, "User identity required to pull cart", 401);

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
  });

  return res.status(200).json(cart ?? { items: [] });
}

async function addToCart(req, res) {
  const userId = parseUserId(req);
  if (!userId) return jsonError(res, "User identity required", 401);

  const productId = toNumber(req.body.productId);
  const cart =
    (await prisma.cart.findUnique({ where: { userId } })) ||
    (await prisma.cart.create({ data: { userId } }));

  const cartItem = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: { increment: 1 } },
    create: { cartId: cart.id, productId, quantity: 1 },
  });

  await logActivity({
    userId,
    action: "CART_ADD_ITEM",
    entityId: productId,
    details: { cartId: cart.id },
  });

  return res.status(200).json({ message: "Item added to cart", cartItem });
}

async function updateQuantity(req, res) {
  const userId = parseUserId(req);
  const cartId = toNumber(req.body.cartId);
  const productId = toNumber(req.body.productId);
  const quantity = toNumber(req.body.quantity);

  await prisma.cartItem.update({
    where: { cartId_productId: { cartId, productId } },
    data: { quantity },
  });

  await logActivity({
    userId,
    action: "CART_UPDATE_QTY",
    entityId: productId,
    details: { cartId, targetQuantity: quantity },
  });

  return res.status(200).json({ message: "Quantity updated" });
}

async function removeItem(req, res) {
  const userId = parseUserId(req);
  const cartId = toNumber(req.body.cartId);
  const productId = toNumber(req.body.productId);

  await prisma.cartItem.delete({
    where: { cartId_productId: { cartId, productId } },
  });

  await logActivity({
    userId,
    action: "CART_REMOVE_ITEM",
    entityId: productId,
    details: { cartId },
  });

  return res.status(200).json({ message: "Item removed from cart" });
}

export default { getCart, addToCart, updateQuantity, removeItem };
