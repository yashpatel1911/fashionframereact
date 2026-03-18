import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: "More than expected crazy soft, flexible and best fitted white simple denim shirt.",
      author: "CASUAL WAY",
    },
    {
      id: 2,
      quote: "Best fitted white denim shirt more than expected crazy soft, flexible",
      author: "STREET STYLE",
    },
    {
      id: 3,
      quote: "Flexible and comfortable, perfect for casual wear and daily use",
      author: "URBAN FASHION",
    },
  ];

  return (
    <section className="testimonials py-5 text-center">
      <div className="container">
        <h2 className="section-title text-uppercase mb-5 font-heading">We Love Good Compliment</h2>
        <div className="position-relative" data-aos="fade-up">
          <Swiper
            modules={[Navigation, Pagination]}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="testimonial-item">
                  <blockquote className="mb-4">
                    <p className="testimonial-quote font-body">"{testimonial.quote}"</p>
                  </blockquote>
                  <cite className="testimonial-author text-uppercase">{testimonial.author}</cite>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
