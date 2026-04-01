import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart, faUser, faSignOutAlt, faBars, faTimes, faChevronDown, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Registration from "../../pages/auth/Registration";
import Login from "../../pages/auth/Login";
import API_ENDPOINTS from "../../api/apiConfig";
import { useUser } from "../../context/UserContext";
import '../../assets/css/navbar.css';

const getAccessToken = () => localStorage.getItem('authToken');

// Run immediately when module loads — before first render
// This prevents the white flash caused by useEffect running after paint
(function applyBodyOffset() {
  const isHome = window.location.pathname === '/';
  if (isHome) {
    document.documentElement.classList.add('home-page');
    document.body.style.setProperty('padding-top', '0px', 'important');
    document.body.style.setProperty('margin-top', '0px', 'important');
  } else {
    document.documentElement.classList.remove('home-page');
    document.body.style.setProperty('padding-top', '64px', 'important');
    document.body.style.setProperty('margin-top', '0px', 'important');
  }
})();

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

  /* ── Homepage: remove body top offset so hero sits behind transparent navbar ── */
  useEffect(() => {
    if (isHomePage) {
      document.body.style.setProperty('padding-top', '0px', 'important');
      document.body.style.setProperty('margin-top', '0px', 'important');
      document.body.classList.add('home-page');
    } else {
      document.body.style.setProperty('padding-top', '64px', 'important');
      document.body.style.setProperty('margin-top', '0px', 'important');
      document.body.classList.remove('home-page');
    }
    return () => {
      document.body.style.removeProperty('padding-top');
      document.body.style.removeProperty('margin-top');
      document.body.classList.remove('home-page');
    };
  }, [isHomePage]);

  /* ── Scroll ── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Fetch categories ── */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAccessToken();
        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch(API_ENDPOINTS.GET_CATEGORY_SUBCATEGORY, { method: 'POST', headers });
        const data = await response.json();
        setCategoryData(response.ok && Array.isArray(data.data) ? data.data : []);
      } catch { setCategoryData([]); }
    };
    fetchCategories();
  }, []);

  /* ── Cart count ── */
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
    } catch { setCartCount(0); }
  };
  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  /* ── Reset on route change ── */
  useEffect(() => {
    setShowRegistration(false);
    setShowLogin(false);
    setIsLoggedIn(!!localStorage.getItem('authToken'));
    setIsMenuOpen(false);
    setIsCategoryOpen(false);
    setIsAccountDropdownOpen(false);
  }, [location]);

  /* ── Mobile body lock ── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  /* ── Outside click for account dropdown ── */
  useEffect(() => {
    const handler = (e) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target))
        setIsAccountDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeMenu = () => { setIsMenuOpen(false); setIsCategoryOpen(false); };

  const handleProfileClick      = () => { setIsAccountDropdownOpen(false); closeMenu(); navigate('/profile'); };
  const handleWishlistClick     = () => { setIsAccountDropdownOpen(false); closeMenu(); navigate('/wishlist'); };
  const handleOrderHistoryClick = () => { setIsAccountDropdownOpen(false); closeMenu(); navigate('/order-history'); };

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

  const navClasses = [
    'navbar navbar-expand-lg fixed-top',
    isHomePage && !scrolled ? 'navbar-transparent' : 'navbar-solid',
    scrolled ? 'navbar-scrolled' : '',
  ].filter(Boolean).join(' ');

  const displayName = isLoggedIn && user?.pu_name
    ? user.pu_name.split(' ')[0]
    : 'Account';

  return (
    <div className="header-wrapper">
      <nav id="app-navbar" className={navClasses} role="navigation">
        <div className="container-fluid" style={{ overflow: 'visible' }}>
          <div className="d-flex justify-content-between align-items-center w-100" style={{ overflow: 'visible' }}>

            {/* Logo */}
            <Link to="/" className="navbar-brand text-decoration-none">
              <img
                src={require('../../assets/images/appbar.png')}
                alt="Fashion Frame"
                className="navbar-logo"
              />
            </Link>

            {/* Desktop Nav Links */}
            <ul className="lux-nav-list lux-desktop-nav">
              <li className="lux-nav-item">
                <NavLink to="/" className={({ isActive }) => `lux-nav-link${isActive ? ' active' : ''}`}>
                  Home
                </NavLink>
              </li>

              <li className="lux-nav-item">
                <span className="lux-nav-link">
                  Collection
                  <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 8, marginLeft: 4 }} />
                </span>
                {categoryData.length > 0 && (
                  <div className="lux-mega-menu">
                    <div className="row g-0">
                      {categoryData.map((category) => (
                        <div className="lux-mega-col col" key={category.category_id}>
                          <Link to={`/collection/${category.c_slug}`} className="lux-mega-heading" onClick={closeMenu}>
                            {category.c_name}
                          </Link>
                          {category.subcategories.map((sub) => (
                            <Link to={`/products/${sub.sc_slug}`} className="lux-mega-link" key={sub.sc_slug} onClick={closeMenu}>
                              {sub.sc_name.length > 25 ? sub.sc_name.slice(0, 25) + '…' : sub.sc_name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              <li className="lux-nav-item">
                <NavLink to="/products" className={({ isActive }) => `lux-nav-link${isActive ? ' active' : ''}`}>
                  Products
                </NavLink>
              </li>
              <li className="lux-nav-item">
                <NavLink to="/pages/about-us" className={({ isActive }) => `lux-nav-link${isActive ? ' active' : ''}`}>
                  About Us
                </NavLink>
              </li>
              <li className="lux-nav-item">
                <NavLink to="/contact" className={({ isActive }) => `lux-nav-link${isActive ? ' active' : ''}`}>
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Desktop Icons */}
            <div className="lux-header-icons">
              <Link to="/cart" className="lux-icon-btn">
                <FontAwesomeIcon icon={faShoppingCart} className="nav-icon" />
                {cartCount > 0 && <span className="lux-cart-badge">{cartCount}</span>}
              </Link>

              <div className="lux-account-wrap" ref={accountDropdownRef}>
                <button
                  className={`lux-account-btn${isAccountDropdownOpen ? ' open' : ''}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAccountDropdownOpen(o => !o); }}
                >
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 13 }} />
                  <span>{displayName}</span>
                  <FontAwesomeIcon icon={faChevronDown} className="lux-chevron" />
                </button>

                <div className={`lux-account-dropdown${isAccountDropdownOpen ? ' open' : ''}`}>
                  {isLoggedIn ? (
                    <>
                      <div className="lux-user-greeting">{user?.pu_name || 'Welcome'}</div>
                      <button className="lux-dropdown-item" onClick={handleProfileClick}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: 12 }} /> Profile
                      </button>
                      <button className="lux-dropdown-item" onClick={handleWishlistClick}>
                        <FontAwesomeIcon icon={faHeart} style={{ fontSize: 12 }} /> Wishlist
                      </button>
                      <button className="lux-dropdown-item" onClick={handleOrderHistoryClick}>
                        <FontAwesomeIcon icon={faClipboardList} style={{ fontSize: 12 }} /> My Orders
                      </button>
                      <div className="lux-dropdown-divider" />
                      <button className="lux-dropdown-item danger" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: 12 }} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="lux-dropdown-item" onClick={() => { setShowLogin(true); setIsAccountDropdownOpen(false); }}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: 12 }} /> Sign In
                      </button>
                      <button className="lux-dropdown-item" onClick={() => { setShowRegistration(true); setIsAccountDropdownOpen(false); }}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: 12 }} /> Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Hamburger */}
            <button className="lux-hamburger" onClick={() => setIsMenuOpen(o => !o)} aria-label="Toggle menu">
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-menu-overlay${isMenuOpen ? ' active' : ''}`} onClick={closeMenu} />

      {/* Mobile drawer */}
      <div className={`mobile-menu${isMenuOpen ? ' show' : ''}`}>
        <div className="lux-mobile-header">
          <span className="lux-mobile-title">Fashion Frame</span>
          <button className="lux-mobile-close" onClick={closeMenu}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="lux-mobile-nav">
          <NavLink to="/" className={({ isActive }) => `lux-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>
            Home
          </NavLink>

          <button className="lux-mobile-link" onClick={() => setIsCategoryOpen(o => !o)}>
            Collection
            <FontAwesomeIcon icon={faChevronDown} className={`lux-mobile-chevron${isCategoryOpen ? ' open' : ''}`} />
          </button>
          {isCategoryOpen && (
            <div className="lux-mobile-cats">
              {categoryData.map((category) => (
                <div key={category.category_id} className="lux-mobile-cat-group">
                  <Link to={`/collection/${category.c_slug}`} className="lux-mobile-cat-heading" onClick={closeMenu}>
                    {category.c_name}
                  </Link>
                  {category.subcategories.map((sub) => (
                    <Link to={`/products/${sub.sc_slug}`} className="lux-mobile-sublink" key={sub.sc_slug} onClick={closeMenu}>
                      {sub.sc_name.length > 28 ? sub.sc_name.slice(0, 28) + '…' : sub.sc_name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}

          <NavLink to="/products" className={({ isActive }) => `lux-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>Products</NavLink>
          <NavLink to="/pages/about-us" className={({ isActive }) => `lux-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>About Us</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `lux-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>Contact</NavLink>

          <div className="lux-mobile-divider" />
          <div className="lux-mobile-section-label">Quick Links</div>
          <Link to="/cart" className="lux-mobile-icon-link" onClick={closeMenu}>
            <FontAwesomeIcon icon={faShoppingCart} className="lux-mobile-icon" /> Cart
            {cartCount > 0 && <span className="lux-mobile-badge">{cartCount}</span>}
          </Link>
          <Link to="/wishlist" className="lux-mobile-icon-link" onClick={closeMenu}>
            <FontAwesomeIcon icon={faHeart} className="lux-mobile-icon" /> Wishlist
          </Link>

          <div className="lux-mobile-divider" />
          <div className="lux-mobile-section-label">Account</div>
          {isLoggedIn ? (
            <>
              <button className="lux-mobile-icon-link" onClick={handleProfileClick}>
                <FontAwesomeIcon icon={faUser} className="lux-mobile-icon" /> Profile
              </button>
              <button className="lux-mobile-icon-link" onClick={handleOrderHistoryClick}>
                <FontAwesomeIcon icon={faClipboardList} className="lux-mobile-icon" /> My Orders
              </button>
              <button className="lux-mobile-icon-link danger" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="lux-mobile-icon" /> Logout
              </button>
            </>
          ) : (
            <>
              <button className="lux-mobile-icon-link" onClick={() => { setShowLogin(true); closeMenu(); }}>
                <FontAwesomeIcon icon={faUser} className="lux-mobile-icon" /> Sign In
              </button>
              <button className="lux-mobile-icon-link" onClick={() => { setShowRegistration(true); closeMenu(); }}>
                <FontAwesomeIcon icon={faUser} className="lux-mobile-icon" /> Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      <Registration
        show={showRegistration}
        onClose={() => setShowRegistration(false)}
        switchToLogin={() => { setShowRegistration(false); setShowLogin(true); }}
      />
      <Login
        show={showLogin}
        onClose={() => setShowLogin(false)}
        switchToRegistration={() => { setShowLogin(false); setShowRegistration(true); }}
      />
    </div>
  );
};

export default Navbar;