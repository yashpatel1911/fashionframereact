import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart, faUser, faSignOutAlt, faBars, faTimes, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Registration from "../../pages/auth/Registration";
import Login from "../../pages/auth/Login";
import API_ENDPOINTS from "../../api/apiConfig";
import '../../assets/custom.css';
import { useUser } from "../../context/UserContext";

const getAccessToken = () => localStorage.getItem('authToken');

// Force black text style - will override everything
const FORCE_BLACK = {
  color: '#000000 !important',
  WebkitTextFillColor: '#000000',
  textShadow: 'none',
  opacity: 1
};

const Navbar = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [categoryData, setCategoryData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  
  const accountDropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAccessToken();
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(API_ENDPOINTS.GET_CATEGORY_SUBCATEGORY, {
          method: 'POST',
          headers,
        });

        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setCategoryData(data.data);
        } else {
          setCategoryData([]);
        }
      } catch {
        setCategoryData([]);
      }
    };
    fetchCategories();
  }, []);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    setShowRegistration(false);
    setShowLogin(false);
    setIsLoggedIn(!!localStorage.getItem('authToken'));
    setIsMenuOpen(false);
    setIsCategoryOpen(false);
    setIsAccountDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchToLogin = () => {
    setShowRegistration(false);
    setShowLogin(true);
  };

  const switchToRegistration = () => {
    setShowLogin(false);
    setShowRegistration(true);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsCategoryOpen(false);
  };

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const toggleAccountDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setIsAccountDropdownOpen(false);
    closeMenu();
    navigate('/profile');
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    setIsAccountDropdownOpen(false);
    closeMenu();
    navigate('/wishlist');
  };

  const handleOrderHistoryClick = (e) => {
    e.preventDefault();
    setIsAccountDropdownOpen(false);
    closeMenu();
    navigate('/order-history');
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('cart');
    localStorage.removeItem("pu_name");
    window.dispatchEvent(new Event('cartUpdated'));
    setIsLoggedIn(false);
    setIsAccountDropdownOpen(false);
    closeMenu();
    navigate('/');
    window.location.reload();
  };

  const getNavbarClasses = () => {
    let classes = 'navbar navbar-expand-lg text-uppercase fs-6 fixed-top';
    
    if (isHomePage && !scrolled) {
      classes += ' navbar-transparent';
    } else {
      classes += ' navbar-solid';
    }
    
    if (scrolled) {
      classes += ' navbar-scrolled';
    }
    
    return classes;
  };

  return (
    <div className="header-wrapper">
      <nav
        id="app-navbar"
        className={getNavbarClasses()}
        role="navigation"
      >
        <div className="container-fluid px-3 px-lg-4" style={{ overflow: 'visible' }}>
          <div className="d-flex justify-content-between align-items-center w-100" style={{ overflow: 'visible' }}>
            <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
              <img
                src={require('../../assets/images/appbar.png')}
                alt="Fashion Frame"
                className="img-fluid navbar-logo"
              />
            </Link>

            <button
              className="navbar-toggler border-0 p-2 d-lg-none"
              type="button"
              onClick={handleMenuToggle}
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
            >
              <FontAwesomeIcon 
                icon={isMenuOpen ? faTimes : faBars} 
                className="mobile-toggle-icon"
              />
            </button>

            <div 
              className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
              onClick={closeMenu}
            ></div>

            <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
              <div className="mobile-menu-header d-lg-none d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="mb-0 fw-bold" style={FORCE_BLACK}>Menu</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeMenu}
                  aria-label="Close menu"
                ></button>
              </div>

              <div className="mobile-menu-content">
                <ul className="navbar-nav mx-auto py-2 py-lg-0 gap-2 gap-lg-3">
                  <li className="nav-item" style={FORCE_BLACK}>
                    <NavLink 
                      className={({ isActive }) => "nav-link" + (isActive ? " active-link" : "")} 
                      to="/"
                      onClick={closeMenu}
                      style={FORCE_BLACK}
                    >
                      <span style={FORCE_BLACK}>HOME</span>
                    </NavLink>
                  </li>
                  
                  <li className="nav-item dropdown position-static d-none d-lg-block">
                    <NavLink 
                      to="#" 
                      role="button" 
                      data-bs-toggle="dropdown" 
                      className="nav-link dropdown-toggle"
                      style={{ textDecoration: 'none' }}
                    >
                      COLLECTION
                    </NavLink>
                    <ul className="dropdown-menu mega-menu p-0">
                      <div className="row g-0">
                        {categoryData.map((category) => (
                          <div className="col-md-3 col-12 mega-menu-category" key={category.category_id}>
                            <Link
                              to={`/collection/${category.c_slug}`}
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              onClick={closeMenu}
                            >
                              <h6 className="dropdown-header text-uppercase fw-bold">
                                {category.c_name}
                              </h6>
                            </Link>
                            {category.subcategories.map((sub) => (
                              <NavLink
                                className={({ isActive }) => "dropdown-item" + (isActive ? " active-link" : "")}
                                to={`/products/${sub.sc_slug}`}
                                key={sub.sc_slug}
                                onClick={closeMenu}
                              >
                                {sub.sc_name.length > 25 ? sub.sc_name.slice(0, 25) + '...' : sub.sc_name}
                              </NavLink>
                            ))}
                          </div>
                        ))}
                      </div>
                    </ul>
                  </li>

                  <li className="nav-item d-lg-none" style={FORCE_BLACK}>
                    <button 
                      className="nav-link w-100 text-start border-0 bg-transparent d-flex justify-content-between align-items-center"
                      onClick={toggleCategory}
                      style={FORCE_BLACK}
                    >
                      <span style={FORCE_BLACK}>COLLECTION</span>
                      <FontAwesomeIcon 
                        icon={isCategoryOpen ? faChevronUp : faChevronDown} 
                        className="ms-2"
                        style={{ fontSize: '0.8rem', ...FORCE_BLACK }}
                      />
                    </button>
                    {isCategoryOpen && (
                      <div className="mobile-category-menu ps-3">
                        {categoryData.map((category) => (
                          <div key={category.category_id} className="mb-3">
                            <Link
                              to={`/collection/${category.c_slug}`}
                              className="d-block fw-bold text-uppercase mb-2"
                              style={{ ...FORCE_BLACK, textDecoration: 'none', fontSize: '0.9rem' }}
                              onClick={closeMenu}
                            >
                              <span style={FORCE_BLACK}>{category.c_name}</span>
                            </Link>
                            {category.subcategories.map((sub) => (
                              <NavLink
                                className={({ isActive }) => "d-block py-1 ps-2" + (isActive ? " text-danger fw-bold" : "")}
                                to={`/products/${sub.sc_slug}`}
                                key={sub.sc_slug}
                                onClick={closeMenu}
                                style={{ ...FORCE_BLACK, textDecoration: 'none', fontSize: '0.85rem' }}
                              >
                                <span style={FORCE_BLACK}>{sub.sc_name.length > 25 ? sub.sc_name.slice(0, 25) + '...' : sub.sc_name}</span>
                              </NavLink>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </li>

                  <li className="nav-item" style={FORCE_BLACK}>
                    <NavLink 
                      className={({ isActive }) => "nav-link" + (isActive ? " active-link" : "")} 
                      to="/products"
                      onClick={closeMenu}
                      style={FORCE_BLACK}
                    >
                      <span style={FORCE_BLACK}>PRODUCTS</span>
                    </NavLink>
                  </li>
                  <li className="nav-item" style={FORCE_BLACK}>
                    <NavLink 
                      className={({ isActive }) => "nav-link" + (isActive ? " active-link" : "")} 
                      to="/pages/about-us"
                      onClick={closeMenu}
                      style={FORCE_BLACK}
                    >
                      <span style={FORCE_BLACK}>ABOUT US</span>
                    </NavLink>
                  </li>
                  <li className="nav-item" style={FORCE_BLACK}>
                    <NavLink 
                      className={({ isActive }) => "nav-link" + (isActive ? " active-link" : "")} 
                      to="/contact"
                      onClick={closeMenu}
                      style={FORCE_BLACK}
                    >
                      <span style={FORCE_BLACK}>CONTACT US</span>
                    </NavLink>
                  </li>
                </ul>

                <div className="d-lg-none px-3 py-2 border-top">
                  <h6 className="mb-2 small" style={FORCE_BLACK}>QUICK LINKS</h6>
                  <Link to="/wishlist" className="nav-link py-2 d-block" onClick={closeMenu} style={FORCE_BLACK}>
                    <FontAwesomeIcon icon={faHeart} className="me-2" style={FORCE_BLACK} /> 
                    <span style={FORCE_BLACK}>Wishlist</span>
                  </Link>
                  <Link to="/cart" className="nav-link py-2 d-block" onClick={closeMenu} style={FORCE_BLACK}>
                    <FontAwesomeIcon icon={faShoppingCart} className="me-2" style={FORCE_BLACK} /> 
                    <span style={FORCE_BLACK}>Cart</span>
                    {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
                  </Link>
                </div>

                <div className="d-lg-none px-3 py-2 border-top">
                  <h6 className="mb-2 small" style={FORCE_BLACK}>ACCOUNT</h6>
                  {isLoggedIn ? (
                    <>
                      <button className="nav-link text-start w-100 border-0 bg-transparent py-2 d-block" onClick={handleProfileClick} style={FORCE_BLACK}>
                        <FontAwesomeIcon icon={faUser} className="me-2" style={FORCE_BLACK} /> 
                        <span style={FORCE_BLACK}>Profile</span>
                      </button>
                      <button className="nav-link text-start w-100 border-0 bg-transparent py-2 d-block" onClick={handleOrderHistoryClick} style={FORCE_BLACK}>
                        <FontAwesomeIcon icon={faUser} className="me-2" style={FORCE_BLACK} /> 
                        <span style={FORCE_BLACK}>My Orders</span>
                      </button>
                      <button
                        className="nav-link text-start w-100 border-0 bg-transparent py-2 d-block"
                        onClick={handleLogout}
                        style={{ color: '#dc3545', textShadow: 'none' }}
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" style={{ color: '#dc3545' }} /> 
                        <span style={{ color: '#dc3545' }}>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="nav-link text-start w-100 border-0 bg-transparent py-2 d-block"
                        onClick={() => {
                          setShowRegistration(true);
                          closeMenu();
                        }}
                        style={FORCE_BLACK}
                      >
                        <FontAwesomeIcon icon={faUser} className="me-2" style={FORCE_BLACK} /> 
                        <span style={FORCE_BLACK}>Sign Up</span>
                      </button>
                      <button
                        className="nav-link text-start w-100 border-0 bg-transparent py-2 d-block"
                        onClick={() => {
                          setShowLogin(true);
                          closeMenu();
                        }}
                        style={FORCE_BLACK}
                      >
                        <FontAwesomeIcon icon={faUser} className="me-2" style={FORCE_BLACK} /> 
                        <span style={FORCE_BLACK}>Login</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="header-items d-none d-lg-flex align-items-center gap-3" style={{ overflow: 'visible', position: 'relative' }}>
              <Link to="/cart" className="position-relative text-decoration-none nav-icon-link">
                <FontAwesomeIcon icon={faShoppingCart} className="nav-icon" />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge">
                    {cartCount}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
              
              <div className="nav-item dropdown account-dropdown" ref={accountDropdownRef}>
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center bg-transparent border-0 p-0"
                  onClick={toggleAccountDropdown}
                  aria-expanded={isAccountDropdownOpen}
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  <span>{isLoggedIn && user?.pu_name ? user?.pu_name : 'ACCOUNT'}</span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${isAccountDropdownOpen ? 'show' : ''}`}>
                  {isLoggedIn ? (
                    <>
                      <li><button className="dropdown-item" onClick={handleProfileClick}>Profile</button></li>
                      <li><button className="dropdown-item" onClick={handleWishlistClick}>Wishlist</button></li>
                      <li><button className="dropdown-item" onClick={handleOrderHistoryClick}>My Orders</button></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                    </>
                  ) : (
                    <li>
                      <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setShowLogin(true); setIsAccountDropdownOpen(false); }}>Sign In</button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Registration show={showRegistration} onClose={() => setShowRegistration(false)} switchToLogin={switchToLogin} />
      <Login show={showLogin} onClose={() => setShowLogin(false)} switchToRegistration={switchToRegistration} />
    </div>
  );
};

export default Navbar;