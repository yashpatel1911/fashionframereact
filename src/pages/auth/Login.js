import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_ENDPOINTS from '../../api/apiConfig'; // <-- Import the API config

const Login = ({ show = false, onClose, switchToRegistration }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contact_no: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // <-- Loading state

  if (!show) return null;

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contact_no: formData.contact_no,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        toast.success('Login successful!', {
          position: 'top-center',
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate('/');
          window.location.reload();
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        toast.error(data.message || 'Login failed. Please check your credentials.', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
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
                <h4 className="text-center mb-4">Welcome Back</h4>
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="login-info">
                    <div className="mb-3">
                      <label className="form-label text-secondary">Contact Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="contact_no"
                        value={formData.contact_no}
                        onChange={handleInputChange}
                        required
                        autoComplete="contact_no"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-secondary">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="mb-4 d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label text-secondary" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-sm-row gap-2 mb-2">
                    <button
                      type="submit"
                      className="btn btn-dark flex-grow-1 py-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-light flex-grow-1 py-2"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Close
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="mb-0 text-secondary">
                      Don't have an account?{' '}
                      <a
                        href="#"
                        className="text-dark text-decoration-underline"
                        onClick={(e) => {
                          e.preventDefault();
                          if (switchToRegistration) switchToRegistration();
                        }}
                      >
                        Create one here
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

export default Login;
