import React, { useState, useEffect } from "react";
import { trackShipmentByAwb } from "../../api/trackingService";
import LoadingSpinner from "../../components/LoadingSpinner";

const TrackingModal = ({ awbCode, orderId, onClose }) => {
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("authToken");

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            
            return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
        } catch (e) {
            return dateString;
        }
    };

    const fetchTracking = async () => {
        setLoading(true);
        setError("");

        const result = await trackShipmentByAwb(awbCode, token);

        if (result.success) {
            setTrackingData(result.data);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchTracking();
    }, [awbCode]);

    const getStatusIcon = (status) => {
        if (!status) return "🚚";
        const statusLower = status.toLowerCase();
        if (statusLower.includes("delivered")) return "✅";
        if (statusLower.includes("transit") || statusLower.includes("shipped")) return "🚚";
        if (statusLower.includes("picked")) return "📦";
        if (statusLower.includes("pending")) return "⏳";
        return "🚚";
    };

    const isDelivered = trackingData?.shipment_summary?.current_status?.toLowerCase().includes("delivered");

    return (
        <div 
            className="modal fade show d-block" 
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={onClose}
        >
            <div 
                className="modal-dialog modal-lg modal-dialog-scrollable"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header" style={{ backgroundColor: "#002557", color: "white" }}>
                        <h5 className="modal-title">Track Order #{orderId}</h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={onClose}
                        ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {loading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <div className="text-center py-5">
                                <div className="text-danger mb-3" style={{ fontSize: "48px" }}>⚠️</div>
                                <p className="text-muted">{error}</p>
                                <button className="btn btn-primary" onClick={fetchTracking}>
                                    <i className="bi bi-arrow-clockwise me-2"></i>Retry
                                </button>
                            </div>
                        ) : trackingData && trackingData.success ? (
                            <>
                                {/* Status Card */}
                                <div 
                                    className="card text-white mb-3"
                                    style={{
                                        background: `linear-gradient(135deg, #002557 0%, ${isDelivered ? '#28a745' : '#003d82'} 100%)`,
                                        border: "none",
                                    }}
                                >
                                    <div className="card-body text-center py-4">
                                        <div 
                                            className="mb-3" 
                                            style={{ fontSize: "48px" }}
                                        >
                                            {getStatusIcon(trackingData.shipment_summary?.current_status)}
                                        </div>
                                        <h4 className="mb-2">
                                            {trackingData.shipment_summary?.current_status || "Unknown Status"}
                                        </h4>
                                        <p className="mb-0 opacity-75">
                                            {trackingData.shipment_summary?.courier_name || "Courier"}
                                        </p>
                                        
                                        {trackingData.shipment_summary?.edd && !isDelivered && (
                                            <div className="mt-3">
                                                <span 
                                                    className="badge bg-white bg-opacity-25 px-3 py-2"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    📅 Expected: {formatDateTime(trackingData.shipment_summary.edd)}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {trackingData.shipment_summary?.delivered_date && (
                                            <div className="mt-3">
                                                <span 
                                                    className="badge bg-white bg-opacity-25 px-3 py-2"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    ✅ Delivered: {formatDateTime(trackingData.shipment_summary.delivered_date)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Shipment Details - Compact */}
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h6 className="mb-3" style={{ color: "#002557" }}>
                                            <i className="bi bi-info-circle me-2"></i>
                                            Shipment Details
                                        </h6>
                                        
                                        <div className="row g-2">
                                            {/* AWB and Weight */}
                                            <div className="col-md-6">
                                                <div 
                                                    className="p-2 rounded" 
                                                    style={{ backgroundColor: "#E8EDF4" }}
                                                >
                                                    <div className="d-flex align-items-start">
                                                        <i className="bi bi-qr-code me-2" style={{ color: "#002557" }}></i>
                                                        <div className="flex-grow-1">
                                                            <small className="text-muted d-block" style={{ fontSize: "10px" }}>AWB</small>
                                                            <strong style={{ fontSize: "12px" }}>
                                                                {trackingData.shipment_summary?.awb_code || "N/A"}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {trackingData.shipment_summary?.weight && (
                                                <div className="col-md-6">
                                                    <div 
                                                        className="p-2 rounded" 
                                                        style={{ backgroundColor: "#E8EDF4" }}
                                                    >
                                                        <div className="d-flex align-items-start">
                                                            <i className="bi bi-box-seam me-2" style={{ color: "#002557" }}></i>
                                                            <div className="flex-grow-1">
                                                                <small className="text-muted d-block" style={{ fontSize: "10px" }}>Weight</small>
                                                                <strong style={{ fontSize: "12px" }}>
                                                                    {trackingData.shipment_summary.weight} kg
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Origin and Destination */}
                                            <div className="col-md-6">
                                                <div 
                                                    className="p-2 rounded" 
                                                    style={{ backgroundColor: "#E8EDF4" }}
                                                >
                                                    <div className="d-flex align-items-start">
                                                        <i className="bi bi-geo-alt me-2" style={{ color: "#002557" }}></i>
                                                        <div className="flex-grow-1">
                                                            <small className="text-muted d-block" style={{ fontSize: "10px" }}>From</small>
                                                            <strong style={{ fontSize: "12px" }}>
                                                                {trackingData.shipment_summary?.origin || "N/A"}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <div 
                                                    className="p-2 rounded" 
                                                    style={{ backgroundColor: "#E8EDF4" }}
                                                >
                                                    <div className="d-flex align-items-start">
                                                        <i className="bi bi-geo-alt-fill me-2" style={{ color: "#002557" }}></i>
                                                        <div className="flex-grow-1">
                                                            <small className="text-muted d-block" style={{ fontSize: "10px" }}>To</small>
                                                            <strong style={{ fontSize: "12px" }}>
                                                                {trackingData.shipment_summary?.destination || "N/A"}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Consignee */}
                                            {trackingData.shipment_summary?.consignee_name && (
                                                <div className="col-12">
                                                    <div 
                                                        className="p-2 rounded" 
                                                        style={{ backgroundColor: "#E8EDF4" }}
                                                    >
                                                        <div className="d-flex align-items-start">
                                                            <i className="bi bi-person me-2" style={{ color: "#002557" }}></i>
                                                            <div className="flex-grow-1">
                                                                <small className="text-muted d-block" style={{ fontSize: "10px" }}>Consignee</small>
                                                                <strong style={{ fontSize: "12px" }}>
                                                                    {trackingData.shipment_summary.consignee_name}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Pickup Date */}
                                            {trackingData.shipment_summary?.pickup_date && (
                                                <div className="col-12">
                                                    <div 
                                                        className="p-2 rounded" 
                                                        style={{ backgroundColor: "#E8EDF4" }}
                                                    >
                                                        <div className="d-flex align-items-start">
                                                            <i className="bi bi-calendar-check me-2" style={{ color: "#002557" }}></i>
                                                            <div className="flex-grow-1">
                                                                <small className="text-muted d-block" style={{ fontSize: "10px" }}>Pickup</small>
                                                                <strong style={{ fontSize: "12px" }}>
                                                                    {formatDateTime(trackingData.shipment_summary.pickup_date)}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0" style={{ color: "#002557" }}>
                                                <i className="bi bi-clock-history me-2"></i>
                                                Tracking Timeline
                                            </h6>
                                            <span 
                                                className="badge" 
                                                style={{ backgroundColor: "#E8EDF4", color: "#002557" }}
                                            >
                                                {trackingData.tracking_timeline?.length || 0} updates
                                            </span>
                                        </div>

                                        {trackingData.tracking_timeline && trackingData.tracking_timeline.length > 0 ? (
                                            <div className="timeline">
                                                {trackingData.tracking_timeline.map((activity, index) => (
                                                    <div key={index} className="timeline-item d-flex">
                                                        <div className="timeline-marker">
                                                            <div 
                                                                className={`timeline-dot ${index === 0 ? 'active' : ''}`}
                                                                style={{
                                                                    width: index === 0 ? "14px" : "10px",
                                                                    height: index === 0 ? "14px" : "10px",
                                                                    backgroundColor: index === 0 ? "#002557" : "white",
                                                                    border: "2px solid #002557",
                                                                    borderRadius: "50%",
                                                                    boxShadow: index === 0 ? "0 0 8px rgba(0,37,87,0.3)" : "none"
                                                                }}
                                                            ></div>
                                                            {index < trackingData.tracking_timeline.length - 1 && (
                                                                <div 
                                                                    className="timeline-line"
                                                                    style={{
                                                                        width: "2px",
                                                                        height: "100%",
                                                                        backgroundColor: "#E8EDF4",
                                                                        margin: "4px auto"
                                                                    }}
                                                                ></div>
                                                            )}
                                                        </div>
                                                        
                                                        <div 
                                                            className="timeline-content flex-grow-1 ms-3 mb-3"
                                                            style={{
                                                                padding: "12px",
                                                                backgroundColor: index === 0 ? "#E8EDF4" : "white",
                                                                border: `1px solid ${index === 0 ? '#002557' : '#dee2e6'}`,
                                                                borderRadius: "10px",
                                                                borderWidth: index === 0 ? "1.5px" : "1px"
                                                            }}
                                                        >
                                                            <p 
                                                                className="mb-1" 
                                                                style={{ 
                                                                    fontSize: "12px",
                                                                    fontWeight: index === 0 ? "bold" : "600",
                                                                    color: index === 0 ? "#002557" : "#000"
                                                                }}
                                                            >
                                                                {activity.activity || "Update"}
                                                            </p>
                                                            
                                                            {activity.location && (
                                                                <small className="text-muted d-block" style={{ fontSize: "10px" }}>
                                                                    <i className="bi bi-geo-alt me-1"></i>
                                                                    {activity.location}
                                                                </small>
                                                            )}
                                                            
                                                            {activity.date && (
                                                                <small className="text-muted d-block" style={{ fontSize: "10px" }}>
                                                                    <i className="bi bi-clock me-1"></i>
                                                                    {formatDateTime(activity.date)}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center text-muted py-4">
                                                <i className="bi bi-clock-history" style={{ fontSize: "48px" }}></i>
                                                <p className="mt-2">No tracking updates yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted">No tracking data available</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                        >
                            Close
                        </button>
                        {trackingData?.track_url && (
                            <a 
                                href={trackingData.track_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ backgroundColor: "#002557", borderColor: "#002557" }}
                            >
                                <i className="bi bi-box-arrow-up-right me-2"></i>
                                Open in Browser
                            </a>
                        )}
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            style={{ backgroundColor: "#002557", borderColor: "#002557" }}
                            onClick={fetchTracking}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;