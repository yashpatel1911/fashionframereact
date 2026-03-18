import React from 'react';
import 'aos/dist/aos.css';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Ultimate Guide to Styling Your Summer Wardrobe',
      date: 'May 29, 2025',
      category: 'Fashion',
      image: require('../../assets/images/post-image1.jpg'),
      excerpt: 'Discover the latest trends and essential pieces for your summer collection.',
    },
    {
      id: 2,
      title: 'Sustainable Fashion: Making Ethical Choices',
      date: 'May 28, 2025',
      category: 'Lifestyle',
      image: require('../../assets/images/post-image2.jpg'),
      excerpt: 'Learn how to build a sustainable wardrobe without compromising on style.',
    },
    {
      id: 3,
      title: 'Accessorizing Like a Pro: Tips and Tricks',
      date: 'May 27, 2025',
      category: 'Style',
      image: require('../../assets/images/post-image3.jpg'),
      excerpt: 'Master the art of accessorizing with our comprehensive guide.',
    }
  ];

  return (
    <section className="blog py-5">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
          <h4 className="text-uppercase">Latest Posts</h4>
          <a href="#" className="btn-link">View All Posts</a>
        </div>
        <div className="row">
          {blogPosts.map((post) => (
            <div key={post.id} className="col-md-4" data-aos="fade-up" data-aos-delay={post.id * 100}>
              <div className="post-item">
                <div className="post-image">
                  <a href="#">
                    <img src={post.image} alt={post.title} className="img-fluid" />
                  </a>
                </div>
                <div className="post-content d-flex flex-wrap">
                  <div className="post-meta">
                    <span className="post-date text-uppercase">{post.date}</span>
                    <span className="post-category text-uppercase">{post.category}</span>
                  </div>
                  <h5 className="post-title text-uppercase w-100">
                    <a href="#">{post.title}</a>
                  </h5>
                  <p className="post-description">{post.excerpt}</p>
                  <a href="#" className="btn-link text-uppercase">Read More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
