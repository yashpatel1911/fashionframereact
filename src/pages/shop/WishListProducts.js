import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import "../../assets/custom.css";
import "../../assets/products.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUser } from "../../context/UserContext";

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
    has_previous: false
  });
  const token = localStorage.getItem("authToken");

  const fetchProducts = async (page = 1, perPage = 12) => {
    setLoading(true);
    setError("");
    
    let body = {
      page: page,
      per_page: perPage
    };

    if (subcategory) {
      body.sc_slug = subcategory;
      console.log("Fetching products for subcategory:", subcategory);
    }

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(API_ENDPOINTS.WISHLISTPRODUCTS, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.status && Array.isArray(data.data)) {
        setProducts(data.data);
        
        if (data.pagination) {
          setPagination(data.pagination);
        } else {
          setPagination({
            current_page: page,
            per_page: perPage,
            total_count: data.data.length,
            total_pages: 1,
            has_next: false,
            has_previous: false
          });
        }
      } else {
        setProducts([]);
        setError(data.message || "Failed to fetch products.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
      setError(`An error occurred while fetching products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.p_price - b.p_price;
    if (sortBy === "price-high") return b.p_price - a.p_price;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <main>
      <section className="page-header bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
            
            </div>
          </div>
        </div>
      </section>

      <section className="products-wrapper">
        <div className="container">
          <div
            className="products-header d-flex flex-wrap justify-content-between align-items-center mb-4"
            data-aos="zoom-out"
          >
            <button
              className="btn btn-filter d-lg-none mb-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#filterOffcanvas"
            >
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              Filter
            </button>
            <div className="showing-products text-secondary mb-2">
              Showing{" "}
              <span className="fw-medium text-dark">
                {pagination.total_count > 0 
                  ? `${(pagination.current_page - 1) * pagination.per_page + 1}-${Math.min(pagination.current_page * pagination.per_page, pagination.total_count)} of ${pagination.total_count}`
                  : '0'
                }
              </span>{" "}
              products
            </div>
            <div className="products-actions d-flex align-items-center mb-2">
              <select
                className="form-select me-3 bg-light border-0"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <>
              <div className="row g-4">
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <div
                      key={product.p_id}
                      className="col-12 col-sm-6 col-md-4 col-lg-3"
                    >
                      <div className="product-card h-100 d-flex flex-column">
                        <div className="product-image-wrapper position-relative">
                          <a href={`/product/${product.p_slug}`}>
                            <img
                              src={
                                product.images?.[0]?.startsWith("http")
                                  ? product.images[0]
                                  : `${IMAGE_BASE_URL}${product.images?.[0]}`
                              }
                              alt={product.p_name}
                              className="product-image-fix"
                            />
                          </a>
                          {token && (
                            <div
                              className="wishlist-icon"
                              onClick={() => handleWishlistToggle(product.p_id)}
                              style={{ cursor: "pointer" }}
                            >
                              <FontAwesomeIcon
                                icon={
                                  product.is_wishlisted
                                    ? faSolidHeart
                                    : faRegularHeart
                                }
                                className="icon-heart"
                                style={{
                                  color: product.is_wishlisted
                                    ? "red"
                                    : "inherit",
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="product-name">{product.p_name}</div>

                        <div className="price-section mt-auto">
                          {token && user?.created_by ? (
                            <div className="price-values d-flex align-items-center">
                              <span className="price-now">
                                ₹
                                {Math.round(
                                  (parseFloat(product.p_price) || 0) *
                                    (1 -
                                      (parseFloat(
                                        product.discount_percentage
                                      ) || 0) /
                                        100)
                                )}
                              </span>
                              {product.discount_percentage > 0 && (
                                <>
                                  <span className="price-original">
                                    ₹{parseFloat(product.p_price) || 0}
                                  </span>
                                  <span className="price-off">
                                    {product.discount_percentage}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="price-now">
                              ₹{parseFloat(product.p_price) || 0}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center text-muted py-5">
                    No products found.
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {pagination.total_pages > 1 && (
                <div className="custom-pagination-wrapper">
                  <nav aria-label="Product pagination">
                    <ul className="custom-pagination">
                      {/* Previous Button */}
                      <li className={`custom-page-item ${!pagination.has_previous ? 'disabled' : ''}`}>
                        <button
                          className="custom-page-link"
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          disabled={!pagination.has_previous}
                        >
                          Previous
                        </button>
                      </li>

                      {/* Page Numbers */}
                      {[...Array(pagination.total_pages)].map((_, index) => {
                        const pageNum = index + 1;
                        
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.total_pages ||
                          (pageNum >= pagination.current_page - 1 && pageNum <= pagination.current_page + 1)
                        ) {
                          return (
                            <li
                              key={pageNum}
                              className={`custom-page-item ${pagination.current_page === pageNum ? 'active' : ''}`}
                            >
                              <button
                                className="custom-page-link"
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </button>
                            </li>
                          );
                        } else if (
                          pageNum === pagination.current_page - 2 ||
                          pageNum === pagination.current_page + 2
                        ) {
                          return (
                            <li key={pageNum} className="custom-page-item disabled">
                              <span className="custom-page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}

                      {/* Next Button */}
                      <li className={`custom-page-item ${!pagination.has_next ? 'disabled' : ''}`}>
                        <button
                          className="custom-page-link"
                          onClick={() => handlePageChange(pagination.current_page + 1)}
                          disabled={!pagination.has_next}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
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