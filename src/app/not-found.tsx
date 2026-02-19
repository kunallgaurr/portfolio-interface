import { MousePointer2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='h-screen w-full grid place-items-center'>
        <div className='flex flex-col'>
            <span className='text-[var(--font-color-faded)] font-semibold'>404: This route does not exist.</span>
            <span>Looks like you navigated to a branch that was never merged.</span>
            <span>Let’s head back to something production-ready.</span>
            <Link href='/' className='flex gap-2 items-center text-blue-600'><MousePointer2 size={16} />  Click here</Link>
        </div>
    </div>
  )
}

export default NotFound