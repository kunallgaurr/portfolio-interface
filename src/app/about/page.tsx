import AboutContent from '@/components/about-content'
import ExperienceContent from '@/components/experience-content'
import React from 'react'

const About = () => {
  return (
    <div className='min-h-[calc(100svh-100px)] lg:px-[10%] px-[10px] py-[10%] flex flex-col gap-20'>
        <AboutContent/>
        <ExperienceContent/>
    </div>
  )
}

export default About