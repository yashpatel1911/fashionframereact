import { useState } from 'react';

const Video = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section className="video-section py-5 my-4">
      <div className="container">
        <div className="row">
          <div className="col-12 position-relative">
            <div className="video-container position-relative overflow-hidden rounded-3 w-100" data-aos="fade-up">
              {!isPlaying && (
                <>
                  <div className="video-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"></div>
                  <img
                    src={require('../../assets/images/video-image.jpg')}
                    alt="Classic Collection"
                    className="img-fluid w-100"
                    style={{ height: '600px', objectFit: 'cover' }}
                  />
                  <div className="circular-text position-absolute top-50 start-50 translate-middle">
                    <svg viewBox="0 0 100 100" className="rotating-text" width="200" height="200">
                      <path id="circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                      <text>
                        <textPath href="#circle">
                          FASHION FRAME 2025 · FASHION FRAME 2025 ·
                        </textPath>
                      </text>
                    </svg>
                    <button
                      type="button"
                      className="btn-play position-absolute top-50 start-50 translate-middle bg-white rounded-circle border-0 shadow-sm"
                      onClick={handlePlayClick}
                      style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="ms-1">
                        <path d="M8 5v14l11-7z" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                </>
              )}

              {isPlaying && (
                <div className="ratio ratio-16x9">
                  <iframe
                    width="100%"
                    height="600"
                    src="https://www.youtube.com/embed/4RFjxDT2Vq4?autoplay=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Video;
