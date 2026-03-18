import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

const Billboard = () => {   
  return (
    <section id="billboard" className="billboard-section py-4 py-md-5">
      <div className="container-fluid px-4 px-lg-5">
        <div className="row">
          <div className="col-12">
            <div className="position-relative" data-aos="fade-up" data-aos-delay="300">
              <button className="slider-arrow slider-arrow-prev" aria-label="Previous slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="slider-arrow slider-arrow-next" aria-label="Next slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                  nextEl: '.slider-arrow-next',
                  prevEl: '.slider-arrow-prev',
                }}
                pagination={{
                  clickable: true,
                  el: '.swiper-pagination',
                  bulletClass: 'swiper-bullet',
                  bulletActiveClass: 'swiper-bullet-active',
                }}
                spaceBetween={24}
                slidesPerView={1}
                loop={true}
                grabCursor={true}
                breakpoints={{
                  576: {
                    slidesPerView: 1.5,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  1200: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
              >
                <SwiperSlide>
                  <div className="banner-item">
                    <div className="banner-image">
                      <img src={require('../../assets/images/banner-image-1.jpg')} alt="Soft Leather Jackets" className="img-fluid" />
                    </div>
                    <div className="banner-content">
                      <h3 className="banner-title">Soft Leather Jackets</h3>
                      <p className="banner-text">Scelerisque duis aliquam qui lorem ipsum dolor amet, consectetur adipiscing elit.</p>
                      <a href="#" className="banner-link">Discover Now</a>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="banner-item">
                    <div className="banner-image">
                      <img src={require('../../assets/images/banner-image-2.jpg')} alt="Soft Leather Jackets" className="img-fluid" />
                    </div>
                    <div className="banner-content">
                      <h3 className="banner-title">Soft Leather Jackets</h3>
                      <p className="banner-text">Scelerisque duis aliquam qui lorem ipsum dolor amet, consectetur adipiscing elit.</p>
                      <a href="#" className="banner-link">Discover Now</a>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="banner-item">
                    <div className="banner-image">
                      <img src={require('../../assets/images/banner-image-3.jpg')} alt="Soft Leather Jackets" className="img-fluid" />
                    </div>
                    <div className="banner-content">
                      <h3 className="banner-title">Soft Leather Jackets</h3>
                      <p className="banner-text">Scelerisque duis aliquam qui lorem ipsum dolor amet, consectetur adipiscing elit.</p>
                      <a href="#" className="banner-link">Discover Now</a>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Billboard;
