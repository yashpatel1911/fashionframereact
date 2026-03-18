import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

const RelatedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'DARK FLORISH ONEPIECE',
      price: 95.00,
      image: require('../../assets/images/product-item-1.jpg'),
    },
    {
      id: 2,
      name: 'BAGGY SHIRT',
      price: 55.00,
      image: require('../../assets/images/product-item-2.jpg'),
    },
    {
      id: 3,
      name: 'COTTON OFF-WHITE SHIRT',
      price: 65.00,
      image: require('../../assets/images/product-item-3.jpg'),
    },
    {
      id: 4,
      name: 'CROP SWEATER',
      price: 75.00,
      image: require('../../assets/images/product-item-4.jpg'),
    },
  ];

  return (
    <section className="new-arrivals py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">You May Also Like</h2>
          <a href="/shop" className="text-uppercase text-decoration-none view-all">VIEW ALL PRODUCTS</a>
        </div>
        <div className="position-relative" data-aos="fade-up">
          <div className="icon-arrow icon-arrow-left">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="icon-arrow icon-arrow-right">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.icon-arrow-right',
              prevEl: '.icon-arrow-left',
            }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 4,
              },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-item">
                  <div className="image-holder mb-3 position-relative">
                    <a href="/">
                      <img src={product.image} alt={product.name} className="img-fluid" />
                    </a>
                    {/* <button type="button" className="btn-wishlist position-absolute">
                      <FontAwesomeIcon icon={faHeart} />
                    </button> */}
                  </div>
                  <div className="product-content">
                    <h3 className="product-title mb-1">
                      <a href="/" className="text-uppercase text-decoration-none">{product.name}</a>
                    </h3>
                    <div className="price mb-2">
                      <span className="amount">${product.price.toFixed(2)}</span>
                    </div>
                    <button type="button" className="btn btn-dark text-uppercase w-100 font-heading">Add to cart</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="icon-arrow icon-arrow-left">
            <svg width="50" height="50" viewBox="0 0 24 24">
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </div>
          <div className="icon-arrow icon-arrow-right">
            <svg width="50" height="50" viewBox="0 0 24 24">
              <use xlinkHref="#arrow-right"></use>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
