import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import facebookIcon from '../../assets/images/facebook.png';
import instagram from '../../assets/images/instagram.png';
import youtube from '../../assets/images/youtube.png';
import '../../assets/css/footer.css';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <footer className="lux-footer">

        {/* ── Top Section ── */}
        <div className="lux-footer-top">
          <div className="container">
            <div className="row">

              {/* Brand */}
              <div className="col-12 col-md-3 mb-5 mb-md-0">
                <div className="lux-footer-brand">
                  <span className="lux-footer-brand-name">Fashion Frame</span>
                  <p className="lux-footer-tagline">Curated with intention. Worn with purpose.</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-6 col-md-2 mb-4 mb-md-0">
                <h5 className="lux-footer-heading">Quick Links</h5>
                <ul className="lux-footer-links">
                  <li><a href="/pages/about-us">About Us</a></li>
                  <li><a href="/pages/privacy-policy">Privacy Policy</a></li>
                </ul>
              </div>

              {/* Customer Service */}
              <div className="col-6 col-md-2 mb-4 mb-md-0">
                <h5 className="lux-footer-heading">Support</h5>
                <ul className="lux-footer-links">
                  <li><a href="/pages/return-policy">Returns</a></li>
                  <li><a href="/pages/shipping-policy">Shipping Policy</a></li>
                  <li><a href="/contact">Help & Contact</a></li>
                  <li><a href="/pages/terms-conditions">Terms & Conditions</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0">
                <h5 className="lux-footer-heading">Contact</h5>
                <div className="lux-footer-contact-item">
                  <span className="lux-footer-contact-label">Email</span>
                  <span>fashionframe2025@gmail.com</span>
                </div>
                <div className="lux-footer-contact-item">
                  <span className="lux-footer-contact-label">Phone</span>
                  <span>+91 90333 18392</span>
                </div>
                <div className="lux-footer-contact-item">
                  <span className="lux-footer-contact-label">Addr</span>
                  <span>Plot No. 1126, Laxmi Textile Park, Sachin GIDC, Surat.</span>
                </div>
              </div>

              {/* Follow Us */}
              <div className="col-12 col-sm-6 col-md-2">
                <h5 className="lux-footer-heading">Follow Us</h5>
                <ul className="lux-social-links">
                  <li>
                    <a href="#" aria-label="Facebook">
                      <img src={facebookIcon} alt="Facebook" />
                    </a>
                  </li>
                  <li>
                    <a href="#" aria-label="Instagram">
                      <img src={instagram} alt="Instagram" />
                    </a>
                  </li>
                  <li>
                    <a href="#" aria-label="YouTube">
                      <img src={youtube} alt="YouTube" />
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="lux-footer-bottom">
          <div className="container">
            <div className="lux-footer-bottom-inner">

              {/* Logos */}
              <div className="lux-footer-logos">
                <span className="lux-footer-logos-label">Ships via</span>
                <img src={require('../../assets/images/SR-logo.png')} alt="Shiprocket" />
                <div className="lux-logo-divider" />
                <span className="lux-footer-logos-label">Pay with</span>
                <img src={require('../../assets/images/razorpay-logo.png')} alt="razorpay" />
              </div>

              {/* Copyright */}
              <span className="lux-footer-copy"> 
                © {new Date().getFullYear()} Fashion Frame. All rights reserved.
              </span>

            </div>
          </div>
        </div>

      </footer>

      {/* Back to Top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="lux-back-to-top"
          aria-label="Back to top"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </>
  );
};

export default Footer;