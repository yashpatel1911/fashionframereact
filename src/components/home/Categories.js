import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS, { IMAGE_BASE_URL } from "../../api/apiConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import '../../assets/custom.css';
import LoadingSpinner from "../LoadingSpinner";


const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(API_ENDPOINTS.CATEGORY, {
          method: "POST",
          headers,
        });

        const data = await response.json();

        if (response.ok && data.status && Array.isArray(data.data)) {
          setCategories(data.data);
          
          setError("");
        } else if (data.message) {
          setCategories([]);
          setError(data.message);
        } else {
          setCategories([]);
          setError("Failed to fetch categories.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setCategories([]);
        setError("An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate, token]);

  const handleCategoryClick = (category) => {
    
    navigate(`/collection/${category.c_slug}`);
  };
  
  const getImageUrl = (c_image) => {
    if (!c_image) return "/placeholder.png";
    return `${IMAGE_BASE_URL}${c_image}`;
  };

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="text-center text-danger py-5">{error}</div>;
  }

  return (
    <main>
      <section id="billboard">
        <div className="container">
          <div className="row justify-content-center">
            <h1 className="page-title text-center mt-4" data-aos="fade-up">
              New Collections
            </h1>
            <div
              className="col-md-6 text-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
            </div>
          </div>

          <div className="row">
            <div className="position-relative" data-aos="fade-up">
              {/* Navigation arrows */}
              <div
                ref={prevRef}
                className="icon-arrow icon-arrow-left d-none d-md-flex"
              >
                <FaArrowLeft style={{ fontSize: "2rem" }} />
              </div>
              <div
                ref={nextRef}
                className="icon-arrow icon-arrow-right d-none d-md-flex"
              >
                <FaArrowRight style={{ fontSize: "2rem" }} />
              </div>

              {/* Swiper */}
              <div className="swiper main-swiper py-4" data-aos="fade-up" data-aos-delay="600">
                {categories.length === 0 && (
                  <p className="text-center text-muted">No categories found.</p>
                )}

                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  onInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }}
                  spaceBetween={30}
                  slidesPerView={3}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                >
                  {categories.map((category) => (
                    <SwiperSlide key={category.c_id}>
                      <div
                        className="banner-item image-zoom-effect"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div
                          className="image-holder position-relative"
                          title={`View ${category.c_name} Subcategories`}
                        >
                          <img
                            src={getImageUrl(category.c_image)}
                            alt={category.c_name}
                            className="img-fluid w-100"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.png";
                            }}
                          />
                        </div>
                        <div className="banner-content">
                          <h5 className="element-title item-anchor">
                            {category.c_name}
                          </h5>
                          <p className="limit-3-lines">{category.c_description}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Categories;
