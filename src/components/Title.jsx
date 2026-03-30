import React from 'react'

const Title = ({ text1, text2 }) => {
  return (
    <div className='flex flex-wrap gap-2 items-center mb-3 mt-4'>
      <p className='text-gray-400 font-outfit text-xl sm:text-2xl md:text-3xl tracking-widest uppercase break-words'>{text1}<span className='text-white font-black ml-2 sm:ml-3 shadow-none'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-accent hidden sm:block'></p>
    </div>
  )
}

export default Title