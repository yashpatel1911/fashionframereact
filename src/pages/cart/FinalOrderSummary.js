import React, { useEffect, useState } from "react";
import CartBannerHeader from "./CartBannerHeader";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";

const FinalOrderSummary = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        const res = await fetch(API_ENDPOINTS.GET_USER_ORDER, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
      } catch (err) {
        setError("Failed to fetch order.");
      }
      setLoading(false);
    };
    fetchOrder();
  }, []);

  return (
    <main>
      <CartBannerHeader currentStep={4} />
      <section className="page-header bg-light mb-5">
        <div className="container">
          <h1 className="page-title text-center mb-0">Order Summary</h1>
        </div>
      </section>
      <section className="order-summary-content pb-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">Loading order summary...</div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : order ? (
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8">
                <div className="card shadow-sm border-0 rounded-3 p-3 p-md-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4"
                    style={{ borderBottom: "1px solid #eee", paddingBottom: 16 }}>
                    <h2 className="h4 mb-2 mb-md-0">Order #{order.order_id}</h2>
                    <span className="badge bg-warning text-dark text-uppercase px-3 py-2">
                      {order.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h5 className="mb-3">Shipping Information</h5>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <strong>Name:</strong> {order.address.full_name}
                      </div>
                      <div className="col-12 col-md-6">
                        <strong>Email:</strong> {order.address.email}
                      </div>
                      <div className="col-12 col-md-6">
                        <strong>Phone:</strong> {order.address.contact_no}
                      </div>
                      <div className="col-12 col-md-6">
                        <strong>Address:</strong> {order.address.address_line}, {order.address.city}, {order.address.state} - {order.address.postal_code}
                      </div>
                      <div className="col-12 col-md-6">
                        <strong>Type:</strong> {order.address.address_type}
                      </div>
                      <div className="col-12 col-md-6">
                        <strong>Payment Method:</strong> {order.payment_method}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h5 className="mb-3">Products</h5>
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Image</th>
                            <th>Size</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={item.product_id + "-" + item.size + "-" + idx}>
                              <td>{item.product_name}</td>
                              <td>
                                <img
                                  src={
                                    item.product_image
                                      ? item.product_image.startsWith("http")
                                        ? item.product_image
                                        : `${IMAGE_BASE_URL}/media/${item.product_image}`
                                      : "/placeholder.jpg"
                                  }
                                  alt={item.product_name}
                                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                                />
                              </td>
                              <td>{item.size}</td>
                              <td>{item.quantity}</td>
                              <td>
                                {item.discount_percentage && item.discount_percentage > 0 ? (
                                  <>
                                    <span style={{ textDecoration: "line-through", color: "#888", marginRight: 8 }}>
                                      ₹{item.product_price.toFixed(2)}
                                    </span>
                                    <span style={{ color: "#d32f2f", fontWeight: 600 }}>
                                      ₹{item.price.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span>₹{item.price.toFixed(2)}</span>
                                )}
                              </td>
                              <td>₹{item.total_price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span>₹{order.total_amount.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-2">
                      <strong>Total</strong>
                      <strong>₹{order.total_amount.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-dark text-uppercase"
                      onClick={() => navigate("/")}
                    >
                      Back to Home
                    </button>
                  </div>
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