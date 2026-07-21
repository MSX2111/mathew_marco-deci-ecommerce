import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../axios/axiosInstance";

const Admin = () => {
  
  const [products, setProducts] = useState([]);
  const [productPage, setProductPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  
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

  
  const totalProductPages = Math.ceil(totalProducts / ITEMS_PER_PAGE) || 1;
  const productPageNumbers = Array.from(
    { length: totalProductPages },
    (_, i) => i + 1,
  );

  
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
      <div className="page-shell admin-page">
        <h1 className="page-heading">Admin Management Dashboard</h1>

        {}
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
              <button type="submit" className="btn btn-primary">
                {editingProductId ? "Update Product" : "Save Product"}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {}
        <h3>Active Catalog Inventory</h3>
        <div className="admin-product-list-table">
          {products.map((product) => (
            <div key={product.id} className="admin-product-row-item">
              <img
                src={product.imageURL}
                alt={product.name}
                className="admin-product-image"
              />
              <div>
                <h4>{product.name}</h4>
                <p>
                  Category: {product.category} | Price: ${product.price}
                </p>
              </div>
              <div className="admin-row-action-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="pagination-controls">
          <button
            className="btn btn-secondary"
            onClick={() => setProductPage((p) => Math.max(p - 1, 1))}
            disabled={productPage === 1}
          >
            Prev
          </button>
          {productPageNumbers.map((num) => (
            <button
              key={num}
              className={`btn ${productPage === num ? "active-page" : "btn-secondary"}`}
              onClick={() => setProductPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="btn btn-secondary"
            onClick={() =>
              setProductPage((p) => Math.min(p + 1, totalProductPages))
            }
            disabled={productPage === totalProductPages}
          >
            Next
          </button>
        </div>

        {}
        <div className="admin-audit-logs-section">
          <h3>System Activity Audit Trails (MongoDB)</h3>

          <div className="logs-table-wrapper">
            <table className="admin-logs-table">
              <thead>
                <tr className="admin-logs-header-row">
                  <th className="admin-logs-cell">Timestamp</th>
                  <th className="admin-logs-cell">Operator ID</th>
                  <th className="admin-logs-cell">Action Event</th>
                  <th className="admin-logs-cell">Entity Identifier</th>
                  <th className="admin-logs-cell">
                    Metadata Parameters Payload
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td className="admin-logs-empty" colSpan="5">
                      No logs recorded in the system database yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="admin-log-row">
                      <td className="admin-logs-cell admin-logs-small">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="admin-logs-cell">
                        {log.userId === 0 ? "Guest/Anon" : `UID: ${log.userId}`}
                      </td>
                      <td className="admin-logs-cell">
                        <span className="log-badge">{log.action}</span>
                      </td>
                      <td className="admin-logs-cell admin-logs-small">
                        {log.entityId}
                      </td>
                      <td className="admin-logs-cell admin-logs-detail">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {}
          <div className="pagination-controls admin-logs-pagination">
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
