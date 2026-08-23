import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../assets/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, reviewsResponse] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`),
        ]);

        setProduct(productResponse.data);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error(
          "Error loading product:",
          error.response?.data || error.message,
        );

        toast.error(error.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/items", {
        productId: Number(product.id),
        quantity: 1,
      });

      toast.success("Product added to cart!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart.",
      );
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/reviews", {
        productId: Number(product.id),
        rating,
        comment,
      });

      setReviews((currentReviews) => [response.data, ...currentReviews]);

      setRating(5);
      setComment("");

      toast.success("Review added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review.");
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="product-loading">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="product-not-found">
          <h1>Product Not Found</h1>

          <button onClick={() => navigate("/shop")}>Back to Shop</button>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="product-details-page">
      <button className="back-button" onClick={() => navigate("/shop")}>
        ← Back to Shop
      </button>

      <div className="product-details-card">
        <div className="product-details-image">
          <img src={product.image_url} alt={product.name} />
        </div>

        <div className="product-details-content">
          <span className="product-details-category">{product.category}</span>

          <h1>{product.name}</h1>

          <p className="product-details-description">{product.description}</p>

          {averageRating && (
            <div className="product-rating">
              <span>★</span>
              <strong>{averageRating}</strong>
              <span>
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <div className="product-details-divider"></div>

          <div className="product-details-bottom">
            <div>
              <span className="price-label">Price</span>

              <strong className="product-details-price">{product.price}</strong>
            </div>

            <button className="add-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <div className="reviews-header">
          <div>
            <p className="reviews-eyebrow">COMMUNITY</p>

            <h2>Reviews</h2>
          </div>
        </div>

        <form className="review-form" onSubmit={handleAddReview}>
          <h3>Leave a Review</h3>

          <label>Rating</label>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>★★★★★</option>
            <option value={4}>★★★★☆</option>
            <option value={3}>★★★☆☆</option>
            <option value={2}>★★☆☆☆</option>
            <option value={1}>★☆☆☆☆</option>
          </select>

          <textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <button type="submit">Submit Review</button>
        </form>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <h3>No reviews yet</h3>
              <p>Be the first person to review this product.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div className="review-card" key={review._id}>
                <div className="review-top">
                  <strong>{review.userName}</strong>

                  <span>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <p>{review.comment}</p>

                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
