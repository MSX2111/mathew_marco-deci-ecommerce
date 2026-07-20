import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate hook
import NavBar from "../components/NavBar";
import api from "../axios/axiosInstance";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate(); // Initialize navigation router helper

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
          params: {
            page: currentPage,
            category: selectedCategory,
          },
        });
        setProducts(response.data.products || []);
        setTotalCount(response.data.totalCount || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [currentPage, selectedCategory, refreshTrigger]);

  const handleCategoryFilterChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleEditClick = (e, product) => {
    e.stopPropagation();
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

  const handleDeleteProduct = async (e, id) => {
    e.stopPropagation();
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

  const displayedProducts = [...products]
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
      if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <>
      <NavBar />
      <div>
        <h2>Store Products</h2>

        {isAdmin && (
          <div className="admin-form-container">
            <h3>
              {editingProductId ? "Modify Product" : "Create New Product"}
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
        )}

        <div className="store-controls-bar">
          <div className="search-container">
            <label htmlFor="store-search">Search Products: </label>
            <input
              id="store-search"
              type="text"
              placeholder="Type a product name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filter-container">
            <label htmlFor="category-filter">Filter by Category: </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryFilterChange}
            >
              <option value="">All Categories</option>
              <option value="computers">Computers</option>
              <option value="phones">Phones</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div className="sort-container">
            <label htmlFor="price-sort">Sort Page Items: </label>
            <select
              id="price-sort"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="">Default Order</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {displayedProducts.length === 0 ? (
            <p>No products found matching your criteria.</p>
          ) : (
            displayedProducts.map((product) => (
              /* Modified card to push dynamic navigate requests to the router */
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={product.imageURL} alt={product.name} />
                <h3>{product.name}</h3>
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                <p>{product.description}</p>
                <span>${product.price}</span>

                {isAdmin && (
                  <div className="admin-actions">
                    <button onClick={(e) => handleEditClick(e, product)}>
                      Edit
                    </button>
                    <button onClick={(e) => handleDeleteProduct(e, product.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
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

export default Store;
