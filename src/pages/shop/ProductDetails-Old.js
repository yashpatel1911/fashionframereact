import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import { FaArrowLeft, FaArrowRight, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import '../../assets/custom.css';
import { useUser } from "../../context/UserContext";

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

  // Cart drawer state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Flipkart-style zoom states
  const [isZooming, setIsZooming] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const token = localStorage.getItem('authToken');

  // helpers for localStorage cart
  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  };

  const writeCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartItems(cart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Flipkart-style zoom handlers
  const handleImageMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    // Lens size (the box that shows on the image)
    const lensSize = 150;

    // Calculate mouse position relative to the image
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Calculate lens position (centered on cursor)
    let lensX = x - lensSize / 2;
    let lensY = y - lensSize / 2;

    // Constrain lens within image boundaries
    lensX = Math.max(0, Math.min(lensX, rect.width - lensSize));
    lensY = Math.max(0, Math.min(lensY, rect.height - lensSize));

    // Calculate zoom position (inverted for the zoomed image)
    const zoomX = (lensX / rect.width) * 100;
    const zoomY = (lensY / rect.height) * 100;

    setLensPosition({ x: lensX, y: lensY });
    setZoomPosition({ x: zoomX, y: zoomY });
  };

  const handleImageMouseEnter = () => {
    setIsZooming(true);
  };

  const handleImageMouseLeave = () => {
    setIsZooming(false);
  };

  useEffect(() => {
    // hydrate cart on mount and keep synced
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
          body: JSON.stringify({ p_slug: p_slug })
        });
        const data = await response.json();
        let prod = null;
        if (response.ok && data.status && data.data) {
          if (Array.isArray(data.data)) {
            prod = data.data.length > 0 ? data.data[0] : null;
          } else {
            prod = data.data;
          }
          setProduct(prod);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Failed to fetch product details.');
        }
      } catch (err) {
        setError('An error occurred while fetching product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [p_slug, navigate, token]);

  if (loading) return <div className="text-center text-muted py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center py-5">{error}</div>;
  if (!product) return <div className="text-center text-muted py-5">Product not found.</div>;

  const sizes = product.size ? Object.keys(product.size) : [];
  const colors = product.colors || [];

  const toggleDescription = () => setIsOpen(!isOpen);

  const buildCartItem = () => ({
    id: product.p_id,
    name: product.p_name,
    price: product.p_price,
    discount_percentage: product.discount_percentage || 0,
    image:
      product.images && product.images[0]
        ? `${IMAGE_BASE_URL}${product.images[0]}`
        : '',
    size: selectedSize || (sizes.length > 0 ? sizes[0] : ''),
    color: selectedColor,
    quantity: quantity,
    product_code: product.product_code,
    fabric_type: product.fabric_type,
    hsn_code: product.hsn_code,
  });

  const getSubtotal = (items) =>
    items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  const addToCart = (cartItem, redirect = false) => {
    let cart = readCart();

    const existingIndex = cart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );

    if (existingIndex > -1) {
      const availableQty = product.size[cartItem.size];
      const newQty = Number(cart[existingIndex].quantity) + Number(cartItem.quantity);
      if (newQty > availableQty) {
        toast.error(
          `Only ${availableQty} item${availableQty > 1 ? 's' : ''} available for size ${cartItem.size}`,
          { position: 'top-right', autoClose: 2000 }
        );
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
      toast.success('Product added to cart!', {
        position: 'top-right',
        autoClose: 1500,
      });
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
    const nextQty = Math.min(Math.max(1, Number(item.quantity) + delta), max);
    const next = [...cartItems];
    next[index] = { ...item, quantity: nextQty };
    writeCart(next);
  };

  return (
    <>
      <style>{`
        .product-gallery {
          position: relative;
        }

        .zoom-container {
          position: relative;
          cursor: crosshair;
        }
        
        .zoom-lens {
          position: absolute;
          border: 2px solid rgba(0, 0, 0, 0.3);
          background: rgba(255, 255, 255, 0.3);
          pointer-events: none;
          width: 150px;
          height: 150px;
          z-index: 10;
        }
        
        .zoom-viewer {
          position: absolute;
          top: 0;
          left: calc(100% + 20px);
          width: 700px;
          height: 800px;
          border: 1px solid #ddd;
          background: white;
          overflow: hidden;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border-radius: 4px;
        }
        
        .zoom-viewer img {
          position: absolute;
          width: 200%;
          height: auto;
          max-width: none;
        }
        
        @media (max-width: 1400px) {
          .zoom-viewer {
            width: 400px;
            height: 500px;
          }
        }
        
        @media (max-width: 991px) {
          .zoom-viewer {
            display: none !important;
          }
        }

        .cart-drawer-backdrop {
          z-index: 1040;
        }

        .cart-drawer {
          z-index: 1050;
        }
      `}</style>

      <main>
        <section className="product-details py-5">
          <div className="container">
            <div className="row">
              {/* Product Images */}
              <div className="col-lg-6">
                <div className="product-gallery">
                  <div className="position-relative">
                    <Swiper
                      modules={[Navigation, Thumbs]}
                      navigation={{
                        nextEl: '.custom-arrow-right-pd',
                        prevEl: '.custom-arrow-left-pd',
                      }}
                      thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                      className="product-main-slider mb-3"
                      onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                    >
                      {product.images && product.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className="zoom-container"
                            onMouseMove={handleImageMouseMove}
                            onMouseEnter={handleImageMouseEnter}
                            onMouseLeave={handleImageMouseLeave}
                          >
                            <img
                              src={`${IMAGE_BASE_URL}${image}`}
                              alt={`${product.p_name} ${index + 1}`}
                              className="img-fluid"
                              style={{ width: '100%', display: 'block' }}
                            />

                            {/* Lens indicator */}
                            {isZooming && currentImageIndex === index && (
                              <div
                                className="zoom-lens"
                                style={{
                                  left: `${lensPosition.x}px`,
                                  top: `${lensPosition.y}px`,
                                }}
                              />
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <div className="custom-arrow custom-arrow-left-pd"><FaArrowLeft /></div>
                    <div className="custom-arrow custom-arrow-right-pd"><FaArrowRight /></div>
                  </div>

                  {/* Zoom viewer panel - Outside Swiper */}
                  {isZooming && product.images && product.images[currentImageIndex] && (
                    <div className="zoom-viewer d-none d-lg-block">
                      <img
                        src={`${IMAGE_BASE_URL}${product.images[currentImageIndex]}`}
                        alt={`${product.p_name} zoomed`}
                        style={{
                          left: `-${zoomPosition.x * 2}%`,
                          top: `-${zoomPosition.y * 2}%`,
                        }}
                      />
                    </div>
                  )}

                  <Swiper
                    modules={[Navigation, Thumbs]}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    className="product-thumbs-slider"
                  >
                    {product.images && product.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={`${IMAGE_BASE_URL}${image}`}
                          alt={`${product.p_name} thumbnail ${index + 1}`}
                          className="img-fluid"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              {/* Product Info */}
              <div className="col-lg-6">
                <div className="product-info ps-lg-5">
                  <h2 className="display-8 mb-4 text-start">{product.p_name}</h2>
                  <div className="price mb-4 text-start">
                    {localStorage.getItem("authToken") && user?.created_by && product.discount_percentage > 0 ? (
                      <>
                        <span className="amount h4 text-danger">
                          ₹{(product.p_price - (product.p_price * product.discount_percentage) / 100).toFixed(2)}
                        </span>
                        <span className="ms-2 text-muted text-decoration-line-through">
                          ₹{product.p_price?.toFixed(2)}
                        </span>
                        <span className="price-off ms-2">{product.discount_percentage}% off</span>
                      </>
                    ) : (
                      <span className="amount h4">₹{product.p_price?.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="product-form text-start">
                    {/* Size Selector */}
                    {sizes.length > 0 && (
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
                                className={`btn me-2 ${selectedSize === size ? 'btn-dark' : 'btn-outline-dark'} ${isDisabled ? 'disabled text-muted' : ''}`}
                                onClick={() => {
                                  if (!isDisabled) {
                                    setSelectedSize(size);
                                    setQuantity(1);
                                  }
                                }}
                                disabled={isDisabled}
                              >
                                {size} ({qty})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Color Selector */}
                    {colors.length > 0 && (
                      <div className="color-selector mb-4">
                        <label className="form-label">Color</label>
                        <div className="color-options">
                          {colors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`btn btn-outline-dark me-2 ${selectedColor === color ? 'active' : ''}`}
                              onClick={() => setSelectedColor(color)}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="quantity-selector mb-4">
                      <label className="form-label">Quantity</label>
                      <div className="input-group" style={{ width: '140px' }}>
                        <button
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={() => { if (quantity > 1) setQuantity(quantity - 1); }}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input type="text" className="form-control text-center" value={quantity} readOnly />
                        <button
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={() => {
                            const maxQty = selectedSize && product.size[selectedSize] ? product.size[selectedSize] : Infinity;
                            if (quantity < maxQty) {
                              setQuantity(quantity + 1);
                            } else {
                              toast.error(`Only ${maxQty} item${maxQty > 1 ? 's' : ''} available for size ${selectedSize}`, {
                                position: 'top-right',
                                autoClose: 2000,
                              });
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="product-actions d-flex gap-2 mb-4">
                      <button
                        type="button"
                        className="btn btn-dark flex-grow-1 text-uppercase py-3 font-heading"
                        onClick={() => {
                          if (sizes.length > 0 && !selectedSize) {
                            toast.error('Please select a size before adding to cart.', {
                              position: 'top-right',
                              autoClose: 2000,
                            });
                            return;
                          }
                          addToCart(buildCartItem(), false);
                        }}
                      >
                        Add to Cart
                      </button>

                      <button
                        type="button"
                        className="btn btn-success flex-grow-1 text-uppercase py-3 font-heading"
                        onClick={() => {
                          if (sizes.length > 0 && !selectedSize) {
                            toast.error('Please select a size before buying.', {
                              position: 'top-right',
                              autoClose: 2000,
                            });
                            return;
                          }
                          addToCart(buildCartItem(), true);
                        }}
                      >
                        Buy Now
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-dark flex-shrink-0 py-3"
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                    </div>

                    {/* Description & Specs */}
                    <div className="border p-3 mb-4">
                      <div
                        className="d-flex justify-content-between align-items-center"
                        onClick={toggleDescription}
                        style={{ cursor: 'pointer' }}
                      >
                        <h6 className="mb-0" style={{ letterSpacing: '2px' }}>DESCRIPTION</h6>
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                      {isOpen && (
                        <div className="text-start text-muted">
                          <p className="mb-2 mt-2">{product.p_description}</p>
                        </div>
                      )}
                    </div>

                    <h5 className="mb-4">SPECIFICATIONS</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="spec-item"><div className="label">Fabric</div><div className="value">{product.fabric_type}</div></div>
                        <div className="spec-item"><div className="label">Product Code</div><div className="value">{product.product_code}</div></div>
                      </div>
                      <div className="col-md-6">
                        {token && user?.created_by && (
                          <div className="spec-item"><div className="label">Discount</div><div className="value">{product.discount_percentage}%</div></div>
                        )}
                        <div className="spec-item"><div className="label">HSN Code</div><div className="value">{product.hsn_code}</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cart Drawer Backdrop */}
        {isCartDrawerOpen && (
          <div
            className="cart-drawer-backdrop position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={() => setIsCartDrawerOpen(false)}
          />
        )}

        {/* Cart Drawer Panel */}
        <aside
          className="cart-drawer position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
          style={{
            width: '360px',
            transform: isCartDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom flex-shrink-0">
            <h5 className="mb-0">Your Cart</h5>
            <button className="btn-close" onClick={() => setIsCartDrawerOpen(false)} />
          </div>

          {/* Scrollable items */}
          <div className="p-3 overflow-auto flex-grow-1">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}-${index}`}
                  className="d-flex align-items-center mb-3 border rounded p-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded me-3"
                    style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{item.name}</div>
                    <div className="small text-muted">
                      {item.size && <>Size: {item.size} · </>}
                      {item.color && <>Color: {item.color} · </>}
                      ₹{Number(item.price).toFixed(2)}
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQty(index, -1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQty(index, +1)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm btn-link text-danger ms-3"
                        onClick={() => removeFromCart(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="fw-semibold">
                    ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Your cart is empty.</p>
            )}
          </div>

          {/* Footer */}
          <div className="border-top p-3 flex-shrink-0">
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-semibold">Subtotal</span>
              <span className="fw-bold">₹{getSubtotal(cartItems).toFixed(2)}</span>
            </div>
            <button
              className="btn btn-dark w-100"
              disabled={cartItems.length === 0}
              onClick={() => {
                setIsCartDrawerOpen(false);
                navigate('/cart');
              }}
            >
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