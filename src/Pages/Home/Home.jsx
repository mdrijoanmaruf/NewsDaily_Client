import React, { useEffect } from 'react'
import TrendingArticles from './TrendingArticles'
import Hero from './Hero'
import Statistic from './Statistic'
import AllPublisher from './AllPublisher'
import Plans from './Plans'
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import AOS from 'aos';
import 'aos/dist/aos.css';


const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 80,
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <div>
      <div data-aos="fade-up">
        <Hero />
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <TrendingArticles />
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <AllPublisher />
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <Statistic />
      </div>
      <div data-aos="zoom-in-up" data-aos-delay="400">
        <Plans />
      </div>
      <div data-aos="fade-up" data-aos-delay="500">
        <Testimonials />
      </div>
      <div data-aos="fade-up" data-aos-delay="600">
        <FAQ />
      </div>
    </div>
  );
}

export default Home