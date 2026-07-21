import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../axios/axiosInstance";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageURL: "",
    category: "",
  });

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/products", {
          params: { page: currentPage },
        });
        setProducts(response.data.products || []);
        setTotalCount(response.data.totalCount || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [currentPage, refreshTrigger]);

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

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <NavBar />
      <div>
        <h2>Admin Management Dashboard</h2>

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

        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={currentPage === num ? "active-page" : ""}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Admin;
