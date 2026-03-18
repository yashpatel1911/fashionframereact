import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartBannerHeader from "./CartBannerHeader";
import Checkout from "./Checkout";
import { Modal } from "react-bootstrap";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import API_ENDPOINTS from "../../api/apiConfig"; // <-- Import API endpoints

const CartAddressSelection = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null); // Address object to edit
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
      const res = await fetch(
        API_ENDPOINTS.GET_USER_ADDRESS, // <-- Use API endpoint from config
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      if (Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
        setSelectedAddressId(null); // No address selected by default
      } else {
        setAddresses([]);
      }
    } catch (e) {
      setError("Could not load addresses.");
    }
    setLoading(false);
  };

  const handleSelect = (id) => {
    setSelectedAddressId(id);
  };

  const handleContinue = () => {
    const selected = addresses.find(addr => (addr.id || addr.address_id) === selectedAddressId);
    if (selected) {
      localStorage.setItem("selectedAddress", JSON.stringify(selected));
      navigate("/payment-method");
    }
  };

  // Add Address Modal
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  // Edit Address Modal
  const handleShowEditModal = (address) => {
    setEditAddress(address);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setEditAddress(null);
    setShowEditModal(false);
  };

  // When a new address is added or updated, refresh the address list
  const handleAddressChanged = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditAddress(null);
    setTimeout(() => {
      fetchAddresses();
    }, 1000);
  };

  return (
    <main>
      <CartBannerHeader currentStep={2} />
      <section className="page-header bg-light mb-5">
        <div className="container">
          <h2 className="page-title text-center mb-0 font-heading">Select Address</h2>
        </div>
      </section>
      <section className="cart-content pb-5">
        <div className="container">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-link d-flex align-items-center"
              style={{ fontSize: 18, textDecoration: "none" }}
              onClick={handleShowAddModal}
            >
              <FaPlusCircle style={{ marginRight: 6, color: "#222" }} />
              Add New Address
            </button>
          </div>
          {loading ? (
            <div className="text-center py-5">Loading addresses...</div>
          ) : error ? (
            <div className="text-center text-danger py-5">{error}</div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-5">
              <h2 className="h5 mb-4">No saved addresses found.</h2>
              <button
                className="btn btn-dark"
                onClick={handleShowAddModal}
              >
                Add New Address
              </button>
            </div>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="address-list mb-4">
                  {addresses.map((addr, idx) => {
                    // Use address_id if present, else id, else fallback to idx
                    const key = addr.address_id ? `address-${addr.address_id}` : (addr.id ? `address-${addr.id}` : `address-${idx}`);
                    const id = addr.address_id || addr.id;
                    return (
                      <div
                        key={key}
                        className={`address-card border rounded-3 p-4 mb-3 ${selectedAddressId === id ? "border-dark bg-light" : ""}`}
                        style={{ cursor: "pointer", position: "relative" }}
                        onClick={() => handleSelect(id)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold font-heading">{addr.full_name}</div>
                            <div className="text-muted small font-body">{addr.contact_no}</div>
                            <div className="font-body">{addr.address_line}</div>
                            <div className="font-body">
                              {(addr.city || addr.city_name)}, {(addr.state || addr.state_name)} - {addr.postal_code}
                            </div>
                            <div className="text-muted small font-body">
                              {addr.address_type ? addr.address_type.toUpperCase() : ""}
                              {/* Removed Default Shipping badge */}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2 font-body">
                            <input
                              type="radio"
                              checked={selectedAddressId === id}
                              onChange={() => handleSelect(id)}
                              onClick={e => e.stopPropagation()}
                            />
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              style={{ marginLeft: 8 }}
                              onClick={e => {
                                e.stopPropagation();
                                handleShowEditModal(addr);
                              }}
                              title="Edit Address"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-dark font-body"
                    onClick={() => navigate("/cart")}
                  >
                    Back to Cart
                  </button>
                  <button
                    className="btn btn-dark font-body"
                    disabled={!selectedAddressId}
                    onClick={handleContinue}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Modal for Add New Address */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Checkout
            addressOnly={true}
            onAddressAdded={handleAddressChanged}
            onCancel={handleCloseAddModal}
          />
        </Modal.Body>
      </Modal>
      {/* Modal for Edit Address */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Checkout
            addressOnly={true}
            editAddress={editAddress}
            onAddressAdded={handleAddressChanged}
            onCancel={handleCloseEditModal}
            // Pass a key to force remount when switching addresses
            key={editAddress ? editAddress.address_id || editAddress.id : "new"}
          />
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default CartAddressSelection;