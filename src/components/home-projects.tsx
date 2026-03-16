import React from 'react'
import FeatureProjectCard from './feature-project-card'
import HomePostsSidebar from './home-posts'

const HomeProjects = () => {
  return (
    <div className='relative min-h-[90svh] px-4 sm:px-6 lg:px-[10%] pt-4 pb-20 lg:py-[5%] grid lg:grid-cols-[1fr_300px] gap-8 overflow-hidden'>
        <FeatureProjectCard />
        <HomePostsSidebar />
    </div>
  )
}

export default HomeProjects