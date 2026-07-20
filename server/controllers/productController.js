import prisma from "../utils/prismaClient.js";

async function findProducts(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const category = req.query.category || "";
    const limit = 4;
    const skip = (page - 1) * limit;

    // 1. Build basic execution query blocks
    let findManyQuery = { skip, take: limit };
    let countQuery = {};

    // 2. Only inject the filter key if a category value is present
    if (category && category.trim() !== "") {
      const whereClause = { category: category };
      findManyQuery.where = whereClause;
      countQuery.where = whereClause;
    }

    // 3. Request exactly 4 rows along with total items filtered by this criteria
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

async function createProduct(req, res) {
  try {
    // Destructuring to ensure clean data validation types matching schema
    const { name, description, price, imageURL, category } = req.body;

    const product = await prisma.Products.create({
      data: {
        name,
        description,
        price: Number(price), // Enforces Integer type
        imageURL,
        category,
      },
    });
    return res.status(201).json(product);
  } catch (error) {
    console.error("Database Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// 1. UPDATE PRODUCT FUNCTION LOGIC
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, imageURL, category } = req.body;

    const updatedProduct = await prisma.Products.update({
      where: {
        id: Number(id), // Converts string parameter "id" into Int type
      },
      data: {
        name,
        description,
        price: Number(price), // Enforces Integer type
        imageURL,
        category,
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Database Error:", error.message);

    // Fallback if item is not found in database record rows
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product record not found" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

// 2. DELETE PRODUCT FUNCTION LOGIC
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    await prisma.Products.delete({
      where: {
        id: Number(id), // Converts string parameter "id" into Int type
      },
    });

    return res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    console.error("Database Error:", error.message);

    // Fallback if item is not found in database record rows
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product record not found" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findSingleProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.Products.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Database Fetch Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default {
  findProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findSingleProduct,
};
