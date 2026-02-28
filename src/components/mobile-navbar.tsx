import { Hamburger } from 'lucide-react'
import React from 'react'

const MobileNavbar = () => {
    return (
        <div className='bg-[var(--card-background)] w-full rounded-[10px] p-3 sm:flex flex-col text-sm hidden'>
            <div>
                
            </div>
            <div>
                <span>kunalgaur.in</span>
                <Hamburger/>
            </div>
        </div>
    )
}

export default MobileNavbar