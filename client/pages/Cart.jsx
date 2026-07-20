import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../axios/axiosInstance";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    async function fetchCartData() {
      try {
        setLoading(true);
        const response = await api.get("/cart");
        setCart(response.data);
      } catch (error) {
        console.error("Error retrieving user basket data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCartData();
  }, [refreshTrigger]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) return; // Prevent lowering quantities below 1
    try {
      await api.put("/cart", {
        cartId: cart.id,
        productId: productId,
        quantity: newQuantity,
      });
      setRefreshTrigger((prev) => !prev); // Force reload view data arrays
    } catch (error) {
      console.error("Failed to alter basket item count:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm("Remove this product from your basket?")) {
      try {
        // Axios delete method requires data payload wrapping inside a config wrapper object
        await api.delete("/cart", {
          data: {
            cartId: cart.id,
            productId: productId,
          },
        });
        setRefreshTrigger((prev) => !prev);
      } catch (error) {
        console.error("Failed to drop record from cart row:", error);
      }
    }
  };

  // Automated layout loop mathematics calculations
  const cartItems = cart?.items || [];
  const totalPrice = cartItems.reduce((acc, currentItem) => {
    return acc + currentItem.product.price * currentItem.quantity;
  }, 0);

  if (loading)
    return (
      <>
        <NavBar />
        <div>Loading your basket components...</div>
      </>
    );

  return (
    <>
      <NavBar />
      <div>
        <h2>Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {/* Iterative Product Cards Generation Rows */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.productId} className="cart-item-card">
                  <img src={item.product.imageURL} alt={item.product.name} />

                  <div className="cart-item-details">
                    <h3>{item.product.name}</h3>
                    <p>Category: {item.product.category}</p>
                    <p>Price: ${item.product.price}</p>
                  </div>

                  {/* Operational Inputs Increment Tray Panel */}
                  <div className="cart-item-actions">
                    <label>
                      Qty:
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            parseInt(e.target.value, 10) || 1,
                          )
                        }
                      />
                    </label>

                    <button onClick={() => handleRemoveItem(item.productId)}>
                      Remove
                    </button>
                  </div>

                  <div className="cart-item-subtotal">
                    <p>Subtotal: ${item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Balance Summary Panel Box */}
            <div className="cart-summary-box">
              <h3>Order Total Balance</h3>
              <h2>Total: ${totalPrice}</h2>
              <button
                onClick={() =>
                  alert("Proceeding to payment setup module gateway...")
                }
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
