import supabase from "../config/supabase.js";
import logActivity from "../utils/activityLogger.js";

export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, category } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !image_url ||
      !category
    ) {
      return res.status(400).json({
        message: "All product fields are required",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price: Number(price),
          image_url,
          category,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    await logActivity({
      userId: req.user.userId,
      userName: req.user.name,
      action: "CREATE_PRODUCT",
      targetType: "PRODUCT",
      targetId: String(data.id),
      details: {
        name: data.name,
        price: data.price,
        category: data.category,
      },
    });

    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};

    if (req.body.name !== undefined && req.body.name.trim() !== "") {
      updates.name = req.body.name;
    }

    if (
      req.body.description !== undefined &&
      req.body.description.trim() !== ""
    ) {
      updates.description = req.body.description;
    }

    if (req.body.price !== undefined && req.body.price !== "") {
      updates.price = Number(req.body.price);
    }

    if (req.body.image_url !== undefined && req.body.image_url.trim() !== "") {
      updates.image_url = req.body.image_url;
    }

    if (req.body.category !== undefined && req.body.category !== "") {
      updates.category = req.body.category;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No changes provided",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await logActivity({
      userId: req.user.userId,
      userName: req.user.name,
      action: "UPDATE_PRODUCT",
      targetType: "PRODUCT",
      targetId: String(id),
      details: {
        changes: updates,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await logActivity({
      userId: req.user.userId,
      userName: req.user.name,
      action: "DELETE_PRODUCT",
      targetType: "PRODUCT",
      targetId: String(id),
      details: {
        name: data.name,
      },
    });

    res.status(200).json({
      message: "Product deleted successfully",
      product: data,
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
