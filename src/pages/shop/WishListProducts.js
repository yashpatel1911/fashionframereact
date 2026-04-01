import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import { useUser } from "../../context/UserContext";
import "../../assets/css/wishlist.css";

const WishListProducts = () => {
  const { subcategory } = useParams();
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total_count: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });
  const token = localStorage.getItem("authToken");

  const fetchProducts = async (page = 1, perPage = 12) => {
    setLoading(true);
    setError("");
    const body = { page, per_page: perPage };
    if (subcategory) body.sc_slug = subcategory;

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(API_ENDPOINTS.WISHLISTPRODUCTS, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok && data.status && Array.isArray(data.data)) {
        setProducts(data.data);
        setPagination(
          data.pagination || {
            current_page: page,
            per_page: perPage,
            total_count: data.data.length,
            total_pages: 1,
            has_next: false,
            has_previous: false,
          }
        );
      } else {
        setProducts([]);
        setError(data.message || "Failed to fetch products.");
      }
    } catch (err) {
      setProducts([]);
      setError(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [subcategory]);

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
        fetchProducts(pagination.current_page, pagination.per_page);
      } else {
        alert(data.message || "Failed to update wishlist.");
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchProducts(newPage, pagination.per_page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.p_price - b.p_price;
    if (sortBy === "price-high") return b.p_price - a.p_price;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const showRange =
    pagination.total_count > 0
      ? `${(pagination.current_page - 1) * pagination.per_page + 1}–${Math.min(
          pagination.current_page * pagination.per_page,
          pagination.total_count
        )} of ${pagination.total_count}`
      : "0";

  return (
    <main className="lux-wishlist-page">

      {/* ── Page Header ── */}
      <div className="lux-wishlist-header">
        <p className="lux-wishlist-subtitle">Your curated selection</p>
        <h1 className="lux-wishlist-title">Wishlist</h1>
      </div>

      <section className="lux-wishlist-section">
        <div className="container">

          {/* ── Toolbar ── */}
          <div className="lux-toolbar">
            <span className="lux-count-label">
              Showing <strong>{showRange}</strong> items
            </span>
            <select
              className="lux-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="lux-wish-loading">Loading your wishlist</div>
          ) : error ? (
            <div className="lux-wish-empty">
              <span className="lux-wish-empty-icon">♡</span>
              <h2 className="lux-wish-empty-title">Something went wrong</h2>
              <p className="lux-wish-empty-sub">{error}</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="lux-wish-empty">
              <span className="lux-wish-empty-icon">♡</span>
              <h2 className="lux-wish-empty-title">Your wishlist is empty</h2>
              <p className="lux-wish-empty-sub">
                Save the pieces you love and find them here
              </p>
              <a href="/products" className="lux-btn-ghost">
                Explore Collection
              </a>
            </div>
          ) : (
            <>
              <div className="row g-3 g-md-4">
                {sortedProducts.map((product) => {
                  const imgSrc = product.images?.[0]?.startsWith("http")
                    ? product.images[0]
                    : `${IMAGE_BASE_URL}${product.images?.[0]}`;

                  const discountedPrice = Math.round(
                    (parseFloat(product.p_price) || 0) *
                      (1 - (parseFloat(product.discount_percentage) || 0) / 100)
                  );

                  const isVendor = token && user?.created_by;

                  return (
                    <div
                      key={product.p_id}
                      className="col-6 col-md-4 col-lg-3"
                    >
                      <div className="lux-wish-card">

                        {/* Image */}
                        <div className="lux-wish-img-wrap">
                          <a href={`/product/${product.p_slug}`}>
                            <img src={imgSrc} alt={product.p_name} />
                          </a>

                          {/* Heart */}
                          {token && (
                            <div
                              className={`lux-heart-btn ${product.is_wishlisted ? "active" : ""}`}
                              onClick={() => handleWishlistToggle(product.p_id)}
                            >
                              <FontAwesomeIcon
                                icon={product.is_wishlisted ? faSolidHeart : faRegularHeart}
                                className="icon-heart"
                                style={{ color: product.is_wishlisted ? "#c0392b" : "#b0a89c" }}
                              />
                            </div>
                          )}

                          {/* View overlay */}
                          <a href={`/product/${product.p_slug}`} className="lux-wish-view">
                            View Product
                          </a>
                        </div>

                        {/* Body */}
                        <div className="lux-wish-body">
                          <a href={`/product/${product.p_slug}`} className="lux-wish-name">
                            {product.p_name}
                          </a>

                          <div className="lux-wish-price">
                            {isVendor ? (
                              <>
                                <span className="lux-price-now">₹{discountedPrice}</span>
                                {product.discount_percentage > 0 && (
                                  <>
                                    <span className="lux-price-original">
                                      ₹{parseFloat(product.p_price) || 0}
                                    </span>
                                    <span className="lux-price-off">
                                      {product.discount_percentage}% off
                                    </span>
                                  </>
                                )}
                              </>
                            ) : (
                              <span className="lux-price-now">
                                ₹{parseFloat(product.p_price) || 0}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Pagination ── */}
              {pagination.total_pages > 1 && (
                <div className="lux-pagination">
                  <button
                    className="lux-page-btn"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={!pagination.has_previous}
                  >
                    ←
                  </button>

                  {[...Array(pagination.total_pages)].map((_, idx) => {
                    const pg = idx + 1;
                    const near =
                      pg === 1 ||
                      pg === pagination.total_pages ||
                      (pg >= pagination.current_page - 1 &&
                        pg <= pagination.current_page + 1);
                    const dots =
                      pg === pagination.current_page - 2 ||
                      pg === pagination.current_page + 2;

                    if (near) {
                      return (
                        <button
                          key={pg}
                          className={`lux-page-btn ${pagination.current_page === pg ? "active" : ""}`}
                          onClick={() => handlePageChange(pg)}
                        >
                          {pg}
                        </button>
                      );
                    }
                    if (dots) {
                      return (
                        <span key={pg} className="lux-page-text">…</span>
                      );
                    }
                    return null;
                  })}

                  <button
                    className="lux-page-btn"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={!pagination.has_next}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </main>
  );
};

export default WishListProducts;