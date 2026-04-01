import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import '../../assets/css/subcategory.css';

const SubCategory = () => {
  const { c_slug } = useParams();
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const formatTitle = (slug = '') =>
    slug
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(API_ENDPOINTS.SUBCATEGORY, {
          method: 'POST',
          headers,
          body: JSON.stringify({ c_slug }),
        });
        const data = await response.json();

        if (response.ok && data.status && Array.isArray(data.data)) {
          setSubCategories(data.data);
        } else {
          setSubCategories([]);
          setError(data.message || 'Failed to fetch subcategories.');
        }
      } catch {
        setSubCategories([]);
        setError('An error occurred while fetching subcategories.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [c_slug, navigate]);

  const title = formatTitle(c_slug);

  return (
    <main className="sc-main">

      {/* ── HERO ── */}
      <section className="sc-hero">
        <div className="sc-hero-bg" aria-hidden="true">
          <span className="sc-hero-orb sc-hero-orb--1" />
          <span className="sc-hero-orb sc-hero-orb--2" />
          <span className="sc-hero-orb sc-hero-orb--3" />
        </div>

        <div className="sc-container">
          {/* Title block */}
          <div className="sc-hero-text">
            <p className="sc-eyebrow">Curated Selection</p>
            <h1 className="sc-title">
              <em>{title}</em>
              <span className="sc-title-plain">Collection</span>
            </h1>
            <div className="sc-rule" aria-hidden="true">
              <span className="sc-rule-line" />
              <span className="sc-rule-diamond" />
              <span className="sc-rule-line" />
            </div>
            {!loading && !error && (
              <p className="sc-subtitle">
                {subCategories.length} exclusive{' '}
                {subCategories.length === 1 ? 'style' : 'styles'} await you
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="sc-catalog">
        <div className="sc-container">

          {error && (
            <div className="sc-error" role="alert">{error}</div>
          )}

          {loading ? (
            <div className="sc-skeleton-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="sc-skeleton-card">
                  <div className="sc-skeleton-img" />
                  <div className="sc-skeleton-line sc-skeleton-line--wide" />
                  <div className="sc-skeleton-line sc-skeleton-line--narrow" />
                </div>
              ))}
            </div>
          ) : subCategories.length > 0 ? (
            <div className="sc-grid">
              {subCategories.map((subCat, idx) => (
                <Link
                  key={subCat.sc_id}
                  to={`/products/${subCat.sc_slug}`}
                  className="sc-card"
                  style={{ animationDelay: `${idx * 0.07}s` }}
                >
                  {/* Image */}
                  <div className="sc-card-img-wrap">
                    <img
                      src={`${IMAGE_BASE_URL}${subCat.sc_image}`}
                      alt={subCat.sc_name}
                      className="sc-card-img"
                      loading="lazy"
                    />
                    <div className="sc-card-overlay" aria-hidden="true">
                      <span className="sc-card-cta">Explore</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="sc-card-body">
                    <h3 className="sc-card-name">{subCat.sc_name}</h3>
                    {subCat.product_count !== undefined && (
                      <p className="sc-card-count">
                        {subCat.product_count}
                        <span> pieces</span>
                      </p>
                    )}
                    <span className="sc-card-arrow" aria-hidden="true">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !error && (
              <div className="sc-empty">
                <span className="sc-empty-icon">◇</span>
                <p>No styles found in this collection.</p>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default SubCategory;