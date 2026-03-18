import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/custom.css';
import '../../assets/hero-video.css';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/products'); 
  };

  return (
    <section className="hero-video-section">
      <div className="hero-video-container">
        {/* Video Background */}
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://www.pexels.com/download/video/35219294/"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay for better text visibility */}
        <div className="hero-video-overlay"></div>

        {/* Hero Content */}
        <div className="hero-video-content">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="hero-title" data-aos="fade-up">Fashion Frame</h1>
                <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">Upgrade your Style</p>
                <button 
                  className="hero-cta-btn"
                  onClick={handleShopNow}
                  aria-label="Shop Now"
                  data-aos="fade-up" 
                  data-aos-delay="400"
                >
                  SHOP NOW
                </button>
                <p className="hero-website" data-aos="fade-up" data-aos-delay="600">www.fashionframe.in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
// yash