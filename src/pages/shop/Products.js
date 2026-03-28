import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faSlidersH, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUser } from "../../context/UserContext";
import "../../assets/products.css";

const Products = () => {
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
    let body = { page, per_page: perPage };
    if (subcategory) body.sc_slug = subcategory;

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(API_ENDPOINTS.PRODUCTSBYPAGE, {
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
  }, [subcategory]);

  const handleWishlistToggle = async (productId) => {
    try {
      const headers = { "Content-Type": "application/json", Accept: "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(API_ENDPOINTS.WISHLISTTOGGLE, {
        method: "POST",
        headers,
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await response.json();
      if (response.ok) fetchProducts(pagination.current_page, pagination.per_page);
      else alert(data.message || "Failed to update wishlist.");
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

  const renderPageNumbers = () => {
    const { current_page, total_pages } = pagination;
    const items = [];
    for (let i = 1; i <= total_pages; i++) {
      const near =
        i === 1 ||
        i === total_pages ||
        (i >= current_page - 1 && i <= current_page + 1);
      const ellipsis = i === current_page - 2 || i === current_page + 2;
      if (near) {
        items.push(
          <button
            key={i}
            className={`lux-page-num ${current_page === i ? "active" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      } else if (ellipsis) {
        items.push(
          <span key={`e-${i}`} className="lux-ellipsis">
            ···
          </span>
        );
      }
    }
    return items;
  };

  return (
    <main className="lux-main">
      {/* ── PAGE HEADER ── */}
      <section className="lux-hero">
        <div className="lux-hero-bg" aria-hidden="true">
          <span className="lux-hero-circle lux-hero-circle--1" />
          <span className="lux-hero-circle lux-hero-circle--2" />
        </div>
        <div className="lux-container">
          <p className="lux-hero-eyebrow">Collection</p>
          <h1 className="lux-hero-title">
            {subcategory
              ? subcategory.replace(/-/g, " ")
              : "Our Products"}
          </h1>
          <div className="lux-hero-rule" aria-hidden="true" />
        </div>
      </section>

      {/* ── TOOLBAR ── */}
      <section className="lux-toolbar-wrap">
        <div className="lux-container">
          <div className="lux-toolbar">
            <p className="lux-count">
              {pagination.total_count > 0 ? (
                <>
                  <span className="lux-count-num">
                    {(pagination.current_page - 1) * pagination.per_page + 1}–
                    {Math.min(
                      pagination.current_page * pagination.per_page,
                      pagination.total_count
                    )}
                  </span>
                  &nbsp;of {pagination.total_count} pieces
                </>
              ) : (
                "No products"
              )}
            </p>

            <div className="lux-sort-wrap">
              <FontAwesomeIcon icon={faSlidersH} className="lux-sort-icon" />
              <select
                className="lux-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="lux-catalog">
        <div className="lux-container">
          {loading ? (
            <div className="lux-loading">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="lux-error">{error}</div>
          ) : sortedProducts.length === 0 ? (
            <div className="lux-empty">
              <span className="lux-empty-icon">∅</span>
              <p>No products found.</p>
            </div>
          ) : (
            <div className="lux-grid">
              {sortedProducts.map((product, idx) => (
                <article
                  key={product.p_id}
                  className="lux-card"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Image */}
                  <a
                    href={`/product/${product.p_slug}`}
                    className="lux-card-img-link"
                  >
                    <div className="lux-card-img-wrap">
                      <img
                        src={
                          product.images?.[0]?.startsWith("http")
                            ? product.images[0]
                            : `${IMAGE_BASE_URL}${product.images?.[0]}`
                        }
                        alt={product.p_name}
                        className="lux-card-img"
                        loading="lazy"
                      />
                      {product.discount_percentage > 0 && (
                        <span className="lux-badge">
                          −{product.discount_percentage}%
                        </span>
                      )}
                    </div>
                  </a>

                  {/* Wishlist */}
                  {token && (
                    <button
                      className={`lux-wish ${product.is_wishlisted ? "lux-wish--active" : ""}`}
                      onClick={() => handleWishlistToggle(product.p_id)}
                      aria-label={
                        product.is_wishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <FontAwesomeIcon
                        icon={product.is_wishlisted ? faSolidHeart : faRegularHeart}
                      />
                    </button>
                  )}

                  {/* Info */}
                  <div className="lux-card-body">
                    <a
                      href={`/product/${product.p_slug}`}
                      className="lux-card-name"
                    >
                      {product.p_name}
                    </a>

                    <div className="lux-card-price">
                      {token && user?.created_by ? (
                        <>
                          <span className="lux-price-now">
                            ₹
                            {Math.round(
                              (parseFloat(product.p_price) || 0) *
                                (1 -
                                  (parseFloat(product.discount_percentage) ||
                                    0) /
                                    100)
                            )}
                          </span>
                          {product.discount_percentage > 0 && (
                            <span className="lux-price-original">
                              ₹{parseFloat(product.p_price) || 0}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="lux-price-now">
                          ₹{parseFloat(product.p_price) || 0}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ── PAGINATION ── */}
          {!loading && pagination.total_pages > 1 && (
            <div className="lux-pag-wrap">
              <nav className="lux-pag" aria-label="Product pagination">
                <button
                  className="lux-pag-nav"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={!pagination.has_previous}
                  aria-label="Previous page"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <div className="lux-pag-nums">{renderPageNumbers()}</div>

                <button
                  className="lux-pag-nav"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={!pagination.has_next}
                  aria-label="Next page"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Products;