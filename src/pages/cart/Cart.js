import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import CartBannerHeader from "./CartBannerHeader";
import { useUser } from "../../context/UserContext";
import '../../assets/css/lux-cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);
    } catch (e) {
      setCartItems([]);
    }
  }, []);

  const handleQuantityChange = (id, action, size, color) => {
    setCartItems((items) => {
      const updated = items.map((item) => {
        if (item.id === id && item.size === size && item.color === color) {
          return {
            ...item,
            quantity:
              action === "increase"
                ? item.quantity + 1
                : Math.max(1, item.quantity - 1),
          };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
      return updated;
    });
  };

  const handleRemoveItem = (id, size, color) => {
    setCartItems((items) => {
      const updated = items.filter(
        (item) => !(item.id === id && item.size === size && item.color === color)
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
      return updated;
    });
  };

  const getDiscountedPrice = (item) => {
    if (item.discount_percentage && item.discount_percentage > 0) {
      return item.price - (item.price * item.discount_percentage) / 100;
    }
    return item.price;
  };

  const isVendor = localStorage.getItem("authToken") && user?.created_by;

  const subtotal = cartItems.reduce((sum, item) => {
    const pricePerItem =
      isVendor && item.discount_percentage > 0
        ? getDiscountedPrice(item)
        : item.price;
    return sum + pricePerItem * item.quantity;
  }, 0);

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalSavings = originalTotal - subtotal;

  return (
    <main className="lux-cart-page">
      <CartBannerHeader />

      <div className="lux-page-header">
        <p className="lux-page-subtitle">Step 1 of 3</p>
        <h2 className="lux-page-title">Shopping Cart</h2>
      </div>

      <section className="lux-section">
        <div className="container">
          {cartItems.length > 0 ? (
            <div className="row">
              {/* ── Cart Items ── */}
              <div className="col-lg-8 mb-4 mb-lg-0">
                <span className="lux-item-count">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>

                {cartItems.map((item, idx) => {
                  const hasDiscount = isVendor && item.discount_percentage > 0;
                  const discounted  = getDiscountedPrice(item);

                  return (
                    <div
                      key={item.id + "-" + item.size + "-" + item.color + "-" + idx}
                      className="lux-cart-item"
                    >
                      <div className="d-flex gap-4 align-items-center">
                        {/* Image */}
                        <div style={{ flexShrink: 0 }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="lux-item-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = require("../../assets/images/product-item-1.jpg");
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                          <Link to={`/product/${item.id}`} className="lux-item-name">
                            {item.name}
                          </Link>
                          <div className="lux-item-meta mb-3">
                            Size: {item.size}
                            {item.color && <span style={{ marginLeft: 12 }}>Color: {item.color}</span>}
                          </div>

                          <div className="d-flex align-items-center gap-3">
                            <div className="lux-qty-wrap">
                              <button
                                className="lux-qty-btn"
                                onClick={() => handleQuantityChange(item.id, "decrease", item.size, item.color)}
                              >
                                <FontAwesomeIcon icon={faMinus} />
                              </button>
                              <span className="lux-qty-num">{item.quantity}</span>
                              <button
                                className="lux-qty-btn"
                                onClick={() => handleQuantityChange(item.id, "increase", item.size, item.color)}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </button>
                            </div>

                            <button
                              className="lux-delete-btn"
                              onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                              title="Remove item"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {hasDiscount ? (
                            <>
                              <span className="lux-price-original">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                              <span className="lux-price-discounted">
                                ₹{(discounted * item.quantity).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="lux-price">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Order Summary Sidebar ── */}
              <div className="col-lg-4">
                <div className="lux-summary">
                  <h3 className="lux-summary-title">Order Summary</h3>

                  <div className="lux-summary-row">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{originalTotal.toFixed(2)}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="lux-summary-row" style={{ color: "#b5541a" }}>
                      <span>Discount</span>
                      <span>− ₹{totalSavings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="lux-summary-row">
                    <span>Shipping</span>
                    <span style={{ color: "#7a9e6e", fontSize: "0.8rem", letterSpacing: "0.12em" }}>FREE</span>
                  </div>

                  <div className="lux-summary-divider" />

                  <div className="lux-summary-row total">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="lux-savings-badge">
                      You save ₹{totalSavings.toFixed(2)} on this order
                    </div>
                  )}

                  <Link to="/cart/address" className="lux-btn-primary w-full" style={{ marginTop: 24 }}>
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="lux-empty">
              <span className="lux-empty-icon">◻</span>
              <h2 className="lux-empty-title">Your cart is empty</h2>
              <p className="lux-empty-sub">Discover our curated collections</p>
              <Link to="/" className="lux-btn-ghost">Continue Shopping</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Cart;