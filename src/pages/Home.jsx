import React from 'react'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'
import WelcomeSection from '../components/WelcomeSection'
import ChefSection from '../components/ChefSection'
import CustomerReviews from '../components/CustomerReviews'


const Home = () => {
  return (
    <div className='pt-12'>
        <Hero />
        <FeaturedProducts/>
        <WelcomeSection/>
        <ChefSection/>
        <CustomerReviews/>

    </div>
  )
}

export default Home