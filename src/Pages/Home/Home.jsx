import React from 'react'
import TrendingArticles from './TrendingArticles'
import Hero from './Hero'
import Statistic from './Statistic'
import AllPublisher from './AllPublisher'
import Plans from './Plans'
import Testimonials from './Testimonials';
import FAQ from './FAQ';

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <TrendingArticles></TrendingArticles>
      <AllPublisher></AllPublisher>
      <Statistic></Statistic>
      <Plans></Plans>
      <Testimonials />
      <FAQ />
    </div>
  )
}

export default Home