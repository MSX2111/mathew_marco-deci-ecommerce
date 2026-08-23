import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../assets/Cart.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error(
        "Error fetching cart:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      const response = await api.put(`/cart/items/${productId}`, {
        quantity,
      });

      setCart(response.data);

      toast.success("Cart updated!");
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to update quantity.",
      );
    }
  };

  const removeFromCart = async (productId, productName) => {
    try {
      const response = await api.delete(`/cart/items/${productId}`);

      setCart(response.data);

      toast.success(`${productName} removed from cart.`);
    } catch (error) {
      console.error(
        "Error removing product:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to remove product.");
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <div className="cart-spinner"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h1>Your Cart is Empty</h1>

          <p>Looks like there is nothing here yet.</p>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <p className="cart-eyebrow">YOUR SHOPPING CART</p>

          <h1>Your Cart</h1>

          <p>
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cart.items.map((item) => (
            <div className="cart-item" key={item.product.id}>
              <div className="cart-item-image">
                <img src={item.product.image_url} alt={item.product.name} />
              </div>

              <div className="cart-item-content">
                <div className="cart-item-info">
                  <span className="cart-item-category">
                    {item.product.category}
                  </span>

                  <h2>{item.product.name}</h2>

                  <p>{item.product.description}</p>
                </div>

                <div className="cart-item-bottom">
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity === 1}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-price">
                    <span>
                      {item.product.price} × {item.quantity}
                    </span>

                    <strong>{item.product.price * item.quantity}</strong>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(item.product.id, item.product.name)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>
              {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{total}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total</span>
            <strong>{total}</strong>
          </div>

          <button
            className="checkout-button"
            onClick={() => toast.info("Checkout isn't available yet.")}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
