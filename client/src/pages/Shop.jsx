import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../assets/Shop.css";

function Shop() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

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
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search + category filter
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);

      case "name-desc":
        return b.name.localeCompare(a.name);

      case "price-asc":
        return a.price - b.price;

      case "price-desc":
        return b.price - a.price;

      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  return (
    <div className="shop-page">
      {/* Header */}
      <section className="shop-header">
        <div>
          <p className="shop-eyebrow">WELCOME TO THE STORE</p>

          <h1>Find Your Next Favorite</h1>

          <p className="shop-description">
            Browse games, gear, accessories, merch, and more.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="shop-toolbar">
        <div className="search-wrapper">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Categories</option>
            <option value="games">Games</option>
            <option value="merch">Merch</option>
            <option value="devices">Devices</option>
            <option value="accessories">Accessories</option>
            <option value="passes">Passes</option>
            <option value="other">Other</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="products-header">
          <h2>Products</h2>

          <span>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </span>
        </div>

        <div className="products-grid">
          {paginatedProducts.length === 0 ? (
            <div className="empty-products">
              <h3>No products found</h3>

              <p>Try changing your search or category filter.</p>
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <div
                className="product-card"
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="product-image-wrapper">
                  <img src={product.image_url} alt={product.name} />
                </div>

                <div className="product-content">
                  <div>
                    <span className="product-category">{product.category}</span>

                    <h3>{product.name}</h3>

                    <p className="product-description">{product.description}</p>
                  </div>

                  <div className="product-bottom">
                    <strong>{product.price}</strong>

                    <span className="view-product">View →</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Shop;
