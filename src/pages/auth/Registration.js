import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_ENDPOINTS from '../../api/apiConfig'; // Import the API config

const Registration = ({ show = false, onClose, switchToLogin }) => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    mobile: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [statesError, setStatesError] = useState("");
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityDisabled, setCityDisabled] = useState(true);

  // Fetch states from API on mount
  useEffect(() => {
    setStatesLoading(true);
    setStatesError("");

    fetch(API_ENDPOINTS.GET_STATES, {
      headers: {
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

  // Fetch cities when state changes 

  useEffect(() => {
    // Reset city selection when state changes
    setFormData((prev) => ({ ...prev, city_id: "" }));

    const fetchCities = async () => {
      try {
        setCityDisabled(true);
        setCityLoading(true);

        const cityUrl = `${API_ENDPOINTS.GET_CITY}?state_id=${formData.state_id}`;
        const res = await fetch(cityUrl, { headers: { "Content-Type": "application/json" } });
        const data = await res.json();

        let cityList = [];
        if (Array.isArray(data.cities)) cityList = data.cities;
        else if (Array.isArray(data.data)) cityList = data.data;

        setCities(cityList);
        localStorage.setItem("citiesList", JSON.stringify(cityList));
      } catch {
        setCities([]);
        localStorage.removeItem("citiesList");
      } finally {
        setCityDisabled(!formData.state_id);
        setCityLoading(false);
      }
    };

    if (formData.state_id) {
      fetchCities();
    } else {
      setCities([]);
      setCityDisabled(true);
      localStorage.removeItem("citiesList");
    }
  }, [formData.state_id]);


  if (!show) return null;


  // Responsive overlay style
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
    padding: 0,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !formData.mobile.trim() ||
      !formData.password.trim() ||
      !formData.city_id ||
      !formData.state_id
    ) {
      setError('All fields are required.');
      toast.error('All fields are required.', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    try {
      const payload = {
        pu_name: formData.name,
        pu_email: formData.email,
        pud_address: formData.address,
        pu_contact_no: formData.mobile,
        password: formData.password,
        state_id: formData.state_id,
        city_id: formData.city_id
      };

      const response = await fetch(API_ENDPOINTS.REGISTRATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Registration API response:', data); // Debug log

      if (response.ok && data.message) {
        toast.success(data.message || 'Registration successful!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          if (switchToLogin) switchToLogin();
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(data.error || 'Registration failed. Please check your details.');
        toast.error(data.error || 'Registration failed. Please check your details.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div style={overlayStyle}>
      <ToastContainer />
      <div
        className="container-fluid d-flex align-items-center justify-content-center py-4"
        style={{ zIndex: 1100, minHeight: '100vh' }}
      >
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow border-0">
              <div className="card-body px-3 px-sm-4 py-4">
                <h4 className="text-center mb-4">Create Account</h4>
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="registration-info">
                    <div className="mb-3">
                      <label className="form-label text-dark">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-dark">Mobile</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div className="row mb-3">
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
                          <div className="text-danger mt-1" style={{ fontSize: "0.95em" }}>
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
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button type="submit" className="btn btn-dark flex-grow-1 py-2">
                      Submit
                    </button>
                    <button type="button" className="btn btn-light flex-grow-1 py-2" onClick={onClose}>
                      Close
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="mb-0 text-secondary">
                      Already registered?{' '}
                      <a
                        href="#"
                        className="text-dark text-decoration-underline"
                        onClick={e => { e.preventDefault(); if (switchToLogin) switchToLogin(); }}
                      >
                        Login here
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;