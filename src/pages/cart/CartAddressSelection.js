import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartBannerHeader from "./CartBannerHeader";
import Checkout from "./Checkout";
import { Modal } from "react-bootstrap";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import API_ENDPOINTS from "../../api/apiConfig";
import '../../assets/css/lux-cart.css';

const CartAddressSelection = () => {
  const [addresses, setAddresses]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [error, setError]                   = useState("");
  const [showAddModal, setShowAddModal]     = useState(false);
  const [showEditModal, setShowEditModal]   = useState(false);
  const [editAddress, setEditAddress]       = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to view addresses.");
        setLoading(false);
        return;
      }
      const res = await fetch(API_ENDPOINTS.GET_USER_ADDRESS, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      if (Array.isArray(data.addresses) && data.addresses.length > 0) {
        setAddresses(data.addresses);
        // Auto-select the last address by default
        const lastAddr = data.addresses[data.addresses.length - 1];
        setSelectedAddressId(lastAddr.address_id || lastAddr.id);
      } else {
        setAddresses([]);
      }
    } catch {
      setError("Could not load addresses.");
    }
    setLoading(false);
  };

  const handleSelect = (id) => setSelectedAddressId(id);

  const handleContinue = () => {
    const selected = addresses.find(
      (addr) => (addr.id || addr.address_id) === selectedAddressId
    );
    if (selected) {
      localStorage.setItem("selectedAddress", JSON.stringify(selected));
      navigate("/payment-method");
    }
  };

  const handleShowAddModal  = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleShowEditModal = (address) => {
    setEditAddress(address);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setEditAddress(null);
    setShowEditModal(false);
  };

  const handleAddressChanged = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditAddress(null);
    setTimeout(() => fetchAddresses(), 1000);
  };

  return (
    <main className="lux-address-page">
      <CartBannerHeader currentStep={2} />

      <div className="lux-page-header">
        <p className="lux-page-subtitle">Step 2 of 3</p>
        <h2 className="lux-page-title">Delivery Address</h2>
      </div>

      <section className="lux-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-9">

              <div className="d-flex justify-content-end">
                <button className="lux-add-btn" onClick={handleShowAddModal}>
                  <FaPlusCircle />
                  Add New Address
                </button>
              </div>

              {loading ? (
                <div className="lux-loading">Loading your addresses</div>
              ) : error ? (
                <div className="text-center py-5" style={{ color: "#c0392b", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
                  {error}
                </div>
              ) : addresses.length === 0 ? (
                <div className="lux-empty">
                  <div className="lux-empty-icon">◻</div>
                  <h3 className="lux-empty-title">No saved addresses found</h3>
                  <button className="lux-btn-primary" onClick={handleShowAddModal}>
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <>
                  <div className="address-list mb-2">
                    {addresses.map((addr, idx) => {
                      const id         = addr.address_id || addr.id;
                      const key        = id ? `address-${id}` : `address-${idx}`;
                      const isSelected = selectedAddressId === id;

                      return (
                        <div
                          key={key}
                          className={`lux-address-card ${isSelected ? "selected" : ""}`}
                          onClick={() => handleSelect(id)}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div style={{ flex: 1 }}>
                              <div className="lux-addr-name">{addr.full_name}</div>
                              <div className="lux-addr-phone">{addr.contact_no}</div>
                              <div className="lux-addr-line">
                                {addr.address_line}<br />
                                {(addr.city || addr.city_name)}, {(addr.state || addr.state_name)} — {addr.postal_code}
                              </div>
                              {addr.address_type && (
                                <span className="lux-addr-type">{addr.address_type}</span>
                              )}
                            </div>
                            <div className="d-flex align-items-center gap-2" style={{ marginLeft: 20, paddingTop: 2 }}>
                              <button
                                className="lux-edit-btn"
                                onClick={(e) => { e.stopPropagation(); handleShowEditModal(addr); }}
                                title="Edit Address"
                              >
                                <FaEdit />
                              </button>
                              <input
                                type="radio"
                                className="lux-radio"
                                checked={isSelected}
                                onChange={() => handleSelect(id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="lux-divider" />

                  <div className="lux-actions">
                    <button className="lux-btn-secondary" onClick={() => navigate("/cart")}>
                      ← Back to Cart
                    </button>
                    <button
                      className="lux-btn-primary"
                      disabled={!selectedAddressId}
                      onClick={handleContinue}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Add Address Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} size="lg" centered>
        <Modal.Header closeButton style={{ borderBottom: "1px solid #ece8e1" }}>
          <Modal.Title style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.5rem", letterSpacing: "0.04em" }}>
            Add New Address
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#fafaf8" }}>
          <Checkout
            addressOnly={true}
            onAddressAdded={handleAddressChanged}
            onCancel={handleCloseAddModal}
          />
        </Modal.Body>
      </Modal>

      {/* Edit Address Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg" centered>
        <Modal.Header closeButton style={{ borderBottom: "1px solid #ece8e1" }}>
          <Modal.Title style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.5rem", letterSpacing: "0.04em" }}>
            Edit Address
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#fafaf8" }}>
          <Checkout
            addressOnly={true}
            editAddress={editAddress}
            onAddressAdded={handleAddressChanged}
            onCancel={handleCloseEditModal}
            key={editAddress ? editAddress.address_id || editAddress.id : "new"}
          />
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default CartAddressSelection;