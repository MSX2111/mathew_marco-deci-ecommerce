import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../axios/axiosInstance";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState("");
  const [newComment, setNewComment] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    async function fetchProductAndReviews() {
      try {
        setLoading(true);
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/${id}`),
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Error loading product layout:", err);
        setError("Product not found or database record entry is missing.");
      } finally {
        setLoading(false);
      }
    }
    fetchProductAndReviews();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post("/cart", { productId: id });
      alert("Product added to your cart successfully!");
    } catch (error) {
      console.error("Failed to append item to cart:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/reviews", {
        productId: id,
        username: username,
        comment: newComment,
      });
      setReviews((prev) => [response.data, ...prev]);
      setNewComment("");
      setUsername("");
    } catch (error) {
      console.error("Failed to transmit review payload:", error);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditedCommentText(review.comment);
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, {
        comment: editedCommentText,
      });
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? response.data : r)),
      );
      setEditingReviewId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("Failed to modify target review on MongoDB:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this comment?",
      )
    ) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } catch (error) {
        console.error("Failed to drop target document from MongoDB:", error);
      }
    }
  };
  if (loading)
    return (
      <>
        <NavBar />
        <div>Loading details...</div>
      </>
    );
  if (error)
    return (
      <>
        <NavBar />
        <div>
          <p>{error}</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/store")}
          >
            Back to Store
          </button>
        </div>
      </>
    );
  if (!product) return null;

  return (
    <>
      <NavBar />
      <div className="page-shell product-detail-page">
        <div className="product-detail-view-container">
          <button
            className="btn btn-secondary back-to-catalog-btn"
            onClick={() => navigate("/store")}
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
                className="btn btn-primary add-to-cart-action-btn"
              >
                Add to Cart Basket
              </button>
            </div>
          </div>

          <div className="reviews-section-wrapper">
            <h3>Customer Feedback & Comments</h3>

            <form onSubmit={handleSubmitReview} className="add-review-form">
              <h4>Leave a Comment</h4>
              <label>
                Your Name:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Doe (Optional)"
                />
              </label>
              <label>
                Comment:
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your review here..."
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Submit Comment
              </button>
            </form>

            <div className="reviews-feed-list">
              {reviews.length === 0 ? (
                <p>No comments written for this item yet. Be the first!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="individual-review-node">
                    <div className="review-metadata-header">
                      <strong>{review.username || "Anonymous"}</strong>
                      <span className="review-date-timestamp">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {editingReviewId === review._id ? (
                      <div className="edit-review-inline-wrapper">
                        <textarea
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                          required
                        />
                        <div className="edit-review-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleUpdateReview(review._id)}
                          >
                            Save Changes
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditingReviewId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="review-comment-body">{review.comment}</p>
                        <div className="review-controls">
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleEditClick(review)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
