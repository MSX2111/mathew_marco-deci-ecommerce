import prisma from "../utils/prismaClient.js";
import logActivity from "../utils/logger.js";
import {
  parseUserId,
  jsonError,
  buildUpdatePayload,
  toNumber,
} from "../utils/http.js";

const PRODUCT_FIELDS = ["name", "description", "price", "imageURL", "category"];

async function findProducts(req, res) {
  const page = Math.max(toNumber(req.query.page, 1), 1);
  const category = (req.query.category || "").trim();
  const limit = 4;
  const skip = (page - 1) * limit;
  const where = category ? { category } : undefined;

  const [products, totalCount] = await prisma.$transaction([
    prisma.Products.findMany({ skip, take: limit, where }),
    prisma.Products.count({ where }),
  ]);

  return res.status(200).json({ products, totalCount });
}

async function findSingleProduct(req, res) {
  const product = await prisma.Products.findUnique({
    where: { id: toNumber(req.params.id) },
  });

  if (!product) {
    return jsonError(res, "Product record not found", 404);
  }

  return res.status(200).json(product);
}

async function createProduct(req, res) {
  const payload = buildUpdatePayload(req.body, PRODUCT_FIELDS);
  if (payload.price !== undefined) payload.price = toNumber(payload.price);

  const product = await prisma.Products.create({ data: payload });
  await logActivity({
    userId: parseUserId(req),
    action: "PRODUCT_CREATE",
    entityId: product.id,
    details: payload,
  });

  return res.status(201).json(product);
}

async function updateProduct(req, res) {
  const payload = buildUpdatePayload(req.body, PRODUCT_FIELDS);
  if (payload.price !== undefined) payload.price = toNumber(payload.price);

  const updatedProduct = await prisma.Products.update({
    where: { id: toNumber(req.params.id) },
    data: payload,
  });

  await logActivity({
    userId: parseUserId(req),
    action: "PRODUCT_UPDATE",
    entityId: req.params.id,
    details: { updatedData: payload },
  });

  return res.status(200).json(updatedProduct);
}

async function deleteProduct(req, res) {
  await prisma.Products.delete({
    where: { id: toNumber(req.params.id) },
  });

  await logActivity({
    userId: parseUserId(req),
    action: "PRODUCT_DELETE",
    entityId: req.params.id,
  });

  return res.status(200).json({ message: "Product successfully deleted" });
}

export default {
  findProducts,
  findSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
