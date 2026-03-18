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

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  const token = localStorage.getItem('authToken');

  // fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(API_ENDPOINTS.RANDOM_PRODUCTS, { method: 'POST', headers });
      const data = await response.json();

      if (response.ok && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setError(data.message || 'Failed to load products.');
      }
    } catch (err) {
      setError('An error occurred while fetching products.');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  // wishlist toggle
  const handleWishlistToggle = async (productId) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(API_ENDPOINTS.WISHLISTTOGGLE, {
        method: "POST",
        headers,
        body: JSON.stringify({ product_id: productId }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchProducts();
      } else {
        alert(data.message || "Failed to update wishlist.");
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  // render single product card
  const renderProductCard = (product) => {
    const originalPrice = parseFloat(product.p_price) || 0;
    const discountPercent = parseFloat(product.discount_percentage) || 0;
    const discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));

    const isLoggedIn = !!token;
    const isVendor = user?.created_by;

    return (
      <div 
        className="product-item h-100 d-flex flex-column" 
        key={product.p_id}
        style={{
          background: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          border: '1px solid #f0f0f0'
        }}
      >
        <div 
          className="image-holder position-relative"
          style={{
            width: '100%',
            paddingTop: '125%', // 4:5 aspect ratio (standard for fashion products)
            overflow: 'hidden',
            background: '#f9f9f9'
          }}
        >
          <a 
            href={`/product/${product.p_slug}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <img
              src={
                product.images?.[0]?.startsWith("http")
                  ? product.images[0]
                  : `${IMAGE_BASE_URL}${product.images?.[0]}`
              }
              alt={product.p_name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </a>
          {token && (
            <button
              type="button"
              className="btn-wishlist position-absolute"
              onClick={() => handleWishlistToggle(product.p_id)}
              style={{ 
                cursor: "pointer",
                border: "none",
                background: "white",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                top: "12px",
                right: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 2,
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FontAwesomeIcon
                icon={product.is_wishlisted ? faSolidHeart : faRegularHeart}
                style={{ 
                  color: product.is_wishlisted ? "#d32f2f" : "#666",
                  fontSize: '1.1rem'
                }}
              />
            </button>
          )}
        </div>
        <div className="product-content p-3 d-flex flex-column flex-grow-1">
          <h3 
            className="product-title mb-2" 
            style={{ 
              fontSize: '0.95rem', 
              fontWeight: '500',
              lineHeight: '1.4',
              minHeight: '2.8em', // Reserve space for 2 lines
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <a 
              href={`/product/${product.p_slug}`} 
              className="text-uppercase text-decoration-none"
              style={{ color: '#333' }}
            >
              {product.p_name}
            </a>
          </h3>
          <div className="price mt-auto">
            {isLoggedIn && isVendor ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span 
                  className="amount fw-bold" 
                  style={{ fontSize: '1.2rem', color: '#d32f2f' }}
                >
                  ₹{discountedPrice}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span 
                      className="text-muted text-decoration-line-through" 
                      style={{ fontSize: '0.9rem' }}
                    >
                      ₹{originalPrice}
                    </span>
                    <span 
                      className="badge bg-danger" 
                      style={{ 
                        fontSize: '0.7rem',
                        padding: '0.25rem 0.5rem'
                      }}
                    >
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            ) : (
              <span 
                className="amount fw-bold" 
                style={{ fontSize: '1.2rem', color: '#d32f2f' }}
              >
                ₹{originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="new-arrivals py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 
            className="section-title mb-0" 
            style={{ 
              fontSize: '2rem', 
              fontWeight: '400', 
              letterSpacing: '2px',
              color: '#333'
            }}
          >
            New Arrivals
          </h2>
          <a 
            href="/products" 
            className="text-uppercase text-decoration-none view-all"
            style={{ 
              color: '#0066cc', 
              fontSize: '0.9rem', 
              fontWeight: '500',
              letterSpacing: '1px',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0052a3'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#0066cc'}
          >
            VIEW ALL PRODUCTS →
          </a>
        </div>

        <div className="position-relative" data-aos="fade-up">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">No products found.</div>
          ) : products.length < 4 ? (
            <div className="row g-4">
              {products.map((product) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.p_id}>
                  {renderProductCard(product)}
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Custom SVG arrows */}
              <div 
                className="icon-arrow icon-arrow-left best-selling-arrow-left"
                style={{
                  position: 'absolute',
                  left: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  cursor: 'pointer',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ stroke: '#333', strokeWidth: 2 }}
                >
                  <path d="M15 19L8 12L15 5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div 
                className="icon-arrow icon-arrow-right best-selling-arrow-right"
                style={{
                  position: 'absolute',
                  right: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  cursor: 'pointer',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ stroke: '#333', strokeWidth: 2 }}
                >
                  <path d="M9 5L16 12L9 19" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <Swiper
                modules={[Navigation]}
                navigation={{
                  nextEl: '.best-selling-arrow-right',
                  prevEl: '.best-selling-arrow-left',
                }}
                spaceBetween={30}
                grabCursor={true}
                speed={600}
                slidesPerView={1}
                loop={true}
                breakpoints={{
                  576: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 25 },
                  992: { slidesPerView: 3, spaceBetween: 30 },
                  1200: { slidesPerView: 4, spaceBetween: 30 },
                }}
                style={{ padding: '10px 0' }}
              >
                {products.map((product) => (
                  <SwiperSlide key={product.p_id} style={{ height: 'auto' }}>
                    {renderProductCard(product)}
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .product-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </section>
  );
};

export default NewArrivals;