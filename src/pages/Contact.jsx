import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className='pt-20 px-4 sm:px-[5vw] transition-all duration-700 ease-out opacity-100 pb-24'>

      <div className='text-3xl font-outfit font-bold tracking-tighter mb-12 flex items-center justify-center gap-4 uppercase'>
        <span className='w-12 h-[2px] bg-secondary'></span>
        <Title text1={'CONTACT'} text2={'US'} />
        <span className='w-12 h-[2px] bg-secondary'></span>
      </div>

      <div className='my-10 flex flex-col items-center justify-center md:flex-row gap-16 mb-28'>
        <div className='w-full md:max-w-[480px] relative group'>
          <div className='absolute -inset-4 bg-secondary/20 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
          <img className='w-full rounded-[3rem] border border-white/10 glass-card relative z-10 shadow-2xl' src={assets.contact_img} alt="Contact Us" />
        </div>

        <div className='flex flex-col justify-center items-start gap-10 max-w-md'>
          <div className='glass-card p-10 rounded-[3rem] border border-white/5 gold-glow w-full'>
            <p className='font-outfit font-bold text-xl text-white tracking-widest uppercase mb-6 flex items-center gap-3'>
              <span className='w-6 h-[1px] bg-secondary'></span> Our Studio
            </p>
            <div className='space-y-4 text-gray-400 font-sans tracking-wide leading-relaxed'>
              <p>Segva,<br /> Valsad, Gujarat</p>
              <p className='flex flex-col gap-1'>
                <span className='text-secondary font-bold text-xs uppercase tracking-[0.2em]'>Phone No:</span>
                <span className='text-white'>+91 (6355) 990-921</span>
              </p>
              <p className='flex flex-col gap-1'>
                <span className='text-secondary font-bold text-xs uppercase tracking-[0.2em]'>Email:</span>
                <span className='text-white'>info@rohanshiscreation.com</span>
              </p>
              <p className='flex flex-col gap-1'>
                <span className='text-secondary font-bold text-xs uppercase tracking-[0.2em]'>Customer Care:</span>
                <span className='text-white'>care@rohanshiscreation.com</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact