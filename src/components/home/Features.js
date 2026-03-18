import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faStore, faGift, faSync } from '@fortawesome/free-solid-svg-icons';

const Features = () => {
  const featureData = [
    {
      icon: faCalendar,
      title: "Book An Appointment",
      description: "At imperdiet dui accumsan sit amet nulla risus est ultricies quis.",
    },
    {
      icon: faStore,
      title: "Pick Up In Store",
      description: "At imperdiet dui accumsan sit amet nulla risus est ultricies quis.",
    },
    {
      icon: faGift,
      title: "Special Packaging",
      description: "At imperdiet dui accumsan sit amet nulla risus est ultricies quis.",
    },
    {
      icon: faSync,
      title: "Free Global Returns",
      description: "At imperdiet dui accumsan sit amet nulla risus est ultricies quis.",
    },
  ];

  return (
    <section className="features py-5">
      <div className="container">
        <div className="row g-4">
          {featureData.map((feature, index) => (
            <div className="col-lg-3 col-6" data-aos="fade-up" data-aos-delay={index * 200} key={index}>
              <div className="feature-item text-center">
                <div className="feature-icon mb-3">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title h5 mb-2 font-heading">{feature.title}</h3>
                  <p className="text-muted mb-0 font-body">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
