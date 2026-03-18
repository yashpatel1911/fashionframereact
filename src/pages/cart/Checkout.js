import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../api/apiConfig";

const ADDRESS_TYPE_OPTIONS = [
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

const Checkout = ({
  addressOnly = false,
  editAddress = null,
  onAddressAdded,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    full_name: "",
    contact_no: "",
    email: "",
    address_line: "",
    state_id: "",
    city_id: "",
    postal_code: "",
    address_type: "",
    is_default_shipping: true,
    is_default_billing: false,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [statesError, setStatesError] = useState("");
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityDisabled, setCityDisabled] = useState(true);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Populate form for edit mode
  useEffect(() => {
    if (editAddress) {
      setFormData({
        full_name: editAddress.full_name || "",
        contact_no: editAddress.contact_no || "",
        email: editAddress.email || "",
        address_line: editAddress.address_line || "",
        state_id: editAddress.state_id || "",
        city_id: editAddress.city_id || "",
        postal_code: editAddress.postal_code || "",
        address_type: editAddress.address_type || "",
        is_default_shipping: !!editAddress.is_default_shipping,
        is_default_billing: !!editAddress.is_default_billing,
      });
    }
  }, [editAddress]);

  // Fetch states from API on mount (with access_token)
  useEffect(() => {
    setStatesLoading(true);
    setStatesError("");
    const token = localStorage.getItem("authToken");
    if (!token) {
      setStatesError("You must be logged in to select a state.");
      setStatesLoading(false);
      return;
    }
    fetch(API_ENDPOINTS.GET_STATES, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.states)) {
          setStates(data.states);
          localStorage.setItem("statesList", JSON.stringify(data.states));
        } else {
          setStates([]);
          setStatesError("Failed to load states.");
          localStorage.removeItem("statesList");
        }
        setStatesLoading(false);
      })
      .catch(() => {
        setStates([]);
        setStatesError("Failed to load states.");
        setStatesLoading(false);
        localStorage.removeItem("statesList");
      });
  }, []);

  // Fetch cities when state changes (with access_token)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (formData.state_id && token) {
      setCityDisabled(true);
      setCityLoading(true);
      const cityUrl = `${API_ENDPOINTS.GET_CITY}?state_id=${formData.state_id}`;
      fetch(cityUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          let cityList = [];
          if (Array.isArray(data.cities)) {
            cityList = data.cities;
          } else if (Array.isArray(data.data)) {
            cityList = data.data;
          }
          setCities(cityList);
          localStorage.setItem("citiesList", JSON.stringify(cityList));
          setCityDisabled(false);
          setCityLoading(false);
        })
        .catch(() => {
          setCities([]);
          setCityDisabled(false);
          setCityLoading(false);
          localStorage.removeItem("citiesList");
        });
    } else {
      setCities([]);
      setCityDisabled(true);
      localStorage.removeItem("citiesList");
    }
    // Reset city selection if state changes
    setFormData((prev) => ({ ...prev, city_id: "" }));
    // eslint-disable-next-line
  }, [formData.state_id]);

  // Fix: After cities are loaded in edit mode, ensure city_id is set so dropdown shows correct city
  useEffect(() => {
    if (
      editAddress &&
      editAddress.city_id &&
      cities.length > 0 &&
      formData.city_id !== editAddress.city_id
    ) {
      setFormData((prev) => ({
        ...prev,
        city_id: editAddress.city_id,
      }));
    }
    // eslint-disable-next-line
  }, [cities, editAddress]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setShowConfirm(false);

    // Prepare payload for API
    const payload = { ...formData };

    // If editing, include address_id (if your backend supports it for create)
    if (editAddress && editAddress.address_id) {
      payload.address_id = editAddress.address_id;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setApiError("You must be logged in to save address.");
      toast.error("You must be logged in to save address.", { position: "top-right", autoClose: 2000 });
      return;
    }

    try {
      const res = await fetch(
        API_ENDPOINTS.CREATE_USER_ADDRESS,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok && (data.status || data.success)) {
        setShowConfirm(true);
        toast.success("Address saved successfully!", { position: "top-right", autoClose: 2000 });
        setTimeout(() => {
          setShowConfirm(false);
          if (onAddressAdded) onAddressAdded();
        }, 1200);
      } else {
        setApiError(data.message || "Failed to save address.");
        toast.error(data.message || "Failed to save address.", { position: "top-right", autoClose: 2000 });
      }
    } catch (err) {
      setApiError("Failed to save address.");
      toast.error("Failed to save address.", { position: "top-right", autoClose: 2000 });
    }
  };

  // For addressOnly mode, show only address fields
  if (addressOnly) {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div className="shipping-info mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Contact No</label>
                <input
                  type="tel"
                  className="form-control"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Address Line</label>
                <input
                  type="text"
                  className="form-control"
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">State</label>
                <select
                  className="form-select"
                  name="state_id"
                  value={formData.state_id}
                  onChange={handleInputChange}
                  required
                  disabled={statesLoading}
                >
                  <option value="">
                    {statesLoading ? "Loading states..." : "Select State"}
                  </option>
                  {states.map((state) => (
                    <option key={state.state_id} value={state.state_id}>
                      {state.state_name}
                    </option>
                  ))}
                </select>
                {statesError && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "0.95em" }}
                  >
                    {statesError}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <select
                  className="form-select"
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleInputChange}
                  required
                  disabled={cityDisabled}
                >
                  <option value="">
                    {cityLoading ? "Loading cities..." : "Select City"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">ZIP Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Address Type</label>
                <select
                  className="form-select"
                  name="address_type"
                  value={formData.address_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {ADDRESS_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {apiError && (
            <div className="alert alert-danger mt-3">{apiError}</div>
          )}
          <div className="d-flex gap-2 mt-4">
            {onCancel && (
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-dark"
              disabled={
                showConfirm ||
                !formData.full_name ||
                !formData.contact_no ||
                !formData.email ||
                !formData.address_line ||
                !formData.city_id ||
                !formData.state_id ||
                !formData.postal_code ||
                !formData.address_type
              }
            >
              {editAddress ? "Update Address" : "Save Address"}
            </button>
            {showConfirm && (
              <div
                style={{
                  marginLeft: 10,
                  color: "#28a745",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Address Saved!
              </div>
            )}
          </div>
        </form>
        <ToastContainer />
      </>
    );
  }

  // ... (keep your original checkout form for non-addressOnly mode)
  // If you want to disable the original checkout form, you can return null here.
  return null;
};

export default Checkout;