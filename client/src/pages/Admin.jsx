import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../assets/Admin.css";

function Admin() {
  const [products, setProducts] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [activeTab, setActiveTab] = useState("products");

  const [productPage, setProductPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);

  const productsPerPage = 6;
  const logsPerPage = 10;

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
  });

  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");

      setProducts(response.data);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to load products.");
    }
  };

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      const response = await api.get("/activity-logs?limit=500");

      setActivityLogs(response.data);
    } catch (error) {
      console.error(
        "Error fetching activity logs:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to load activity logs.",
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchActivityLogs();
  }, []);

  // Handle add product inputs
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // Handle edit inputs
  const handleEditChange = (e) => {
    setEditProduct({
      ...editProduct,
      [e.target.name]: e.target.value,
    });
  };

  // Add product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/products", {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        image_url: product.image_url,
        category: product.category,
      });

      setProducts((currentProducts) => [...currentProducts, response.data]);

      setProduct({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category: "",
      });

      setShowAddProduct(false);
      setProductPage(1);

      toast.success("Product added successfully!");

      await fetchActivityLogs();
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to add product.");
    }
  };

  // Start editing
  const startEdit = (product) => {
    setEditingProductId(product.id);

    setEditProduct({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category: "",
    });
  };

  // Save edit
  const handleSaveEdit = async (product) => {
    try {
      const updates = {};

      if (editProduct.name.trim() !== "") {
        updates.name = editProduct.name;
      }

      if (editProduct.description.trim() !== "") {
        updates.description = editProduct.description;
      }

      if (editProduct.price.trim() !== "") {
        updates.price = Number(editProduct.price);
      }

      if (editProduct.image_url.trim() !== "") {
        updates.image_url = editProduct.image_url;
      }

      if (editProduct.category !== "") {
        updates.category = editProduct.category;
      }

      if (Object.keys(updates).length === 0) {
        setEditingProductId(null);
        return;
      }

      const response = await api.put(`/products/${product.id}`, updates);

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id ? response.data : item,
        ),
      );

      setEditingProductId(null);

      setEditProduct({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category: "",
      });

      toast.success("Product updated successfully!");

      await fetchActivityLogs();
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to update product.");
    }
  };

  // Delete product
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${product.id}`);

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== product.id),
      );

      toast.success("Product deleted successfully!");

      await fetchActivityLogs();

      // Prevent staying on a page that no longer exists
      const newTotalPages = Math.ceil((products.length - 1) / productsPerPage);

      if (newTotalPages > 0 && productPage > newTotalPages) {
        setProductPage(newTotalPages);
      }
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to delete product.");
    }
  };

  // Product pagination
  const totalProductPages = Math.ceil(products.length / productsPerPage);

  const productStartIndex = (productPage - 1) * productsPerPage;

  const paginatedProducts = products.slice(
    productStartIndex,
    productStartIndex + productsPerPage,
  );

  // Activity pagination
  const totalActivityPages = Math.ceil(activityLogs.length / logsPerPage);

  const activityStartIndex = (activityPage - 1) * logsPerPage;

  const paginatedActivityLogs = activityLogs.slice(
    activityStartIndex,
    activityStartIndex + logsPerPage,
  );

  const gameCount = products.filter(
    (product) => product.category === "games",
  ).length;

  const merchCount = products.filter(
    (product) => product.category === "merch",
  ).length;

  const otherCount = products.filter(
    (product) => !["games", "merch"].includes(product.category),
  ).length;

  return (
    <div className="admin-page">
      {/* Header */}
      <section className="admin-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION</p>

          <h1>Control Center</h1>

          <p>Manage products and monitor site activity.</p>
        </div>

        {activeTab === "products" && (
          <button
            className="admin-add-button"
            onClick={() => setShowAddProduct(true)}
          >
            + Add Product
          </button>
        )}
      </section>

      {/* Stats */}
      <section className="admin-stats">
        <div className="admin-stat-card">
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Games</span>
          <strong>{gameCount}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Merch</span>
          <strong>{merchCount}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Other</span>
          <strong>{otherCount}</strong>
        </div>
      </section>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={
            activeTab === "products" ? "admin-tab active" : "admin-tab"
          }
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>

        <button
          className={
            activeTab === "activity" ? "admin-tab active" : "admin-tab"
          }
          onClick={() => setActiveTab("activity")}
        >
          Activity Logs
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <section className="admin-products">
          <div className="admin-section-header">
            <div>
              <p className="admin-eyebrow">INVENTORY</p>

              <h2>Products</h2>
            </div>

            <span>
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="admin-product-list">
            {paginatedProducts.length === 0 ? (
              <div className="admin-empty">
                <h3>No products yet</h3>

                <p>Add your first product to get started.</p>
              </div>
            ) : (
              paginatedProducts.map((product) => (
                <div className="admin-product-card" key={product.id}>
                  {editingProductId === product.id ? (
                    <div className="admin-edit-layout">
                      <div className="admin-product-preview">
                        <img src={product.image_url} alt={product.name} />
                      </div>

                      <div className="admin-edit-form">
                        <div className="form-group">
                          <label htmlFor={`name-${product.id}`}>Name</label>

                          <input
                            id={`name-${product.id}`}
                            type="text"
                            name="name"
                            placeholder={product.name}
                            value={editProduct.name}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`description-${product.id}`}>
                            Description
                          </label>

                          <textarea
                            id={`description-${product.id}`}
                            name="description"
                            placeholder={product.description}
                            value={editProduct.description}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor={`price-${product.id}`}>Price</label>

                            <input
                              id={`price-${product.id}`}
                              type="number"
                              name="price"
                              placeholder={product.price}
                              value={editProduct.price}
                              onChange={handleEditChange}
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor={`category-${product.id}`}>
                              Category
                            </label>

                            <select
                              id={`category-${product.id}`}
                              name="category"
                              value={editProduct.category}
                              onChange={handleEditChange}
                            >
                              <option value="">Keep current</option>

                              <option value="games">Games</option>

                              <option value="merch">Merch</option>

                              <option value="devices">Devices</option>

                              <option value="accessories">Accessories</option>

                              <option value="passes">Passes</option>

                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor={`image-${product.id}`}>
                            Image URL
                          </label>

                          <input
                            id={`image-${product.id}`}
                            type="text"
                            name="image_url"
                            placeholder={product.image_url}
                            value={editProduct.image_url}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className="admin-edit-actions">
                          <button
                            className="save-button"
                            onClick={() => handleSaveEdit(product)}
                          >
                            Save Changes
                          </button>

                          <button
                            className="cancel-button"
                            onClick={() => setEditingProductId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-product-layout">
                      <div className="admin-product-image">
                        <img src={product.image_url} alt={product.name} />
                      </div>

                      <div className="admin-product-info">
                        <span className="admin-category">
                          {product.category}
                        </span>

                        <h3>{product.name}</h3>

                        <p>{product.description}</p>
                      </div>

                      <div className="admin-product-price">
                        <span>Price</span>

                        <strong>{product.price}</strong>
                      </div>

                      <div className="admin-product-actions">
                        <button
                          className="edit-button"
                          onClick={() => startEdit(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(product)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Product pagination */}
          {totalProductPages > 1 && (
            <div className="admin-pagination">
              <button
                onClick={() => setProductPage((page) => page - 1)}
                disabled={productPage === 1}
              >
                ←
              </button>

              {Array.from(
                {
                  length: totalProductPages,
                },
                (_, index) => (
                  <button
                    key={index + 1}
                    className={productPage === index + 1 ? "active" : ""}
                    onClick={() => setProductPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ),
              )}

              <button
                onClick={() => setProductPage((page) => page + 1)}
                disabled={productPage === totalProductPages}
              >
                →
              </button>
            </div>
          )}
        </section>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <section className="activity-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-eyebrow">SYSTEM</p>

              <h2>Activity Logs</h2>
            </div>

            <button
              className="refresh-logs-button"
              onClick={async () => {
                await fetchActivityLogs();
                setActivityPage(1);
              }}
            >
              Refresh
            </button>
          </div>

          <div className="activity-list">
            {paginatedActivityLogs.length === 0 ? (
              <div className="admin-empty">
                <h3>No activity yet</h3>

                <p>Site activity will appear here.</p>
              </div>
            ) : (
              paginatedActivityLogs.map((log) => (
                <div className="activity-item" key={log._id}>
                  <div className="activity-main">
                    <div className="activity-action">
                      <strong>{log.userName || "Unknown User"}</strong>

                      <span className="activity-action-name">{log.action}</span>
                    </div>

                    {log.targetType && (
                      <p className="activity-target">
                        {log.targetType}

                        {log.targetId ? ` #${log.targetId}` : ""}
                      </p>
                    )}
                  </div>

                  <div className="activity-time">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Activity pagination */}
          {totalActivityPages > 1 && (
            <div className="admin-pagination">
              <button
                onClick={() => setActivityPage((page) => page - 1)}
                disabled={activityPage === 1}
              >
                ←
              </button>

              {Array.from(
                {
                  length: totalActivityPages,
                },
                (_, index) => (
                  <button
                    key={index + 1}
                    className={activityPage === index + 1 ? "active" : ""}
                    onClick={() => setActivityPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ),
              )}

              <button
                onClick={() => setActivityPage((page) => page + 1)}
                disabled={activityPage === totalActivityPages}
              >
                →
              </button>
            </div>
          )}
        </section>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div
          className="admin-modal-overlay"
          onClick={() => setShowAddProduct(false)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <p className="admin-eyebrow">INVENTORY</p>

                <h2>Add Product</h2>
              </div>

              <button
                className="admin-modal-close"
                onClick={() => setShowAddProduct(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="new-product-name">Product Name</label>

                <input
                  id="new-product-name"
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-product-description">Description</label>

                <textarea
                  id="new-product-description"
                  name="description"
                  placeholder="Describe the product..."
                  value={product.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="new-product-price">Price</label>

                  <input
                    id="new-product-price"
                    type="number"
                    name="price"
                    placeholder="0"
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new-product-category">Category</label>

                  <select
                    id="new-product-category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>

                    <option value="games">Games</option>

                    <option value="merch">Merch</option>

                    <option value="devices">Devices</option>

                    <option value="accessories">Accessories</option>

                    <option value="passes">Passes</option>

                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="new-product-image">Image URL</label>

                <input
                  id="new-product-image"
                  type="text"
                  name="image_url"
                  placeholder="https://..."
                  value={product.image_url}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="admin-modal-submit" type="submit">
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
