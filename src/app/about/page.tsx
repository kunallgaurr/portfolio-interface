import AboutContent from '@/components/about-content'
import ExperienceContent from '@/components/experience-content'
import React from 'react'

const About = () => {
  return (
    <div className='min-h-screen px-[10%] py-[5%] flex flex-col gap-20'>
        <AboutContent/>
        <ExperienceContent/>
    </div>
  )
}

export default About