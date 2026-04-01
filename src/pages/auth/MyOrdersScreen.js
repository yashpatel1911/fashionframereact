import React, { useState, useEffect, useRef } from "react";
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import "../../assets/css/orderhistory.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import TrackingModal from './TrackingModal';
import 'bootstrap-icons/font/bootstrap-icons.css';

// ─────────────────────────────────────────────────────────────────
// Rating Modal
// ─────────────────────────────────────────────────────────────────
const RatingModal = ({ item, orderId, onClose, onSuccess }) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoveredRating, setHoveredRating]   = useState(0); 
    const [reviewText, setReviewText]         = useState("");
    const [submitting, setSubmitting]         = useState(false);
    const [error, setError]                   = useState("");

    const token = localStorage.getItem("authToken");

    const ratingLabels = ["", "Terrible", "Bad", "Okay", "Good", "Excellent"];
    const ratingEmojis = ["", "😞", "😕", "😐", "😊", "🤩"];
    const ratingColors = ["", "#8b2020", "#a05020", "#7a5c12", "#1f6645", "#1b5e3b"];

    const handleSubmit = async () => {
        if (selectedRating === 0) { setError("Please select a star rating."); return; }
        setError("");
        setSubmitting(true);
        try {
            const res  = await fetch(API_ENDPOINTS.SUBMIT_PRODUCT_REVIEW, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    product_id: item.product_id,
                    order_id:   orderId,
                    rating:     selectedRating,
                    review:     reviewText.trim(),
                }),
            });
            const data = await res.json();
            if (data.status === "success") { onSuccess(item.product_name); onClose(); }
            else setError(data.message || "Failed to submit review.");
        } catch { setError("Something went wrong. Please try again."); }
        finally  { setSubmitting(false); }
    };

    const handleBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); };
    const active = hoveredRating || selectedRating;

    return (
        <div className="oh-modal-backdrop" onClick={handleBackdropClick}>
            <div className="oh-modal">
                <div className="oh-modal-header">
                    <img
                        className="oh-modal-thumb"
                        src={`${IMAGE_BASE_URL}/media/${item.product_image}`}
                        alt={item.product_name}
                        onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='60'%3E%3Crect fill='%23ede8de' width='50' height='60'/%3E%3C/svg%3E";
                        }}
                    />
                    <div className="oh-modal-header-text">
                        <div className="oh-modal-label">Rate Product</div>
                        <div className="oh-modal-product-name">{item.product_name}</div>
                    </div>
                    <button className="oh-modal-close" onClick={onClose} aria-label="Close">✕</button>
                </div>
                <div className="oh-modal-body">
                    <p className="oh-modal-question">How would you rate this product?</p>
                    <div className="oh-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <span
                                key={s}
                                className={`oh-star${s <= active ? " oh-star--active" : ""}`}
                                onClick={() => setSelectedRating(s)}
                                onMouseEnter={() => setHoveredRating(s)}
                                onMouseLeave={() => setHoveredRating(0)}
                            >★</span>
                        ))}
                    </div>
                    {selectedRating > 0 && (
                        <div className="oh-rating-pill">
                            <span className="oh-rating-chip" style={{ color: ratingColors[selectedRating] }}>
                                {ratingLabels[selectedRating]} {ratingEmojis[selectedRating]}
                            </span>
                        </div>
                    )}
                    <div style={{ marginBottom: "16px" }}>
                        <label className="oh-review-label">
                            Write a Review{" "}
                            <span className="oh-review-optional">(Optional)</span>
                        </label>
                        <textarea
                            className="oh-review-textarea"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            maxLength={300}
                            rows={3}
                            placeholder="Share your thoughts about this product…"
                        />
                        <div className="oh-char-count">{reviewText.length} / 300</div>
                    </div>
                    {error && <div className="oh-modal-error">{error}</div>}
                </div>
                <div className="oh-modal-footer">
                    <button className="oh-btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
                    <button className="oh-btn-submit" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? (
                            <><span className="oh-spinner" /> Submitting…</>
                        ) : (
                            <><i className="bi bi-send" /> Submit Review</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
const isDelivered = (s) => ["DELIVERED", "COMPLETED"].includes(s?.toUpperCase());

const badgeClass = (s) => {
    switch (s?.toUpperCase()) {
        case "PENDING":    return "oh-badge--pending";
        case "DELIVERED":  return "oh-badge--delivered";
        case "COMPLETED":  return "oh-badge--completed";
        case "CANCELLED":
        case "CANCELED":   return "oh-badge--cancelled";
        case "PROCESSING": return "oh-badge--processing";
        case "SHIPPED":    return "oh-badge--shipped";
        default:           return "oh-badge--default";
    }
};

// Only icons confirmed working in original project
const statusIcon = (s) => {
    switch (s?.toUpperCase()) {
        case "PENDING":    return "bi-hourglass";
        case "DELIVERED":
        case "COMPLETED":  return "bi-bag-check";
        case "CANCELLED":
        case "CANCELED":   return "bi-x-circle";
        case "PROCESSING": return "bi-gear";
        case "SHIPPED":    return "bi-truck";
        default:           return "bi-circle";
    }
};

const showTrack = (order) => {
    const s = order.status?.toUpperCase();
    return order.awb_no && s !== "CANCELLED" && s !== "CANCELED";
};

const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });

const fmtTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
        hour: "numeric", minute: "2-digit", hour12: true,
    });

// ─────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────
const MyOrdersScreen = () => {
    const [orders, setOrders]             = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState("");
    const [showTracking, setShowTracking] = useState(false);
    const [selOrder, setSelOrder]         = useState(null);
    const [ratingModal, setRatingModal]   = useState(null);
    const [successMsg, setSuccessMsg]     = useState("");
    const successTimer = useRef(null);
    const [currentPage, setCurrentPage]   = useState(1);
    const [pagination, setPagination]     = useState(null);
    const perPage = 10;

    const token = localStorage.getItem("authToken");

    const fetchOrders = async (page = 1) => {
        setLoading(true); setError("");
        try {
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;
            const res  = await fetch(`${API_ENDPOINTS.GET_USER_ORDER_PAGINATION}?page=${page}&per_page=${perPage}`, { headers });
            const data = await res.json();
            if (res.ok && data.status === "success" && Array.isArray(data.orders)) {
                setOrders(data.orders);
                setPagination(data.pagination);
            } else {
                setOrders([]); setError(data.message || "Failed to fetch orders.");
            }
        } catch { setOrders([]); setError("An error occurred while fetching orders."); }
        finally  { setLoading(false); }
    };

    useEffect(() => {
        fetchOrders(currentPage);
        return () => clearTimeout(successTimer.current);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page < 1 || (pagination && page > pagination.total_pages)) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleReviewSuccess = (name) => {
        clearTimeout(successTimer.current);
        setSuccessMsg(`Review for "${name}" submitted!`);
        successTimer.current = setTimeout(() => setSuccessMsg(""), 4000);
    };

    const getPageNumbers = () => {
        if (!pagination) return [];
        const { total_pages: total, current_page: cur } = pagination;
        const pages = [];
        if (total <= 5) { for (let i = 1; i <= total; i++) pages.push(i); }
        else if (cur <= 3) { pages.push(1, 2, 3, 4, "...", total); }
        else if (cur >= total - 2) { pages.push(1, "...", total-3, total-2, total-1, total); }
        else { pages.push(1, "...", cur-1, cur, cur+1, "...", total); }
        return pages;
    };

    return (
        <main className="oh-root">

            {/* ── Toast ── */}
            {successMsg && (
                <div className="oh-toast">
                    <i className="bi bi-bag-check" />
                    {successMsg}
                </div>
            )}

            {/* ── Page Header ── */}
            <section className="oh-page-header">
                <div className="container">
                    <div className="oh-page-header-inner">
                        <div>
                            <div className="oh-page-eyebrow">
                                <i className="bi bi-bag" />
                                My Account
                            </div>
                            <h4 className="oh-page-title">Order History</h4>
                        </div>
                        {pagination && (
                            <div className="oh-order-count-pill">
                                <i className="bi bi-list-ul" />
                                {pagination.total_count} orders
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Orders ── */}
            <section className="oh-section">
                <div className="container">
                    {loading ? (
                        <div className="text-center py-5"><LoadingSpinner /></div>
                    ) : error ? (
                        <div className="oh-error-state">
                            <i className="bi bi-exclamation-triangle oh-error-icon" />
                            <p>{error}</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="oh-empty">
                            <div className="oh-empty-icon-wrap">
                                <i className="bi bi-bag" />
                            </div>
                            <h5 className="oh-empty-title">No Orders Yet</h5>
                            <p className="oh-empty-sub">You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="oh-orders-list">
                                {orders.map((order) => {
                                    const delivered = isDelivered(order.status);
                                    return (
                                        <div key={order.order_id} className="oh-card">

                                            {/* ── Status accent bar ── */}
                                            <div className={`oh-card-accent oh-accent--${badgeClass(order.status).replace("oh-badge--","")}`} />

                                            {/* ── Card Header ── */}
                                            <div className="oh-card-header">
                                                <div className="oh-order-meta">
                                                    <div className="oh-order-id">
                                                        Order #{order.order_id}
                                                    </div>
                                                    <div className="oh-order-datetime">
                                                        <span className="oh-datetime-part">
                                                            <i className="bi bi-calendar" />
                                                            {fmtDate(order.created_at)}
                                                        </span>
                                                        <span className="oh-datetime-sep">·</span>
                                                        <span className="oh-datetime-part">
                                                            <i className="bi bi-clock" />
                                                            {fmtTime(order.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`oh-badge ${badgeClass(order.status)}`}>
                                                    <i className={`bi ${statusIcon(order.status)}`} />
                                                    {order.status?.toUpperCase() || "N/A"}
                                                </span>
                                            </div>

                                            {/* ── Card Body ── */}
                                            <div className="oh-card-body">

                                                {/* ── Summary strip — stays 3-col on ALL screens ── */}
                                                <div className="oh-summary-strip">
                                                    <div className="oh-summary-cell">
                                                        <div className="oh-summary-icon oh-summary-icon--blue">
                                                            <i className="bi bi-credit-card" />
                                                        </div>
                                                        <div className="oh-summary-text">
                                                            <span className="oh-summary-label">Payment</span>
                                                            <span className="oh-summary-value">{order.payment_method || "N/A"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="oh-summary-divider" />

                                                    <div className="oh-summary-cell">
                                                        <div className="oh-summary-icon oh-summary-icon--green">
                                                            <i className="bi bi-shield-check" />
                                                        </div>
                                                        <div className="oh-summary-text">
                                                            <span className="oh-summary-label">Status</span>
                                                            <span className="oh-summary-value">{order.payment_status || "N/A"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="oh-summary-divider" />

                                                    <div className="oh-summary-cell">
                                                        <div className="oh-summary-icon oh-summary-icon--gold">
                                                            <i className="bi bi-wallet2" />
                                                        </div>
                                                        <div className="oh-summary-text">
                                                            <span className="oh-summary-label">Total</span>
                                                            <span className="oh-summary-amount">
                                                                ₹{order.total_amount?.toFixed(2) || "0.00"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ── Delivery address ── */}
                                                {order.address && (
                                                    <div className="oh-address-row">
                                                        <div className="oh-address-icon">
                                                            <i className="bi bi-geo-alt" />
                                                        </div>
                                                        <div className="oh-address-text">
                                                            <span className="oh-address-name">{order.address.full_name}</span>
                                                            <span className="oh-address-detail">
                                                                {order.address.address_line}, {order.address.city},{" "}
                                                                {order.address.state} – {order.address.postal_code}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* ── Items ── */}
                                                <div className="oh-items-section">
                                                    <div className="oh-items-heading">
                                                        <i className="bi bi-bag" />
                                                        <span>Items ordered</span>
                                                        <span className="oh-items-count">{order.items?.length || 0}</span>
                                                    </div>

                                                    <div className="oh-items-list">
                                                        {order.items?.map((item, idx) => (
                                                            <div key={idx} className="oh-item">
                                                                <div className="oh-item-thumb">
                                                                    <img
                                                                        src={`${IMAGE_BASE_URL}/media/${item.product_image}`}
                                                                        alt={item.product_name}
                                                                        onError={(e) => {
                                                                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='80'%3E%3Crect fill='%23ede8de' width='64' height='80'/%3E%3C/svg%3E";
                                                                        }}
                                                                    />
                                                                    {item.discount_percentage > 0 && (
                                                                        <span className="oh-item-thumb-badge">
                                                                            -{item.discount_percentage}%
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="oh-item-info">
                                                                    <div className="oh-item-name">{item.product_name}</div>
                                                                    <div className="oh-item-meta">
                                                                        {item.size && (
                                                                            <span className="oh-meta-chip">
                                                                                <i className="bi bi-rulers" />
                                                                                {item.size}
                                                                            </span>
                                                                        )}
                                                                        <span className="oh-meta-chip">
                                                                            <i className="bi bi-bag" />
                                                                            Qty {item.quantity}
                                                                        </span>
                                                                    </div>
                                                                    <div className="oh-item-price-row">
                                                                        <span className="oh-item-price">
                                                                            ₹{item.price?.toFixed(2) || "0.00"}
                                                                        </span>
                                                                        {item.discount_percentage > 0 && (
                                                                            <span className="oh-item-off-tag">
                                                                                <i className="bi bi-tag" />
                                                                                {item.discount_percentage}% OFF
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {delivered && (
                                                                    <button
                                                                        className="oh-btn-rate"
                                                                        onClick={() => setRatingModal({ item, orderId: order.uo_id || order.order_id })}
                                                                        title="Rate this product"
                                                                    >
                                                                        <i className="bi bi-star" />
                                                                        <span>Rate</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* ── Actions ── */}
                                                <div className="oh-actions">
                                                    <button
                                                        className="oh-btn-invoice"
                                                        onClick={() => window.open(`${API_ENDPOINTS.INVOICEDOWNLOAD}${order.uo_id || order.order_id}/invoice/`, "_blank")}
                                                    >
                                                        <i className="bi bi-download" />
                                                        <span>Invoice</span>
                                                    </button>

                                                    {showTrack(order) && (
                                                        <button
                                                            className="oh-btn-track"
                                                            onClick={() => { setSelOrder(order); setShowTracking(true); }}
                                                        >
                                                            <i className="bi bi-truck" />
                                                            <span>Track Order</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ── Pagination ── */}
                            {pagination && pagination.total_pages > 1 && (
                                <div className="oh-pagination">
                                    <button
                                        className="oh-page-btn oh-page-btn--nav"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!pagination.has_previous}
                                    >
                                        ← Prev
                                    </button>
                                    <div className="oh-page-numbers">
                                        {getPageNumbers().map((page, idx) =>
                                            page === "..." ? (
                                                <span key={`e-${idx}`} className="oh-page-ellipsis">…</span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    className={`oh-page-btn${page === currentPage ? " oh-page-btn--active" : ""}`}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        )}
                                    </div>
                                    <button
                                        className="oh-page-btn oh-page-btn--nav"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!pagination.has_next}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {showTracking && selOrder && (
                <TrackingModal
                    awbCode={selOrder.awb_no}
                    orderId={selOrder.order_id}
                    onClose={() => { setShowTracking(false); setSelOrder(null); }}
                />
            )}

            {ratingModal && (
                <RatingModal
                    item={ratingModal.item}
                    orderId={ratingModal.orderId}
                    onClose={() => setRatingModal(null)}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </main>
    );
};

export default MyOrdersScreen;