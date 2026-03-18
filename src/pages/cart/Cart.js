import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import CartBannerHeader from "./CartBannerHeader";
import { useUser } from "../../context/UserContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser();

  // Example: Use API_ENDPOINTS for future API calls (e.g., fetch product details)
  useEffect(() => {
    // Example usage (not required for current localStorage cart logic)
    // fetch(API_ENDPOINTS.PRODUCTS)
    //   .then(res => res.json())
    //   .then(data => { /* handle data */ });
    // For now, just log the endpoint for demonstration
    // console.log("Products API endpoint:", API_ENDPOINTS.PRODUCTS);

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

      // Notify navbar (or any other listener) that cart has changed
      window.dispatchEvent(new Event('cartUpdated'));

      return updated;
    });
  };


  // Calculate discounted price for each item
  const getDiscountedPrice = (item) => {
    if (item.discount_percentage && item.discount_percentage > 0) {
      return item.price - (item.price * item.discount_percentage) / 100;
    }
    return item.price;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const hasVendorDiscount =
      localStorage.getItem("authToken") && user?.created_by && item.discount_percentage > 0;

    const pricePerItem = hasVendorDiscount
      ? getDiscountedPrice(item)
      : item.price;

    return sum + pricePerItem * item.quantity;
  }, 0);

  const total = subtotal;

  return (
    <main>
      <CartBannerHeader />
      <section className="page-header bg-light mb-5">
        {/* <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="page-title text-uppercase mb-3">Shopping Cart</h1>
              <div className="breadcrumb-nav">
                <span className="text-uppercase"><Link to="/" className="text-decoration-none text-dark">Home</Link></span>
                <span className="mx-2">/</span>
                <span className="text-uppercase text-muted">Shopping Cart</span>
              </div>
            </div>
          </div>
        </div> */}
      </section>

      <section className="cart-content pb-5">
        <div className="container">
          {cartItems.length > 0 ? (
            <div className="row">
              <div className="col-lg-8">
                <div className="cart-items mb-lg-0 mb-4">
                  {cartItems.map((item, idx) => (
                    <div
                      key={
                        item.id + "-" + item.size + "-" + item.color + "-" + idx
                      }
                      className="cart-item bg-white border rounded-3 p-4 mb-3"
                    >
                      <div className="row align-items-center">
                        <div className="col-4 col-md-2 mb-3 mb-md-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = require("../../assets/images/product-item-1.jpg");
                            }}
                          />
                        </div>
                        <div className="col-8 col-md-5 mb-3 mb-md-0">
                          <h3 className="item-title h6 mb-2 font-heading">
                            <Link
                              to={`/product/${item.id}`}
                              className="text-dark text-decoration-none font-body"
                            >
                              {item.name}
                            </Link>
                          </h3>
                          <p className="text-muted small mb-2 font-body">
                            Size: {item.size}
                          </p>
                        </div>
                        <div className="col-6 col-md-2">
                          <div className="quantity d-flex align-items-center justify-content-start justify-content-md-center">
                            <button
                              className="btn btn-sm btn-outline-dark"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  "decrease",
                                  item.size,
                                  item.color
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="mx-3 fw-medium">
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-dark"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  "increase",
                                  item.size,
                                  item.color
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </div>
                        {/* price DiscountedPrice start*/}
                        <div className="col-4 col-md-2 text-end" style={{ padding: "0" }}>
                          <span className="price fw-medium d-block mb-2">
                            {localStorage.getItem("authToken") && user?.created_by && item.discount_percentage > 0 ? (
                              <>
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#888",
                                    marginRight: 8,
                                  }}
                                >
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                                <span style={{ color: "#d32f2f", fontWeight: 600 }}>
                                  ₹{(getDiscountedPrice(item) * item.quantity).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            )}

                          </span>
                        </div>

                        {/* price DiscountedPrice end*/}

                        <div className="col-12 col-md-1 text-end" style={{ paddingLeft: "30px" }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger order-md-2"
                            onClick={() =>
                              handleRemoveItem(item.id, item.size, item.color)
                            }
                            aria-label="Remove item"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="cart-summary bg-light p-4">
                  <h3 className="summary-title h5 mb-4 font-heading">Order Summary</h3>

                  <div className="summary-item d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="summary-item d-flex justify-content-between mb-4">
                    <strong>Total</strong>
                    <strong>₹{total.toFixed(2)}</strong>
                  </div>
                  <Link
                    to="/cart/address"
                    className="btn btn-dark w-100 text-uppercase"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <h2 className="h4 mb-4">Your cart is empty</h2>
              <Link to="/" className="btn btn-dark text-uppercase">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Cart;