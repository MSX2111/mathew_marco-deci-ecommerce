import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../axios/axiosInstance";

const Admin = () => {
  // Product Catalog Management State
  const [products, setProducts] = useState([]);
  const [productPage, setProductPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // NEW: MongoDB System Logging Pagination States
  const [logs, setLogs] = useState([]);
  const [logPage, setLogPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageURL: "",
    category: "",
  });

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const ITEMS_PER_PAGE = 4;
  const LOGS_PER_PAGE = 20;

  // Effect 1: Fetches Product items from PostgreSQL database via Prisma
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/products", {
          params: { page: productPage },
        });
        setProducts(response.data.products || []);
        setTotalProducts(response.data.totalCount || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [productPage, refreshTrigger]);

  // Effect 2: NEW - Fetches paginated activity log records from MongoDB via Mongoose
  useEffect(() => {
    async function fetchActivityLogs() {
      try {
        const response = await api.get("/admin/logs", {
          params: { page: logPage },
        });
        setLogs(response.data.logs || []);
        setTotalLogs(response.data.totalCount || 0);
      } catch (error) {
        console.error("Error loading system activity metrics:", error);
      }
    }
    if (isAdmin) fetchActivityLogs();
  }, [logPage, refreshTrigger]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      imageURL: product.imageURL,
      category: product.category,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, newProduct);
      } else {
        await api.post("/products", newProduct);
      }
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        imageURL: "",
        category: "",
      });
      setEditingProductId(null);
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        setRefreshTrigger((prev) => !prev);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      imageURL: "",
      category: "",
    });
    setEditingProductId(null);
  };

  // Math conversions for catalog page structures
  const totalProductPages = Math.ceil(totalProducts / ITEMS_PER_PAGE) || 1;
  const productPageNumbers = Array.from(
    { length: totalProductPages },
    (_, i) => i + 1,
  );

  // NEW: Math conversions for system logs view structure
  const totalLogPages = Math.ceil(totalLogs / LOGS_PER_PAGE) || 1;
  const logPageNumbers = Array.from({ length: totalLogPages }, (_, i) => i + 1);

  if (!isAdmin) {
    return (
      <>
        <NavBar />
        <div>
          <h2>Access Denied</h2>
          <p>
            You do not have the required permissions to view this dashboard
            page.
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <NavBar />
      <div>
        <h2>Admin Management Dashboard</h2>

        {/* SECTION 1: CATALOG MODIFICATION ENTRY FORM */}
        <div className="admin-form-container">
          <h3>
            {editingProductId
              ? "Modify Product Catalog Item"
              : "Create New Inventory Entry"}
          </h3>
          <form onSubmit={handleSubmit}>
            <label>
              Product Name:
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Category:
              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="computers">Computers</option>
                <option value="phones">Phones</option>
                <option value="accessories">Accessories</option>
              </select>
            </label>

            <label>
              Description:
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Price ($):
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
                min="0"
              />
            </label>

            <label>
              Image URL:
              <input
                type="url"
                name="imageURL"
                value={newProduct.imageURL}
                onChange={handleInputChange}
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit">
                {editingProductId ? "Update Product" : "Save Product"}
              </button>
              {editingProductId && (
                <button type="button" onClick={handleCancelEdit}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SECTION 2: ACTIVE INVENTORY LIST SHELF */}
        <h3>Active Catalog Inventory</h3>
        <div className="admin-product-list-table">
          {products.map((product) => (
            <div key={product.id} className="admin-product-row-item">
              <img
                src={product.imageURL}
                alt={product.name}
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <div>
                <h4>{product.name}</h4>
                <p>
                  Category: {product.category} | Price: ${product.price}
                </p>
              </div>
              <div className="admin-row-action-buttons">
                <button onClick={() => handleEditClick(product)}>Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product List Slicing controls */}
        <div className="pagination-controls">
          <button
            onClick={() => setProductPage((p) => Math.max(p - 1, 1))}
            disabled={productPage === 1}
          >
            Prev
          </button>
          {productPageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setProductPage(num)}
              className={productPage === num ? "active-page" : ""}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() =>
              setProductPage((p) => Math.min(p + 1, totalProductPages))
            }
            disabled={productPage === totalProductPages}
          >
            Next
          </button>
        </div>

        {/* NEW SECTION 3: MONGODB AUDIT ACTIVITY LOGS MATRIX */}
        <div
          className="admin-audit-logs-section"
          style={{
            marginTop: "50px",
            paddingTop: "30px",
            borderTop: "2px dashed #ccc",
          }}
        >
          <h3>System Activity Audit Trails (MongoDB)</h3>

          <div className="logs-table-wrapper" style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f4f4f4",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  <th style={{ padding: "10px" }}>Timestamp</th>
                  <th style={{ padding: "10px" }}>Operator ID</th>
                  <th style={{ padding: "10px" }}>Action Event</th>
                  <th style={{ padding: "10px" }}>Entity Identifier</th>
                  <th style={{ padding: "10px" }}>
                    Metadata Parameters Payload
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ padding: "15px", textAlign: "center" }}
                    >
                      No logs recorded in the system database yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "10px", fontSize: "13px" }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {log.userId === 0 ? "Guest/Anon" : `UID: ${log.userId}`}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span
                          className={`log-badge-${log.action.toLowerCase()}`}
                          style={{ fontWeight: "bold" }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: "10px", fontSize: "13px" }}>
                        {log.entityId}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Dedicated Logging Slicing Pagination Controls Panel Row */}
          <div className="pagination-controls" style={{ marginTop: "20px" }}>
            <button
              onClick={() => setLogPage((p) => Math.max(p - 1, 1))}
              disabled={logPage === 1}
            >
              &laquo; Previous Logs
            </button>
            {logPageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => setLogPage(num)}
                className={logPage === num ? "active-page" : ""}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setLogPage((p) => Math.min(p + 1, totalLogPages))}
              disabled={logPage === totalLogPages}
            >
              Next Logs &raquo;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
