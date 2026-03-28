import React, { useEffect, useState } from "react";
import CartBannerHeader from "./CartBannerHeader";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import '../../assets/css/lux-cart.css';

const FinalOrderSummary = () => {
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const navigate              = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to view your order.");
        setLoading(false);
        return;
      }
      try {
        const res  = await fetch(API_ENDPOINTS.GET_USER_ORDER, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && data.status && Array.isArray(data.orders) && data.orders.length > 0) {
          const latestOrder = data.orders.reduce((prev, curr) =>
            prev.order_id > curr.order_id ? prev : curr
          );
          setOrder(latestOrder);
        } else {
          setError(data.message || "No orders found.");
        }
      } catch {
        setError("Failed to fetch order.");
      }
      setLoading(false);
    };
    fetchOrder();
  }, []);

  return (
    <main className="lux-summary-page">
      <CartBannerHeader currentStep={4} />

      <div className="lux-page-header">
        <p className="lux-page-subtitle">You're all set</p>
        <h2 className="lux-page-title">Order Summary</h2>
      </div>

      <section className="lux-section">
        <div className="container">
          {loading ? (
            <div className="lux-loading">Fetching your order</div>
          ) : error ? (
            <div className="row justify-content-center">
              <div className="col-md-6 text-center py-5">
                <div style={{ fontSize: "2rem", marginBottom: 12, opacity: 0.25 }}>◻</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#3a3530" }}>
                  {error}
                </p>
                <button className="lux-btn-primary" onClick={() => navigate("/")}>Back to Home</button>
              </div>
            </div>
          ) : order ? (
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8">

                {/* Success Banner */}
                <div className="lux-success-banner">
                  <div className="lux-success-icon">✓</div>
                  <div>
                    <div className="lux-success-text-title">Order Confirmed</div>
                    <div className="lux-success-text-sub">
                      Thank you for your purchase. We'll keep you updated.
                    </div>
                  </div>
                </div>

                {/* Order ID + Status */}
                <div className="lux-order-meta">
                  <div className="lux-order-id">
                    <span>Order</span>#{order.order_id}
                  </div>
                  <span className="lux-status-badge">{order.status}</span>
                </div>

                {/* Shipping Info */}
                <div className="lux-card">
                  <div className="lux-card-title">Shipping Information</div>
                  <div className="lux-info-grid">
                    <div className="lux-info-item">
                      <div className="lux-info-label">Full Name</div>
                      <div className="lux-info-value">{order.address.full_name}</div>
                    </div>
                    <div className="lux-info-item">
                      <div className="lux-info-label">Email</div>
                      <div className="lux-info-value">{order.address.email}</div>
                    </div>
                    <div className="lux-info-item">
                      <div className="lux-info-label">Phone</div>
                      <div className="lux-info-value">{order.address.contact_no}</div>
                    </div>
                    <div className="lux-info-item">
                      <div className="lux-info-label">Address Type</div>
                      <div className="lux-info-value" style={{ textTransform: "capitalize" }}>
                        {order.address.address_type}
                      </div>
                    </div>
                    <div className="lux-info-item" style={{ gridColumn: "1 / -1" }}>
                      <div className="lux-info-label">Delivery Address</div>
                      <div className="lux-info-value">
                        {order.address.address_line}, {order.address.city},{" "}
                        {order.address.state} — {order.address.postal_code}
                      </div>
                    </div>
                    <div className="lux-info-item">
                      <div className="lux-info-label">Payment Method</div>
                      <div className="lux-info-value">
                        <span className="lux-payment-method">{order.payment_method}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Ordered */}
                <div className="lux-card">
                  <div className="lux-card-title">Items Ordered</div>
                  {order.items.map((item, idx) => (
                    <div
                      key={item.product_id + "-" + item.size + "-" + idx}
                      className="lux-product-row"
                    >
                      <img
                        src={
                          item.product_image
                            ? item.product_image.startsWith("http")
                              ? item.product_image
                              : `${IMAGE_BASE_URL}/media/${item.product_image}`
                            : "/placeholder.jpg"
                        }
                        alt={item.product_name}
                        className="lux-product-img"
                      />
                      <div style={{ flex: 1 }}>
                        <div className="lux-product-name">{item.product_name}</div>
                        <div className="lux-product-meta">
                          Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}
                        </div>
                        <div>
                          {item.discount_percentage && item.discount_percentage > 0 ? (
                            <>
                              <span className="lux-product-price-original">
                                ₹{item.product_price.toFixed(2)}
                              </span>
                              <span className="lux-product-price discounted">
                                ₹{item.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="lux-product-price">₹{item.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      <div className="lux-product-total">₹{item.total_price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="lux-card">
                  <div className="lux-card-title">Price Breakdown</div>
                  <div className="lux-totals-row">
                    <span>Subtotal</span>
                    <span>₹{order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="lux-totals-row">
                    <span>Shipping</span>
                    <span style={{ color: "#7a9e6e", fontSize: "0.8rem", letterSpacing: "0.12em" }}>FREE</span>
                  </div>
                  <div className="lux-totals-divider" />
                  <div className="lux-totals-row grand">
                    <span>Total</span>
                    <span>₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-4">
                  <button className="lux-btn-primary" onClick={() => navigate("/")}>
                    Continue Shopping
                  </button>
                </div>

              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default FinalOrderSummary;