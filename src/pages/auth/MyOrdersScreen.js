import React, { useState, useEffect, useRef } from "react";
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import "../../assets/custom.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import TrackingModal from './TrackingModal';

// ─────────────────────────────────────────────────────────────────
// Rating Modal Component
// ─────────────────────────────────────────────────────────────────
const RatingModal = ({ item, orderId, onClose, onSuccess }) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("authToken");

    const ratingLabels = ["", "Terrible", "Bad", "Okay", "Good", "Excellent"];
    const ratingEmojis = ["", "😞", "😕", "😐", "😊", "🤩"];
    const ratingColors = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"];

    const handleSubmit = async () => {
        if (selectedRating === 0) {
            setError("Please select a star rating.");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            const response = await fetch(API_ENDPOINTS.SUBMIT_PRODUCT_REVIEW, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    product_id: item.product_id,
                    order_id: orderId,
                    rating: selectedRating,
                    review: reviewText.trim(),
                }),
            });

            const data = await response.json();

            if (data.status === "success") {
                onSuccess(item.product_name);
                onClose();
            } else {
                setError(data.message || "Failed to submit review.");
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const activeRating = hoveredRating || selectedRating;

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1050,
                padding: "16px",
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    width: "100%",
                    maxWidth: "440px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                    animation: "modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                }}
            >
                <style>{`
                    @keyframes modalPop {
                        from { opacity: 0; transform: scale(0.88); }
                        to   { opacity: 1; transform: scale(1); }
                    }
                `}</style>

                {/* ── Header ── */}
                <div
                    style={{
                        backgroundColor: "#E8EDF4",
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    {/* Product thumbnail */}
                    <img
                        src={`${IMAGE_BASE_URL}/media/${item.product_image}`}
                        alt={item.product_name}
                        style={{
                            width: "48px",
                            height: "58px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            flexShrink: 0,
                        }}
                        onError={(e) => {
                            e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='58'%3E%3Crect fill='%23e9ecef' width='48' height='58'/%3E%3C/svg%3E";
                        }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: "11px",
                                color: "#6C757D",
                                fontFamily: "'Merriweather', serif",
                                marginBottom: "2px",
                            }}
                        >
                            Rate Product
                        </div>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#002557",
                                fontFamily: "'Merriweather', serif",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {item.product_name}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#6C757D",
                            fontSize: "20px",
                            lineHeight: 1,
                            padding: "4px",
                            flexShrink: 0,
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* ── Body ── */}
                <div style={{ padding: "24px 24px 8px" }}>
                    {/* Question */}
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#212529",
                            marginBottom: "16px",
                            fontFamily: "'Merriweather', serif",
                        }}
                    >
                        How would you rate this product?
                    </p>

                    {/* Stars */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            marginBottom: "12px",
                        }}
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setSelectedRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                style={{
                                    fontSize: "40px",
                                    cursor: "pointer",
                                    color: star <= activeRating ? "#F59E0B" : "#D1D5DB",
                                    transform: star <= activeRating ? "scale(1.2)" : "scale(1)",
                                    transition: "transform 0.15s ease, color 0.15s ease",
                                    display: "inline-block",
                                    lineHeight: 1,
                                    userSelect: "none",
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    {/* Rating label */}
                    {selectedRating > 0 && (
                        <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    backgroundColor: "#FFF8E1",
                                    border: "1px solid #FFE082",
                                    borderRadius: "20px",
                                    padding: "4px 14px",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: ratingColors[selectedRating],
                                    fontFamily: "'Merriweather', serif",
                                }}
                            >
                                {ratingLabels[selectedRating]} {ratingEmojis[selectedRating]}
                            </span>
                        </div>
                    )}

                    {/* Review text */}
                    <div style={{ marginBottom: "16px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#212529",
                                marginBottom: "8px",
                                fontFamily: "'Merriweather', serif",
                            }}
                        >
                            Write a Review{" "}
                            <span style={{ fontWeight: "400", color: "#6C757D" }}>
                                (Optional)
                            </span>
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            maxLength={300}
                            rows={3}
                            placeholder="Share your thoughts about this product..."
                            style={{
                                width: "100%",
                                border: "1px solid #DEE2E6",
                                borderRadius: "10px",
                                padding: "10px 12px",
                                fontSize: "13px",
                                fontFamily: "'Merriweather', serif",
                                resize: "none",
                                outline: "none",
                                color: "#212529",
                                backgroundColor: "#F8F9FA",
                                boxSizing: "border-box",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#002557")}
                            onBlur={(e) => (e.target.style.borderColor = "#DEE2E6")}
                        />
                        <div
                            style={{
                                textAlign: "right",
                                fontSize: "11px",
                                color: "#ADB5BD",
                                marginTop: "4px",
                                fontFamily: "'Merriweather', serif",
                            }}
                        >
                            {reviewText.length}/300
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            style={{
                                backgroundColor: "#FEE2E2",
                                color: "#B91C1C",
                                borderRadius: "8px",
                                padding: "10px 12px",
                                fontSize: "13px",
                                marginBottom: "12px",
                                fontFamily: "'Merriweather', serif",
                            }}
                        >
                            {error}
                        </div>
                    )}
                </div>

                {/* ── Footer Buttons ── */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        padding: "8px 24px 24px",
                    }}
                >
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #DEE2E6",
                            backgroundColor: "white",
                            color: "#6C757D",
                            fontSize: "14px",
                            fontWeight: "500",
                            fontFamily: "'Merriweather', serif",
                            cursor: submitting ? "not-allowed" : "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{
                            flex: 2,
                            padding: "12px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: submitting ? "#6B7280" : "#002557",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "700",
                            fontFamily: "'Merriweather', serif",
                            cursor: submitting ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) => {
                            if (!submitting) e.currentTarget.style.backgroundColor = "#001a3d";
                        }}
                        onMouseOut={(e) => {
                            if (!submitting) e.currentTarget.style.backgroundColor = "#002557";
                        }}
                    >
                        {submitting ? (
                            <>
                                <span
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTopColor: "white",
                                        borderRadius: "50%",
                                        animation: "spin 0.7s linear infinite",
                                        display: "inline-block",
                                    }}
                                />
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-send" style={{ fontSize: "14px" }} />
                                Submit Review
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────
// Main MyOrdersScreen
// ─────────────────────────────────────────────────────────────────
const MyOrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Rating modal state
    const [ratingModal, setRatingModal] = useState(null); // { item, orderId }
    const [successMsg, setSuccessMsg] = useState("");
    const successTimer = useRef(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const perPage = 10;

    const token = localStorage.getItem("authToken");

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        setError("");
        try {
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;
            const url = `${API_ENDPOINTS.GET_USER_ORDER_PAGINATION}?page=${page}&per_page=${perPage}`;
            const response = await fetch(url, { method: "GET", headers });
            const data = await response.json();
            if (response.ok && data.status === "success" && Array.isArray(data.orders)) {
                setOrders(data.orders);
                setPagination(data.pagination);
            } else {
                setOrders([]);
                setError(data.message || "Failed to fetch orders.");
            }
        } catch (err) {
            setOrders([]);
            setError("An error occurred while fetching orders.");
        } finally {
            setLoading(false);
        }
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

    const handleTrackOrder = (order) => {
        setSelectedOrder(order);
        setShowTrackingModal(true);
    };

    const closeTrackingModal = () => {
        setShowTrackingModal(false);
        setSelectedOrder(null);
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            const url = `${API_ENDPOINTS.INVOICEDOWNLOAD}${orderId}/invoice/`;
            window.open(url, "_blank");
        } catch (error) {
            alert("Error opening invoice.");
        }
    };

    const handleOpenRating = (item, orderId) => {
        setRatingModal({ item, orderId });
    };

    const handleCloseRating = () => {
        setRatingModal(null);
    };

    const handleReviewSuccess = (productName) => {
        clearTimeout(successTimer.current);
        setSuccessMsg(`🎉 Review for "${productName}" submitted!`);
        successTimer.current = setTimeout(() => setSuccessMsg(""), 4000);
    };

    const isDelivered = (status) =>
        ["DELIVERED", "COMPLETED"].includes(status?.toUpperCase());

    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING":      return { bg: "#FFF3CD", color: "#856404", text: "PENDING" };
            case "DELIVERED":    return { bg: "#D4EDDA", color: "#155724", text: "DELIVERED" };
            case "CANCELLED":
            case "CANCELED":    return { bg: "#F8D7DA", color: "#721C24", text: "CANCELLED" };
            case "PROCESSING":  return { bg: "#D1ECF1", color: "#0C5460", text: "PROCESSING" };
            case "SHIPPED":     return { bg: "#CCE5FF", color: "#004085", text: "SHIPPED" };
            default:            return { bg: "#E2E3E5", color: "#383D41", text: status?.toUpperCase() || "N/A" };
        }
    };

    const shouldShowTrackButton = (order) => {
        const status = order.status?.toUpperCase();
        return order.awb_no && status !== "CANCELLED" && status !== "CANCELED";
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "numeric", day: "numeric", year: "numeric",
            hour: "numeric", minute: "2-digit", hour12: true,
        });
    };

    const getPageNumbers = () => {
        if (!pagination) return [];
        const total = pagination.total_pages;
        const current = pagination.current_page;
        const pages = [];
        if (total <= 5) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else if (current <= 3) {
            pages.push(1, 2, 3, 4, "...", total);
        } else if (current >= total - 2) {
            pages.push(1, "...", total - 3, total - 2, total - 1, total);
        } else {
            pages.push(1, "...", current - 1, current, current + 1, "...", total);
        }
        return pages;
    };

    const paginationStyle = {
        wrapper: {
            display: "flex", justifyContent: "center", alignItems: "center",
            gap: "8px", padding: "24px 0 8px",
        },
        btn: (isActive, isDisabled) => ({
            minWidth: "38px", height: "38px", padding: "0 10px",
            borderRadius: "8px",
            border: isActive ? "none" : "1px solid #DEE2E6",
            backgroundColor: isActive ? "#E05C3A" : "white",
            color: isActive ? "white" : isDisabled ? "#ADB5BD" : "#E05C3A",
            fontWeight: isActive ? "700" : "500", fontSize: "14px",
            cursor: isDisabled ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s", fontFamily: "'Merriweather', serif",
            boxShadow: isActive ? "0 2px 6px rgba(224,92,58,0.3)" : "none",
            opacity: isDisabled ? 0.5 : 1,
        }),
        ellipsis: {
            color: "#ADB5BD", fontSize: "14px", padding: "0 4px",
            display: "flex", alignItems: "center",
        },
    };

    return (
        <main style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}>

            {/* ── Global success toast ── */}
            {successMsg && (
                <div
                    style={{
                        position: "fixed", bottom: "24px", left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#166534", color: "white",
                        padding: "12px 20px", borderRadius: "12px",
                        fontSize: "14px", fontFamily: "'Merriweather', serif",
                        fontWeight: "600", zIndex: 2000,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        whiteSpace: "nowrap",
                        animation: "fadeUp 0.3s ease",
                    }}
                >
                    <style>{`@keyframes fadeUp { from { opacity:0; transform: translateX(-50%) translateY(12px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
                    {successMsg}
                </div>
            )}

            {/* ── Header ── */}
            <section
                className="page-header"
                style={{ marginTop: "56px", backgroundColor: "white", borderBottom: "1px solid #E0E0E0", padding: "16px 0" }}
            >
                <div className="container">
                    <h4 className="mb-0" style={{ color: "#002557", fontWeight: "700", fontSize: "20px", fontFamily: "'Merriweather', serif" }}>
                        My Orders
                        {pagination && (
                            <span style={{ fontSize: "13px", color: "#6C757D", fontWeight: "400", marginLeft: "8px" }}>
                                ({pagination.total_count} total)
                            </span>
                        )}
                    </h4>
                </div>
            </section>

            {/* ── Orders List ── */}
            <section style={{ padding: "16px 0" }}>
                <div className="container">
                    {loading ? (
                        <div className="text-center py-5"><LoadingSpinner /></div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-5">
                            <div style={{ fontSize: "64px", opacity: 0.3 }}>📦</div>
                            <h5 className="text-muted mt-3">No Orders</h5>
                            <p className="text-muted">You haven't made any orders yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex flex-column gap-3">
                                {orders.map((order) => {
                                    const statusBadge = getStatusBadgeClass(order.status);
                                    const orderDelivered = isDelivered(order.status);

                                    return (
                                        <div
                                            key={order.order_id}
                                            style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}
                                        >
                                            {/* Order Header */}
                                            <div style={{ backgroundColor: "#E8EDF4", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div>
                                                    <div style={{ color: "#002557", fontWeight: "700", fontSize: "15px", fontFamily: "'Merriweather', serif", marginBottom: "2px" }}>
                                                        Order #{order.order_id}
                                                    </div>
                                                    <div style={{ color: "#6C757D", fontSize: "11px" }}>{formatDate(order.created_at)}</div>
                                                </div>
                                                <span style={{ backgroundColor: statusBadge.bg, color: statusBadge.color, fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px", padding: "4px 10px", borderRadius: "12px", fontFamily: "'Merriweather', serif" }}>
                                                    {statusBadge.text}
                                                </span>
                                            </div>

                                            {/* Order Body */}
                                            <div style={{ padding: "16px" }}>
                                                {/* Payment Info Row */}
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <div style={{ backgroundColor: "#E8EDF4", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <i className="bi bi-credit-card" style={{ color: "#002557", fontSize: "14px" }}></i>
                                                        </div>
                                                        <div style={{ fontSize: "12px", fontWeight: "500", color: "#212529", fontFamily: "'Merriweather', serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {order.payment_method || "N/A"}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <div style={{ backgroundColor: "#E8EDF4", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <i className="bi bi-wallet2" style={{ color: "#002557", fontSize: "14px" }}></i>
                                                        </div>
                                                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#002557", fontFamily: "'Merriweather', serif" }}>
                                                            ₹{order.total_amount?.toFixed(2) || "0.00"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Payment Status, Date, Address */}
                                                <div style={{ backgroundColor: "#F8F9FA", borderRadius: "8px", padding: "12px", marginBottom: "16px", fontSize: "13px", lineHeight: "1.6" }}>
                                                    <div style={{ marginBottom: "8px" }}>
                                                        <strong style={{ color: "#212529" }}>Payment:</strong>{" "}
                                                        <span style={{ color: "#495057" }}>{order.payment_status || "N/A"} ({order.payment_method || "N/A"})</span>
                                                    </div>
                                                    <div style={{ marginBottom: "8px" }}>
                                                        <strong style={{ color: "#212529" }}>Date:</strong>{" "}
                                                        <span style={{ color: "#495057" }}>{formatDate(order.created_at)}</span>
                                                    </div>
                                                    {order.address && (
                                                        <div>
                                                            <strong style={{ color: "#212529" }}>Address:</strong>{" "}
                                                            <span style={{ color: "#495057" }}>
                                                                {order.address.full_name}, {order.address.address_line}, {order.address.city}, {order.address.state}, {order.address.postal_code}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Order Items Header */}
                                                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                                                    <i className="bi bi-bag-check" style={{ color: "#002557", fontSize: "14px" }}></i>
                                                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#002557", fontFamily: "'Merriweather', serif" }}>
                                                        Order Items ({order.items?.length || 0})
                                                    </span>
                                                </div>

                                                {/* Order Items */}
                                                {order.items?.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{ backgroundColor: "#F8F9FA", border: "1px solid #DEE2E6", borderRadius: "8px", padding: "10px", marginBottom: "8px" }}
                                                    >
                                                        <div style={{ display: "flex", gap: "10px" }}>
                                                            {/* Image */}
                                                            <div style={{ flexShrink: 0, borderRadius: "6px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }}>
                                                                <img
                                                                    src={`${IMAGE_BASE_URL}/media/${item.product_image}`}
                                                                    alt={item.product_name}
                                                                    style={{ width: "60px", height: "75px", objectFit: "cover", display: "block" }}
                                                                    onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='75'%3E%3Crect fill='%23e9ecef' width='60' height='75'/%3E%3C/svg%3E"; }}
                                                                />
                                                            </div>

                                                            {/* Info */}
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontSize: "13px", fontWeight: "600", color: "#212529", marginBottom: "6px", lineHeight: "1.4", fontFamily: "'Merriweather', serif", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                                    {item.product_name}
                                                                </div>
                                                                <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                                                                    {item.size && (
                                                                        <div style={{ backgroundColor: "white", border: "1px solid #CED4DA", borderRadius: "4px", padding: "3px 6px", display: "flex", alignItems: "center", gap: "3px" }}>
                                                                            <i className="bi bi-rulers" style={{ fontSize: "11px", color: "#6C757D" }}></i>
                                                                            <span style={{ fontSize: "10px", color: "#495057", fontFamily: "'Merriweather', serif" }}>{item.size}</span>
                                                                        </div>
                                                                    )}
                                                                    <div style={{ backgroundColor: "white", border: "1px solid #CED4DA", borderRadius: "4px", padding: "3px 6px", display: "flex", alignItems: "center", gap: "3px" }}>
                                                                        <i className="bi bi-cart" style={{ fontSize: "11px", color: "#6C757D" }}></i>
                                                                        <span style={{ fontSize: "10px", color: "#495057", fontFamily: "'Merriweather', serif" }}>Qty: {item.quantity}</span>
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#002557", fontFamily: "'Merriweather', serif" }}>
                                                                        ₹{item.price?.toFixed(2) || "0.00"}
                                                                    </span>
                                                                    {item.discount_percentage > 0 && (
                                                                        <span style={{ backgroundColor: "#D4EDDA", color: "#155724", fontSize: "9px", fontWeight: "600", padding: "2px 5px", borderRadius: "3px", fontFamily: "'Merriweather', serif" }}>
                                                                            {item.discount_percentage}% OFF
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* ── Rate This Product button — only for delivered orders ── */}
                                                        {orderDelivered && (
                                                            <>
                                                                <div style={{ height: "1px", backgroundColor: "#DEE2E6", margin: "10px 0" }} />
                                                                <button
                                                                    onClick={() => handleOpenRating(item, order.uo_id || order.order_id)}
                                                                    style={{
                                                                        width: "100%",
                                                                        backgroundColor: "#FFF8E1",
                                                                        color: "#F57C00",
                                                                        border: "1px solid #F57C00",
                                                                        borderRadius: "7px",
                                                                        padding: "8px",
                                                                        fontSize: "13px",
                                                                        fontWeight: "600",
                                                                        fontFamily: "'Merriweather', serif",
                                                                        cursor: "pointer",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        gap: "6px",
                                                                        transition: "all 0.2s",
                                                                    }}
                                                                    onMouseOver={(e) => {
                                                                        e.currentTarget.style.backgroundColor = "#F57C00";
                                                                        e.currentTarget.style.color = "white";
                                                                    }}
                                                                    onMouseOut={(e) => {
                                                                        e.currentTarget.style.backgroundColor = "#FFF8E1";
                                                                        e.currentTarget.style.color = "#F57C00";
                                                                    }}
                                                                >
                                                                    <i className="bi bi-star" style={{ fontSize: "14px" }} />
                                                                    Rate This Product
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Action Buttons */}
                                                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                                                    <button
                                                        onClick={() => handleDownloadInvoice(order.uo_id || order.order_id)}
                                                        style={{ flex: 1, backgroundColor: "white", color: "#1B3A5E", border: "2px solid #1B3A5E", borderRadius: "12px", padding: "12px", fontSize: "16px", fontWeight: "700", fontFamily: "'Merriweather', serif", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                                                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#1B3A5E"; e.currentTarget.style.color = "white"; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "#1B3A5E"; }}
                                                    >
                                                        <i className="bi bi-download" style={{ fontSize: "18px" }}></i>
                                                        Download Invoice
                                                    </button>

                                                    {shouldShowTrackButton(order) && (
                                                        <button
                                                            onClick={() => handleTrackOrder(order)}
                                                            style={{ flex: 1, backgroundColor: "#1B5E7F", color: "white", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: "600", fontFamily: "'Merriweather', serif", cursor: "pointer", transition: "background-color 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#134560"}
                                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1B5E7F"}
                                                        >
                                                            <i className="bi bi-truck"></i>
                                                            Track Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.total_pages > 1 && (
                                <div style={paginationStyle.wrapper}>
                                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.has_previous} style={paginationStyle.btn(false, !pagination.has_previous)}>Previous</button>
                                    {getPageNumbers().map((page, idx) =>
                                        page === "..." ? (
                                            <span key={`e-${idx}`} style={paginationStyle.ellipsis}>...</span>
                                        ) : (
                                            <button key={page} onClick={() => handlePageChange(page)} style={paginationStyle.btn(page === currentPage, false)}>{page}</button>
                                        )
                                    )}
                                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.has_next} style={paginationStyle.btn(false, !pagination.has_next)}>Next</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Tracking Modal */}
            {showTrackingModal && selectedOrder && (
                <TrackingModal awbCode={selectedOrder.awb_no} orderId={selectedOrder.order_id} onClose={closeTrackingModal} />
            )}

            {/* Rating Modal */}
            {ratingModal && (
                <RatingModal
                    item={ratingModal.item}
                    orderId={ratingModal.orderId}
                    onClose={handleCloseRating}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </main>
    );
};

export default MyOrdersScreen;