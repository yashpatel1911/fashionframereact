import React from 'react';

const Instagram = () => {
  const instagramPosts = [
    {
      id: 1,
      image: require('../../assets/images/post-image1.jpg'),
      link: 'https://www.instagram.com/',
    },
    {
      id: 2,
      image: require('../../assets/images/post-image2.jpg'),
      link: 'https://www.instagram.com/',
    },
    {
      id: 3,
      image: require('../../assets/images/post-image3.jpg'),
      link: 'https://www.instagram.com/',
    },
    {
      id: 4,
      image: require('../../assets/images/post-image4.jpg'),
      link: 'https://www.instagram.com/',
    },
    {
      id: 5,
      image: require('../../assets/images/post-image5.jpg'),
      link: 'https://www.instagram.com/',
    }
  ];

  return (
    <section className="instagram position-relative">
      <div className="d-flex justify-content-center w-100 position-absolute bottom-0 z-1">
        <a href="https://www.instagram.com/" className="btn btn-dark px-5">Follow us on Instagram</a>
      </div>
      <div className="row g-0">
        {instagramPosts.map((post) => (
          <div key={post.id} className="col">
            <div className="image-holder">
              <a href={post.link}>
                <img src={post.image} alt="instagram" className="img-fluid" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Instagram;
