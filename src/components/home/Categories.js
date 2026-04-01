import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import LoadingSpinner from "../LoadingSpinner";
import '../../assets/css/categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(true);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [dialogCat, setDialogCat]   = useState(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const navigate = useNavigate();
  const token    = localStorage.getItem("authToken");

  /* ── Close dialog on Escape key ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setDialogCat(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  /* ── Lock body scroll when dialog is open ── */
  useEffect(() => {
    if (dialogCat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [dialogCat]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const headers = { "Content-Type": "application/json", Accept: "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(API_ENDPOINTS.CATEGORY, { method: "POST", headers });
        const data     = await response.json();

        if (response.ok && data.status && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
          setError(data.message || "Failed to fetch categories.");
        }
      } catch {
        setCategories([]);
        setError("An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [token]);

  const getImageUrl = (c_image) => {
    if (!c_image) return "/placeholder.png";
    return `${IMAGE_BASE_URL}${c_image}`;
  };

  const openDialog = (e, cat) => {
    e.stopPropagation();
    setDialogCat(cat);
  };

  const closeDialog = () => setDialogCat(null);

  const handleExplore = () => {
    if (!dialogCat) return;
    navigate(`/collection/${dialogCat.c_slug}`);
    closeDialog();
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <div className="cat-error">{error}</div>;

  return (
    <>
      <section className="cat-section">

        {/* ── Section header ── */}
        <div className="cat-header">
          <div className="cat-header-inner container">
            <div className="cat-eyebrow">
              <span className="cat-eyebrow-line" />
              Curated Collections
              <span className="cat-eyebrow-line" />
            </div>
            <h2 className="cat-title">New Collections</h2>
            <p className="cat-subtitle">
              Handpicked styles crafted with intention — discover each world.
            </p>
          </div>
        </div>

        {/* ── Slider ── */}
        <div className="cat-slider-wrap container">

          {/* Custom nav arrows */}
          <button ref={prevRef} className="cat-arrow cat-arrow--prev" aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button ref={nextRef} className="cat-arrow cat-arrow--next" aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            onSlideChange={(swiper) => setActiveIdx(swiper.realIndex)}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={24}
            slidesPerView={3}
            breakpoints={{
              0:    { slidesPerView: 1.15, spaceBetween: 14 },
              600:  { slidesPerView: 2,    spaceBetween: 18 },
              1024: { slidesPerView: 3,    spaceBetween: 24 },
            }}
            className="cat-swiper"
          >
            {categories.map((cat, idx) => (
              <SwiperSlide key={cat.c_id}>
                <div
                  className={`cat-card${idx === activeIdx ? ' cat-card--active' : ''}`}
                  onClick={() => navigate(`/collection/${cat.c_slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/collection/${cat.c_slug}`)}
                >
                  {/* Image */}
                  <div className="cat-img-wrap">
                    <img
                      src={getImageUrl(cat.c_image)}
                      alt={cat.c_name}
                      className="cat-img"
                      onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
                    />
                    {/* Overlay */}
                    <div className="cat-overlay" />
                    {/* Corner accent */}
                    <div className="cat-corner cat-corner--tl" />
                    <div className="cat-corner cat-corner--br" />
                  </div>

                  {/* Content */}
                  <div className="cat-content">
                    <div className="cat-index">0{idx + 1}</div>
                    <h3 className="cat-name">{cat.c_name}</h3>

                    {cat.c_description && (
                      <>
                        <p className="cat-desc">{cat.c_description}</p>
                        <button
                          className="cat-show-more"
                          onClick={(e) => openDialog(e, cat)}
                          aria-label={`Read more about ${cat.c_name}`}
                        >
                          Read more +
                        </button>
                      </>
                    )}

                    <div className="cat-cta">
                      <span>Explore</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Dot indicators */}
          <div className="cat-dots">
            {categories.map((_, i) => (
              <span key={i} className={`cat-dot${i === activeIdx ? ' cat-dot--active' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          DESCRIPTION DIALOG
      ════════════════════════════════════════════════ */}
      {dialogCat && (
        <div
          className="cat-dialog-backdrop"
          onClick={closeDialog}
          role="dialog"
          aria-modal="true"
          aria-label={dialogCat.c_name}
        >
          <div
            className="cat-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog image */}
            <div className="cat-dialog-img">
              <img
                src={getImageUrl(dialogCat.c_image)}
                alt={dialogCat.c_name}
                onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
              />
              <div className="cat-dialog-img-overlay" />
            </div>

            {/* Dialog body */}
            <div className="cat-dialog-body">
              <div className="cat-dialog-eyebrow">Collection</div>
              <div className="cat-dialog-divider" />
              <h2 className="cat-dialog-title">{dialogCat.c_name}</h2>
              <p className="cat-dialog-desc">{dialogCat.c_description}</p>

              <div className="cat-dialog-footer">
                {/* Explore CTA */}
                <button
                  className="cat-dialog-explore"
                  onClick={handleExplore}
                >
                  <span>Explore Collection</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Close button */}
                <button
                  className="cat-dialog-close"
                  onClick={closeDialog}
                  aria-label="Close dialog"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;