import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import '../../assets/css/testimonials.css';

const testimonials = [
  {
    id: 1,
    quote: "More than expected — crazy soft, flexible and best fitted. The quality surpassed everything I anticipated.",
    author: "Priya S.",
    label: "Casual Wear",
    rating: 5,
  },
  {
    id: 2,
    quote: "Best fitted white denim shirt more than expected. Crazy soft, flexible, and the stitching is impeccable.",
    author: "Meera R.",
    label: "Street Style",
    rating: 5,
  },
  {
    id: 3,
    quote: "Flexible and comfortable, perfect for both casual outings and daily wear. Absolutely love the fabric.",
    author: "Ananya K.",
    label: "Urban Fashion",
    rating: 5,
  },
  {
    id: 4,
    quote: "Elegant drape, beautiful print, and delivered ahead of time. This is my go-to store from now on.",
    author: "Sonal M.",
    label: "Festive Collection",
    rating: 5,
  },
  {
    id: 5,
    quote: "The saree was exactly as described — vibrant colour, smooth texture, and the packaging was stunning.",
    author: "Kavita D.",
    label: "Saree Collection",
    rating: 5,
  },
];

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 0L7.35 4.15H11.7L8.18 6.71L9.53 10.86L6 8.3L2.47 10.86L3.82 6.71L0.3 4.15H4.65L6 0Z"/>
  </svg>
);

const QuoteIcon = () => (
  <svg width="28" height="20" viewBox="0 0 32 24" fill="currentColor">
    <path d="M0 24V15C0 10.6 1.4 6.9 4.2 3.9C7 1.3 10.7 0 15.3 0V4C12.7 4 10.6 4.8 9 6.4C7.4 8 6.6 10 6.6 12.4H12V24H0ZM18 24V15C18 10.6 19.4 6.9 22.2 3.9C25 1.3 28.7 0 33.3 0V4C30.7 4 28.6 4.8 27 6.4C25.4 8 24.6 10 24.6 12.4H30V24H18Z"/>
  </svg>
);

const SLIDES_PER_VIEW = 3;

const Testimonials = () => {
  // Active index = the middle card of the 3 visible
  const [activeIdx, setActiveIdx] = useState(1); // start: index 1 is the middle of [0,1,2]
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const handleSlideChange = (swiper) => {
    // realIndex = left-most visible slide; middle = realIndex + 1
    const middle = (swiper.realIndex + 1) % testimonials.length;
    setActiveIdx(middle);
  };

  return (
    <section className="tst-section">
      <div className="tst-container">

        {/* Header */}
        <div className="tst-header">
          <div className="tst-eyebrow">
            <span className="tst-eyebrow-line" />
            Testimonials
            <span className="tst-eyebrow-line" />
          </div>
          <h2 className="tst-title">We Love Good Compliments</h2>
          <p className="tst-subtitle">What our customers are saying</p>
        </div>

        {/* Slider */}
        <div className="tst-slider-wrap">

          <button ref={prevRef} className="tst-arrow tst-arrow--prev" aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button ref={nextRef} className="tst-arrow tst-arrow--next" aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            onSlideChange={handleSlideChange}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={true}
            centeredSlides={false}
            slidesPerView={3}
            spaceBetween={24}
            breakpoints={{
              0:    { slidesPerView: 1, spaceBetween: 14 },
              600:  { slidesPerView: 2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="tst-swiper"
          >
            {testimonials.map((t, idx) => {
              const isActive = idx === activeIdx;
              return (
                <SwiperSlide key={t.id}>
                  <div className={`tst-card${isActive ? ' tst-card--active' : ''}`}>

                    {/* Avatar on top edge */}
                    <div className="tst-avatar-wrap">
                      <div className={`tst-avatar${isActive ? ' tst-avatar--active' : ''}`}>
                        {t.author.charAt(0)}
                      </div>
                    </div>

                    {/* Quote icon */}
                    <div className="tst-quote-icon">
                      <QuoteIcon />
                    </div>

                    {/* Stars */}
                    <div className="tst-stars">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="tst-quote">"{t.quote}"</p>

                    {/* Divider */}
                    <div className="tst-divider">
                      <span className="tst-divider-line" />
                      <span className="tst-divider-diamond" />
                      <span className="tst-divider-line" />
                    </div>

                    {/* Author */}
                    <div className="tst-author-name">{t.author}</div>
                    <div className="tst-author-label">{t.label}</div>

                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Dots — one per testimonial */}
          <div className="tst-dots">
            {testimonials.map((_, i) => (
              <span key={i} className={`tst-dot${i === activeIdx ? ' tst-dot--active' : ''}`} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;