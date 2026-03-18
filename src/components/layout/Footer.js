import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import facebookIcon from '../../assets/images/facebook.png';
import instagram from '../../assets/images/instagram.png';
import youtube from '../../assets/images/youtube.png';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 300) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 300) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer id="footer" className="mt-5">
        <div className="container">
          <div className="row py-5">
            {/* Quick Links */}
            <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0">
              <div className="footer-menu">
                <h5 className="widget-title text-uppercase fw-bold mb-3">Quick Links</h5>
                <ul className="menu-list list-unstyled">
                  <li className="mb-2"><a href="/pages/about-us" className="nav-link p-0">About us</a></li>
                  <li className="mb-2"><a href="/pages/privacy-policy" className="nav-link p-0">Privacy Policy</a></li>
                </ul>
              </div>
            </div>

            {/* Customer Service */}
            <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0">
              <div className="footer-menu">
                <h5 className="widget-title text-uppercase fw-bold mb-3">Customer Service</h5>
                <ul className="menu-list list-unstyled">
                  <li className="mb-2"><a href="/pages/return-policy" className="nav-link p-0">Returns</a></li>
                  <li className="mb-2"><a href="/pages/shipping-policy" className="nav-link p-0">Shipping Policy</a></li>
                  <li className="mb-2"><a href="/contact" className="nav-link p-0">Help & Contact Us</a></li>
                  <li className="mb-2"><a href="/pages/terms-conditions" className="nav-link p-0">Terms & Conditions</a></li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0">
              <div className="footer-menu">
                <h5 className="widget-title text-uppercase fw-bold mb-3">Contact Info</h5>
                <p className="mb-2">Email: fashionframe2025@gmail.com</p>
                <p className="mb-2">Phone: +91 90333 18392</p>
                <p className="mb-0">Address: Fashion Frame plot no 1126 Laxmi Textile Park Sachin GIDC Surat.</p>
              </div>
            </div>

            {/* Follow Us */}
            <div className="col-12 col-sm-6 col-md-3">
              <div className="footer-menu">
                <h5 className="widget-title text-uppercase fw-bold mb-3">Follow Us</h5>
                <ul className="social-links list-unstyled d-flex gap-3">
                  <li><a href="#"><img src={facebookIcon} alt="Facebook" width="25" height="25" /></a></li>
                  <li><a href="#"><img src={instagram} alt="Instagram" width="25" height="25" /></a></li>
                  <li><a href="#"><img src={youtube} alt="YouTube" width="25" height="25" /></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-top py-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-md-6 d-flex flex-wrap align-items-center gap-3 mb-3 mb-md-0">
                <span>We ship with:</span>
                <img src={require('../../assets/images/arct-icon.png')} alt="shipping" className="img-fluid" />
                <img src={require('../../assets/images/dhl-logo.png')} alt="shipping" className="img-fluid" />
                <span className="ms-3">Payment methods:</span>
                <img src={require('../../assets/images/visa-card.png')} alt="payment" className="img-fluid" />
                <img src={require('../../assets/images/master-card.png')} alt="payment" className="img-fluid" />
                <img src={require('../../assets/images/paypal-card.png')} alt="payment" className="img-fluid" />
              </div>
              <div className="col-12 col-md-6 text-md-end text-start">
                <p className="mb-0">© 2025 Fashion Frame. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showScroll && (
        <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}

      <style>{`
      .back-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #000;
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 999;
      }
      .back-to-top:hover { background: #333; }
      .footer-menu ul li a { font-size: 14px; }
      @media (max-width: 576px) {
        .footer-menu ul li a { font-size: 13px; }
        .social-links { justify-content: flex-start; }
      }
    `}</style>

    </>
  );
};

export default Footer;
