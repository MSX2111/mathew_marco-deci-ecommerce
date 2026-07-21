import prisma from "../utils/prismClient.js";
import logActivity from "../utils/logger.js";

async function findProducts(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const category = req.query.category || "";
    const limit = 4;
    const skip = (page - 1) * limit;

    let findManyQuery = { skip, take: limit };
    let countQuery = {};

    if (category && category.trim() !== "") {
      const whereClause = { category: category };
      findManyQuery.where = whereClause;
      countQuery.where = whereClause;
    }

    const [products, totalCount] = await prisma.$transaction([
      prisma.Products.findMany(findManyQuery),
      prisma.Products.count(countQuery),
    ]);

    return res.status(200).json({ products, totalCount });
  } catch (error) {
    console.error("Database Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findSingleProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.Products.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product record not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Database Fetch Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, price, imageURL, category } = req.body;
    const activeUserId = req.headers["x-user-id"] || 0;

    const product = await prisma.Products.create({
      data: { name, description, price: Number(price), imageURL, category },
    });

    await logActivity({
      userId: activeUserId,
      action: "PRODUCT_CREATE",
      entityId: product.id,
      details: { name, price: Number(price), category },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, imageURL, category } = req.body;
    const activeUserId = req.headers["x-user-id"] || 0;

    const updatedProduct = await prisma.Products.update({
      where: { id: Number(id) },
      data: { name, description, price: Number(price), imageURL, category },
    });

    await logActivity({
      userId: activeUserId,
      action: "PRODUCT_UPDATE",
      entityId: id,
      details: { updatedData: { name, price, category } },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const activeUserId = req.headers["x-user-id"] || 0;

    await prisma.Products.delete({ where: { id: Number(id) } });

    await logActivity({
      userId: activeUserId,
      action: "PRODUCT_DELETE",
      entityId: id,
    });

    return res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default {
  findProducts,
  findSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
