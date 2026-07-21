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
    if (newQuantity <= 0) return; 
    try {
      await api.put("/cart", {
        cartId: cart.id,
        productId: productId,
        quantity: newQuantity,
      });
      setRefreshTrigger((prev) => !prev); 
    } catch (error) {
      console.error("Failed to alter basket item count:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm("Remove this product from your basket?")) {
      try {
        
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
      <div className="page-shell cart-page">
        <h1 className="page-heading">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="form-card">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div>
            {}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.productId} className="cart-item-card">
                  <img src={item.product.imageURL} alt={item.product.name} />

                  <div className="cart-item-details">
                    <h3>{item.product.name}</h3>
                    <p>Category: {item.product.category}</p>
                    <p>Price: ${item.product.price}</p>
                  </div>

                  {}
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

                    <button
                      className="btn btn-secondary"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart-item-subtotal">
                    <p>Subtotal: ${item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="cart-summary-box">
              <h3>Order Total Balance</h3>
              <h2>Total: ${totalPrice}</h2>
              <button
                className="btn btn-primary"
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
