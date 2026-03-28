import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import API_ENDPOINTS, { IMAGE_BASE_URL } from '../../api/apiConfig';
import { useUser } from "../../context/UserContext";
import 'swiper/css';
import 'swiper/css/navigation';
import LoadingSpinner from '../LoadingSpinner';
import '../../assets/css/NewArrivals.css';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();
  const token = localStorage.getItem('authToken');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(API_ENDPOINTS.RANDOM_PRODUCTS, { method: 'POST', headers });
      const data = await response.json();
      if (response.ok && Array.isArray(data.data)) setProducts(data.data);
      else setError(data.message || 'Failed to load products.');
    } catch {
      setError('An error occurred while fetching products.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [token]);

  const handleWishlistToggle = async (productId) => {
    try {
      const headers = { "Content-Type": "application/json", Accept: "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(API_ENDPOINTS.WISHLISTTOGGLE, {
        method: "POST", headers,
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await response.json();
      if (response.ok) fetchProducts();
      else alert(data.message || "Failed to update wishlist.");
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  const renderCard = (product, idx = 0) => {
    const originalPrice  = parseFloat(product.p_price) || 0;
    const discountPct    = parseFloat(product.discount_percentage) || 0;
    const discountedPrice = Math.round(originalPrice * (1 - discountPct / 100));
    const isVendor       = !!token && user?.created_by;

    return (
      <article
        className="na-card"
        key={product.p_id}
        style={{ animationDelay: `${idx * 0.06}s` }}
      >
        {/* ── Image ── */}
        <a href={`/product/${product.p_slug}`} className="na-card-img-link">
          <div className="na-card-img-wrap">
            <img
              src={
                product.images?.[0]?.startsWith("http")
                  ? product.images[0]
                  : `${IMAGE_BASE_URL}${product.images?.[0]}`
              }
              alt={product.p_name}
              className="na-card-img"
              loading="lazy"
            />
            {discountPct > 0 && (
              <span className="na-badge">−{discountPct}%</span>
            )}
          </div>
        </a>

        {/* ── Wishlist ── */}
        {token && (
          <button
            className={`na-wish${product.is_wishlisted ? ' na-wish--active' : ''}`}
            onClick={() => handleWishlistToggle(product.p_id)}
            aria-label={product.is_wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FontAwesomeIcon icon={product.is_wishlisted ? faSolidHeart : faRegularHeart} />
          </button>
        )}

        {/* ── Body ── */}
        <div className="na-card-body">
          <a href={`/product/${product.p_slug}`} className="na-card-name">
            {product.p_name}
          </a>
          <div className="na-card-price">
            {isVendor ? (
              <>
                <span className="na-price-now">₹{discountedPrice.toLocaleString('en-IN')}</span>
                {discountPct > 0 && (
                  <span className="na-price-orig">₹{originalPrice.toLocaleString('en-IN')}</span>
                )}
              </>
            ) : (
              <span className="na-price-now">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="na-section">
      <div className="na-container">

        {/* ── Section Header ── */}
        <div className="na-header">
          <div className="na-header-left">
            <p className="na-eyebrow">Just In</p>
            <h2 className="na-title">New Arrivals</h2>
            <div className="na-rule" />
          </div>
          <a href="/products" className="na-view-all">
            View All
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="na-loading"><LoadingSpinner /></div>
        ) : error ? (
          <div className="na-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="na-empty">No products found.</div>
        ) : products.length < 4 ? (
          <div className="na-static-grid">
            {products.map((p, i) => renderCard(p, i))}
          </div>
        ) : (
          <div className="na-slider-wrap">
            {/* Arrows */}
            <button className="na-arrow na-arrow--prev" aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 14L6 9l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="na-arrow na-arrow--next" aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{ nextEl: '.na-arrow--next', prevEl: '.na-arrow--prev' }}
              spaceBetween={24}
              grabCursor={true}
              speed={600}
              loop={true}
              slidesPerView={1}
              breakpoints={{
                480:  { slidesPerView: 2, spaceBetween: 18 },
                768:  { slidesPerView: 2, spaceBetween: 20 },
                992:  { slidesPerView: 3, spaceBetween: 22 },
                1200: { slidesPerView: 4, spaceBetween: 24 },
              }}
              style={{ padding: '8px 4px 12px' }}
            >
              {products.map((p, i) => (
                <SwiperSlide key={p.p_id} style={{ height: 'auto' }}>
                  {renderCard(p, i)}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;