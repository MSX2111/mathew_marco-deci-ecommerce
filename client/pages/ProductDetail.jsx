import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../axios/axiosInstance";

const ProductDetail = () => {
  const { id } = useParams(); // Extracts the integer ID directly from the URL link string
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true);
        // Hits your working backend route path handler: router.get("/:id", ...)
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error loading product record details:", err);
        setError("Product not found or database record entry is missing.");
      } finally {
        setLoading(false);
      }
    }
    fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      // Hits your new backend router POST /cart/add
      await api.post("/cart", { productId: id });
      alert("Product added to your cart successfully!");
      navigate("/store"); // Optional redirect back to catalog
    } catch (error) {
      console.error("Failed to append item to cart:", error);
      alert("Could not add item to cart.");
    }
  };

  if (loading)
    return (
      <>
        <NavBar />
        <div>Loading product details...</div>
      </>
    );
  if (error)
    return (
      <>
        <NavBar />
        <div>
          <p>{error}</p>
          <button onClick={() => navigate("/store")}>Back to Store</button>
        </div>
      </>
    );
  if (!product) return null;

  return (
    <>
      <NavBar />
      <div className="product-detail-view-container">
        <button
          onClick={() => navigate("/store")}
          className="back-to-catalog-btn"
        >
          &larr; Back to Catalog
        </button>

        <div className="product-detail-layout-card">
          <img
            src={product.imageURL}
            alt={product.name}
            className="detail-hero-image"
          />

          <div className="product-info-column">
            <h1>{product.name}</h1>
            <p className="product-category-tag">
              Category: <span>{product.category}</span>
            </p>
            <p className="product-price-label">Price: ${product.price}</p>
            <p className="product-description-body">{product.description}</p>

            <button
              onClick={handleAddToCart}
              className="add-to-cart-action-btn"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
