import React from 'react'
import TrendingArticles from './TrendingArticles'
import Hero from './Hero'
import Statistic from './Statistic'

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <TrendingArticles></TrendingArticles>
      <Statistic></Statistic>
    </div>
  )
}

export default Home