import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMinus, faPlus, faTimes, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import { FaArrowLeft, FaArrowRight, FaChevronUp, FaChevronDown, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../../assets/custom.css';
import { useUser } from "../../context/UserContext";
import '../../assets/ProductDetails.css'

// ─────────────────────────────────────────────────────────────────
// Star Row Helper
// ─────────────────────────────────────────────────────────────────
const StarRow = ({ rating, size = 16 }) => {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= Math.floor(rating)) {
          return <FaStar key={i} size={size} color="#F59E0B" />;
        } else if (i - rating < 1 && rating % 1 >= 0.5) {
          return <FaStarHalfAlt key={i} size={size} color="#F59E0B" />;
        } else {
          return <FaRegStar key={i} size={size} color="#D1D5DB" />;
        }
      })}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────
// Reviews Section Component
// ─────────────────────────────────────────────────────────────────
const REVIEWS_PER_PAGE = 5;

const ReviewsSection = ({ productId }) => {
  const [reviewsLoading, setReviewsLoading]   = useState(true);
  const [loadingMore, setLoadingMore]         = useState(false);
  const [averageRating, setAverageRating]     = useState(0);
  const [totalReviews, setTotalReviews]       = useState(0);
  const [breakdown, setBreakdown]             = useState({});
  const [reviews, setReviews]                 = useState([]);
  const [currentPage, setCurrentPage]         = useState(1);
  const [pagination, setPagination]           = useState(null);

  // ── Fetch a specific page from the server ────────────────────────
  const fetchReviews = async (page = 1, append = false) => {
    if (page === 1) setReviewsLoading(true);
    else setLoadingMore(true);

    try {
      const response = await fetch(API_ENDPOINTS.GET_PRODUCT_REVIEWS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          page,
          per_page: REVIEWS_PER_PAGE,
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setAverageRating(data.average_rating || 0);
        setTotalReviews(data.total_reviews || 0);
        setBreakdown(data.rating_breakdown || {});
        setPagination(data.pagination || null);
        // append = load more, replace = fresh load / page change
        setReviews((prev) => append ? [...prev, ...data.data] : data.data);
        setCurrentPage(page);
      }
    } catch (e) {
      console.error('Review fetch error:', e);
    } finally {
      setReviewsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!productId) return;
    fetchReviews(1, false);
  }, [productId]);

  const handleLoadMore = () => fetchReviews(currentPage + 1, true);

  const handleCollapse = () => {
    setReviews([]);
    setCurrentPage(1);
    fetchReviews(1, false);
    document.getElementById('reviews-section-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePageChange = (page) => {
    // Full page-switch mode: replace reviews, scroll up
    fetchReviews(page, false);
    document.getElementById('reviews-section-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatDate = (dateStr) => {
    try {
      const dt = new Date(dateStr.replace(' ', 'T'));
      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const { total_pages, current_page } = pagination;
    if (total_pages <= 5) return Array.from({ length: total_pages }, (_, i) => i + 1);
    if (current_page <= 3) return [1, 2, 3, 4, '...', total_pages];
    if (current_page >= total_pages - 2) return [1, '...', total_pages - 3, total_pages - 2, total_pages - 1, total_pages];
    return [1, '...', current_page - 1, current_page, current_page + 1, '...', total_pages];
  };

  const shown = reviews.length;
  const hasMore = pagination?.has_next;

  return (
    <div id="reviews-section-header" style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #E5E7EB' }}>

      {/* ── Section Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h5 style={{ margin: 0, fontWeight: '700', color: '#111827', fontFamily: "'Merriweather', serif", fontSize: '18px' }}>
          Customer Reviews
        </h5>
        {totalReviews > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: '700', color: '#92400E', fontFamily: "'Merriweather', serif" }}>
            <FaStar size={13} color="#F59E0B" />
            {averageRating.toFixed(1)}&nbsp;({totalReviews})
          </span>
        )}
      </div>

      {/* ── Loading shimmer ── */}
      {reviewsLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '88px', borderRadius: '12px', background: 'linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite linear' }} />
          ))}
          <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        </div>
      ) : reviews.length === 0 ? (

        /* ── Empty state ── */
        <div style={{ textAlign: 'center', padding: '36px 24px', backgroundColor: '#F9FAFB', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <FaRegStar size={36} color="#D1D5DB" />
          <p style={{ margin: '12px 0 4px', fontWeight: '600', color: '#9CA3AF', fontFamily: "'Merriweather', serif", fontSize: '14px' }}>No reviews yet</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF', fontFamily: "'Merriweather', serif" }}>Be the first to review this product</p>
        </div>

      ) : (
        <>
          {/* ── Rating Summary ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#111827', lineHeight: 1, fontFamily: "'Merriweather', serif" }}>{averageRating.toFixed(1)}</div>
              <div style={{ marginTop: '6px' }}><StarRow rating={averageRating} size={14} /></div>
              <div style={{ marginTop: '4px', fontSize: '11px', color: '#9CA3AF', fontFamily: "'Merriweather', serif" }}>{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</div>
            </div>
            <div style={{ flex: 1 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = breakdown[`${star}_star`] || 0;
                const fraction = totalReviews > 0 ? count / totalReviews : 0;
                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', width: '8px', textAlign: 'right' }}>{star}</span>
                    <FaStar size={10} color="#F59E0B" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${fraction * 100}%`, height: '100%', backgroundColor: count > 0 ? '#F59E0B' : '#E5E7EB', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF', width: '16px', textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Showing X of Y ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: "'Merriweather', serif" }}>
              Showing <strong>{shown}</strong> of <strong>{totalReviews}</strong> reviews
              {pagination && (
                <span style={{ marginLeft: '6px', color: '#9CA3AF' }}>
                  — Page {pagination.current_page} of {pagination.total_pages}
                </span>
              )}
            </span>
          </div>

          {/* ── Review Cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {/* Avatar */}
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '15px', fontFamily: "'Merriweather', serif" }}>
                      {(review.user_name || 'A')[0].toUpperCase()}
                    </span>
                  </div>
                  {/* Name + date */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '700', fontSize: '13px', color: '#111827', fontFamily: "'Merriweather', serif" }}>{review.user_name || 'Anonymous'}</span>
                      {review.is_verified && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: '10px', padding: '2px 7px', fontSize: '10px', fontWeight: '700', color: '#065F46', fontFamily: "'Merriweather', serif" }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px', fontFamily: "'Merriweather', serif" }}>{formatDate(review.created_at)}</div>
                  </div>
                  {/* Stars */}
                  <StarRow rating={review.rating} size={13} />
                </div>
                {review.review && (
                  <p style={{ margin: '12px 0 0 50px', fontSize: '13px', color: '#374151', lineHeight: '1.6', fontFamily: "'Merriweather', serif" }}>
                    {review.review}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ── Load More button ── */}
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              style={{ width: '100%', marginTop: '14px', padding: '11px', borderRadius: '10px', border: '1.5px solid #E5E7EB', backgroundColor: 'white', color: '#374151', fontSize: '13px', fontWeight: '600', fontFamily: "'Merriweather', serif", cursor: loadingMore ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
              onMouseOver={(e) => { if (!loadingMore) { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.borderColor = '#9CA3AF'; } }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              {loadingMore ? (
                <>
                  <span style={{ width: '14px', height: '14px', border: '2px solid #D1D5DB', borderTopColor: '#374151', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  Loading...
                </>
              ) : (
                <>
                  <FaChevronDown size={12} />
                  Load more reviews ({totalReviews - shown} remaining)
                </>
              )}
            </button>
          )}

          {/* ── Collapse to first page ── */}
          {currentPage > 1 && !hasMore && (
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button onClick={handleCollapse} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '12px', fontFamily: "'Merriweather', serif", cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                <FaChevronUp size={10} /> Show less
              </button>
            </div>
          )}

          {/* ── Page number buttons (shown when more than 1 page and not in "load more" mode) ── */}
          {pagination && pagination.total_pages > 1 && !hasMore && currentPage === pagination.total_pages && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '16px', flexWrap: 'wrap' }}>
              {/* Prev */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.has_previous}
                style={{ minWidth: '34px', height: '34px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', color: pagination.has_previous ? '#374151' : '#D1D5DB', fontSize: '13px', cursor: pagination.has_previous ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Merriweather', serif" }}
              >
                ‹
              </button>
              {/* Page numbers */}
              {getPageNumbers().map((p, idx) =>
                p === '...' ? (
                  <span key={`e${idx}`} style={{ color: '#9CA3AF', fontSize: '13px', padding: '0 4px' }}>...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    style={{ minWidth: '34px', height: '34px', borderRadius: '8px', border: p === currentPage ? 'none' : '1px solid #E5E7EB', backgroundColor: p === currentPage ? '#111827' : 'white', color: p === currentPage ? 'white' : '#374151', fontSize: '13px', fontWeight: p === currentPage ? '700' : '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Merriweather', serif", transition: 'all 0.15s' }}
                  >
                    {p}
                  </button>
                )
              )}
              {/* Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.has_next}
                style={{ minWidth: '34px', height: '34px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', color: pagination.has_next ? '#374151' : '#D1D5DB', fontSize: '13px', cursor: pagination.has_next ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Merriweather', serif" }}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────
// Main ProductDetails Component
// ─────────────────────────────────────────────────────────────────
const ProductDetails = () => {
  const { p_slug } = useParams();
  const { user } = useUser();

  const navigate = useNavigate();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [isZooming, setIsZooming] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isMobileZoomOpen, setIsMobileZoomOpen] = useState(false);
  const [mobileZoomImage, setMobileZoomImage] = useState('');

  const token = localStorage.getItem('authToken');

  const readCart = () => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  };

  const writeCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartItems(cart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleImageMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const lensSize = 150;
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let lensX = Math.max(0, Math.min(x - lensSize / 2, rect.width - lensSize));
    let lensY = Math.max(0, Math.min(y - lensSize / 2, rect.height - lensSize));
    setLensPosition({ x: lensX, y: lensY });
    setZoomPosition({ x: (lensX / rect.width) * 100, y: (lensY / rect.height) * 100 });
  };

  const handleImageMouseEnter = () => setIsZooming(true);
  const handleImageMouseLeave = () => setIsZooming(false);

  const handleMobileImageClick = (imageUrl) => {
    setMobileZoomImage(imageUrl);
    setIsMobileZoomOpen(true);
  };
  const closeMobileZoom = () => {
    setIsMobileZoomOpen(false);
    setMobileZoomImage('');
  };

  useEffect(() => {
    setCartItems(readCart());
    const onCartUpdated = () => setCartItems(readCart());
    window.addEventListener('cartUpdated', onCartUpdated);
    return () => window.removeEventListener('cartUpdated', onCartUpdated);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch(API_ENDPOINTS.PRODUCTS, {
          method: 'POST',
          headers,
          body: JSON.stringify({ p_slug }),
        });
        const data = await response.json();
        let prod = null;
        if (response.ok && data.status && data.data) {
          prod = Array.isArray(data.data) ? (data.data[0] || null) : data.data;
          setProduct(prod);
          if (prod?.size) {
            const available = Object.keys(prod.size).filter((s) => prod.size[s] > 0);
            if (available.length > 0) setSelectedSize(available[0]);
          }
        } else {
          setError(data.message || 'Failed to fetch product details.');
        }
      } catch {
        setError('An error occurred while fetching product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [p_slug, navigate, token]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <div className="alert alert-danger text-center py-5">{error}</div>;
  if (!product) return <div className="text-center text-muted py-5">Product not found.</div>;

  const sizes = product.size ? Object.keys(product.size) : [];
  const colors = product.colors || [];
  const isOutOfStock = sizes.length === 0 || sizes.every((s) => product.size[s] === 0);
  const isSelectedSizeOutOfStock = selectedSize && product.size[selectedSize] === 0;

  const canAddToCart = () => {
    if (isOutOfStock || isSelectedSizeOutOfStock) return false;
    if (sizes.length > 0 && selectedSize) return true;
    if (sizes.length === 0) return true;
    return false;
  };

  const toggleDescription = () => setIsOpen(!isOpen);

  const buildCartItem = () => ({
    id: product.p_id,
    name: product.p_name,
    price: product.p_price,
    discount_percentage: product.discount_percentage || 0,
    image: product.images?.[0] ? `${IMAGE_BASE_URL}${product.images[0]}` : '',
    size: selectedSize || (sizes.length > 0 ? sizes[0] : ''),
    color: selectedColor,
    quantity,
    product_code: product.product_code,
    fabric_type: product.fabric_type,
    hsn_code: product.hsn_code,
  });

  const getSubtotal = (items) =>
    items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  const addToCart = (cartItem, redirect = false) => {
    let cart = readCart();
    const existingIndex = cart.findIndex(
      (item) => item.id === cartItem.id && item.size === cartItem.size && item.color === cartItem.color
    );
    if (existingIndex > -1) {
      const availableQty = product.size[cartItem.size];
      const newQty = Number(cart[existingIndex].quantity) + Number(cartItem.quantity);
      if (newQty > availableQty) {
        toast.error(`Only ${availableQty} item${availableQty > 1 ? 's' : ''} available for size ${cartItem.size}`, { position: 'top-right', autoClose: 2000 });
        return;
      }
      cart[existingIndex].quantity = newQty;
    } else {
      cart.push({ ...cartItem });
    }
    writeCart(cart);
    if (redirect) {
      navigate('/cart');
    } else {
      setIsCartDrawerOpen(true);
      toast.success('Product added to cart!', { position: 'top-right', autoClose: 1500 });
    }
  };

  const removeFromCart = (index) => {
    const next = [...cartItems];
    next.splice(index, 1);
    writeCart(next);
  };

  const updateQty = (index, delta) => {
    const item = cartItems[index];
    if (!item) return;
    const max = item.size && product.size?.[item.size] ? product.size[item.size] : Infinity;
    const next = [...cartItems];
    next[index] = { ...item, quantity: Math.min(Math.max(1, Number(item.quantity) + delta), max) };
    writeCart(next);
  };

  return (
    <>
      <main>
        <section className="product-details py-5" style={{ marginTop: '80px' }}>
          <div className="container">
            <div className="row">
              {/* ── Product Images ── */}
              <div className="col-lg-6">
                <div className="product-gallery">
                  <div className="product-gallery-left">
                    <Swiper
                      modules={[Navigation, Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView="auto"
                      direction="vertical"
                      freeMode={true}
                      watchSlidesProgress={true}
                      className="product-thumbs-slider"
                      breakpoints={{
                        0: { direction: 'horizontal', slidesPerView: 4 },
                        992: { direction: 'vertical', slidesPerView: 'auto' },
                      }}
                    >
                      {product.images?.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img src={`${IMAGE_BASE_URL}${image}`} alt={`${product.p_name} thumbnail ${index + 1}`} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <div className="product-gallery-right">
                    <div className="position-relative">
                      <Swiper
                        modules={[Navigation, Thumbs]}
                        navigation={{ nextEl: '.custom-arrow-right-pd', prevEl: '.custom-arrow-left-pd' }}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        className="product-main-slider"
                        onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                      >
                        {product.images?.map((image, index) => (
                          <SwiperSlide key={index}>
                            <div className="zoom-container d-none d-lg-block" onMouseMove={handleImageMouseMove} onMouseEnter={handleImageMouseEnter} onMouseLeave={handleImageMouseLeave}>
                              <img src={`${IMAGE_BASE_URL}${image}`} alt={`${product.p_name} ${index + 1}`} />
                              {isZooming && currentImageIndex === index && (
                                <div className="zoom-lens" style={{ left: `${lensPosition.x}px`, top: `${lensPosition.y}px` }} />
                              )}
                            </div>
                            <div className="zoom-container d-lg-none mobile-zoom-trigger" onClick={() => handleMobileImageClick(`${IMAGE_BASE_URL}${image}`)}>
                              <img src={`${IMAGE_BASE_URL}${image}`} alt={`${product.p_name} ${index + 1}`} />
                              <div className="mobile-zoom-icon"><FontAwesomeIcon icon={faSearchPlus} /></div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="custom-arrow custom-arrow-left-pd"><FaArrowLeft /></div>
                      <div className="custom-arrow custom-arrow-right-pd"><FaArrowRight /></div>
                      {isZooming && product.images?.[currentImageIndex] && (
                        <div className="zoom-viewer-desktop d-none d-lg-block">
                          <img src={`${IMAGE_BASE_URL}${product.images[currentImageIndex]}`} alt={`${product.p_name} zoomed`} style={{ left: `-${zoomPosition.x * 2}%`, top: `-${zoomPosition.y * 2}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Product Info ── */}
              <div className="col-lg-6">
                <div className="product-info ps-lg-5">
                  <h2 className="display-8 mb-4 text-start">{product.p_name}</h2>

                  <div className="price mb-4 text-start">
                    {localStorage.getItem('authToken') && user?.created_by && product.discount_percentage > 0 ? (
                      <>
                        <span className="amount h4 text-danger">
                          ₹{(product.p_price - (product.p_price * product.discount_percentage) / 100).toFixed(2)}
                        </span>
                        <span className="ms-2 text-muted text-decoration-line-through">₹{product.p_price?.toFixed(2)}</span>
                        <span className="price-off ms-2">{product.discount_percentage}% off</span>
                      </>
                    ) : (
                      <span className="amount h4">₹{product.p_price?.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="product-form text-start">
                    {/* Size Selector */}
                    {sizes.length > 0 && !isOutOfStock && (
                      <div className="size-selector mb-4">
                        <label className="form-label">Size</label>
                        <div className="size-options">
                          {sizes.map((size) => {
                            const qty = product.size[size];
                            const isDisabled = qty === 0;
                            return (
                              <button
                                key={size}
                                type="button"
                                className={`btn me-2 ${selectedSize === size ? 'btn-dark' : 'btn-outline-dark'} ${isDisabled ? 'disabled opacity-50' : ''}`}
                                onClick={() => { if (!isDisabled) { setSelectedSize(size); setQuantity(1); } }}
                                disabled={isDisabled}
                                style={isDisabled ? { cursor: 'not-allowed', textDecoration: 'line-through', opacity: 0.5 } : {}}
                              >
                                {size} {isDisabled ? '(0)' : `(${qty})`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {isOutOfStock && (
                      <div className="mb-4">
                        <div className="alert alert-danger d-inline-flex align-items-center" role="alert">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          <strong>Out of Stock</strong>
                        </div>
                      </div>
                    )}

                    {colors.length > 0 && (
                      <div className="color-selector mb-4">
                        <label className="form-label">Color</label>
                        <div className="color-options">
                          {colors.map((color) => (
                            <button key={color} type="button" className={`btn btn-outline-dark me-2 ${selectedColor === color ? 'active' : ''}`} onClick={() => setSelectedColor(color)}>
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isOutOfStock && !isSelectedSizeOutOfStock && (
                      <div className="quantity-selector mb-4">
                        <label className="form-label">Quantity</label>
                        <div className="input-group" style={{ width: '140px' }}>
                          <button className="btn btn-outline-dark" type="button" onClick={() => { if (quantity > 1) setQuantity(quantity - 1); }} disabled={quantity <= 1}>
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <input type="text" className="form-control text-center" value={quantity} readOnly />
                          <button
                            className="btn btn-outline-dark"
                            type="button"
                            onClick={() => {
                              const maxQty = selectedSize && product.size[selectedSize] ? product.size[selectedSize] : Infinity;
                              if (quantity < maxQty) { setQuantity(quantity + 1); }
                              else { toast.error(`Only ${maxQty} item${maxQty > 1 ? 's' : ''} available for size ${selectedSize}`, { position: 'top-right', autoClose: 2000 }); }
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="product-actions d-flex gap-2 mb-4">
                      <button type="button" className="btn btn-dark flex-grow-1 text-uppercase py-3 font-heading" onClick={() => addToCart(buildCartItem(), false)} disabled={!canAddToCart()}>
                        Add to Cart
                      </button>
                      <button type="button" className="btn btn-success flex-grow-1 text-uppercase py-3 font-heading" onClick={() => addToCart(buildCartItem(), true)} disabled={!canAddToCart()}>
                        Buy Now
                      </button>
                    </div>

                    {/* Description */}
                    <div className="description-section">
                      <div className="description-header" onClick={toggleDescription}>
                        <h6>DESCRIPTION</h6>
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                      {isOpen && (
                        <div className="description-content text-muted">
                          <p className="mb-0">{product.p_description}</p>
                        </div>
                      )}
                    </div>

                    {/* Specifications */}
                    <div className="specifications-section">
                      <h5>SPECIFICATIONS</h5>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="spec-item"><div className="label">Fabric</div><div className="value">{product.fabric_type}</div></div>
                        </div>
                        <div className="col-md-6">
                          <div className="spec-item"><div className="label">HSN Code</div><div className="value">{product.hsn_code}</div></div>
                        </div>
                        <div className="col-md-6">
                          <div className="spec-item"><div className="label">Product Code</div><div className="value">{product.product_code}</div></div>
                        </div>
                        {token && user?.created_by && (
                          <div className="col-md-6">
                            <div className="spec-item"><div className="label">Discount</div><div className="value">{product.discount_percentage}%</div></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── Reviews Section ── */}
                    <ReviewsSection productId={product.p_id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Zoom Modal */}
        {isMobileZoomOpen && (
          <div className="mobile-zoom-modal" onClick={closeMobileZoom}>
            <button className="mobile-zoom-close" onClick={closeMobileZoom}><FontAwesomeIcon icon={faTimes} /></button>
            <div className="mobile-zoom-content" onClick={(e) => e.stopPropagation()}>
              <img src={mobileZoomImage} alt="Zoomed product" />
            </div>
          </div>
        )}

        {isCartDrawerOpen && (
          <div className="cart-drawer-backdrop position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" onClick={() => setIsCartDrawerOpen(false)} />
        )}

        <aside
          className="cart-drawer position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
          style={{ width: '360px', transform: isCartDrawerOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease-in-out', zIndex: 1050 }}
        >
          <div className="cart-drawer-header d-flex justify-content-between align-items-center p-3 flex-shrink-0">
            <h5 className="mb-0">Your Cart</h5>
            <button className="btn-close" onClick={() => setIsCartDrawerOpen(false)} />
          </div>
          <div className="p-3 overflow-auto flex-grow-1">
            {cartItems.length > 0 ? cartItems.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="cart-item d-flex align-items-center mb-3 border rounded p-2">
                <img src={item.image} alt={item.name} className="img-fluid rounded me-3" style={{ width: '64px', height: '64px', objectFit: 'cover' }} />
                <div className="flex-grow-1">
                  <div className="fw-semibold">{item.name}</div>
                  <div className="small text-muted">
                    {item.size && <>Size: {item.size} · </>}
                    {item.color && <>Color: {item.color} · </>}
                    ₹{Number(item.price).toFixed(2)}
                  </div>
                  <div className="d-flex align-items-center mt-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQty(index, -1)}>-</button>
                    <span className="mx-2">{item.quantity}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQty(index, +1)}>+</button>
                    <button className="btn btn-sm btn-link text-danger ms-3" onClick={() => removeFromCart(index)}>Remove</button>
                  </div>
                </div>
                <div className="fw-semibold">₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</div>
              </div>
            )) : <p className="text-muted">Your cart is empty.</p>}
          </div>
          <div className="cart-drawer-footer p-3 flex-shrink-0">
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-semibold">Subtotal</span>
              <span className="fw-bold">₹{getSubtotal(cartItems).toFixed(2)}</span>
            </div>
            <button className="btn btn-dark w-100" disabled={cartItems.length === 0} onClick={() => { setIsCartDrawerOpen(false); navigate('/cart'); }}>
              Go to Cart
            </button>
          </div>
        </aside>

        <ToastContainer />
      </main>
    </>
  );
};

export default ProductDetails;