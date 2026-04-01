import React from 'react';
import Features from '../components/home/Features';
import Categories from '../components/home/Categories';
import NewArrivals from '../components/home/NewArrivals';
import Collection from '../components/home/Collection';
import Testimonials from '../components/home/Testimonials';
import BestSellers from '../components/home/BestSellers';
import Video from '../components/home/Video';
import HeroSection from '../components/home/HeroSection';

const Home = () => {
  return (
    <main>
      {/* <Billboard /> */}
      <HeroSection/>
      <Categories />
      <Features />
      <NewArrivals />
      {/* <Collection /> */}
      <Testimonials />
      <BestSellers />
      <Video />
      {/* <RelatedProducts /> */}
    </main>
  );
};

export default Home;
