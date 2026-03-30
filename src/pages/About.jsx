import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className='pt-20 px-4 sm:px-[5vw] transition-all duration-700 ease-out opacity-100 pb-24'>

      <div className='text-3xl font-outfit font-bold tracking-tighter mb-12 flex items-center justify-center gap-4 uppercase'>
        <span className='w-12 h-[2px] bg-secondary'></span>
        <Title text1={'ABOUT'} text2={'US'} />
        <span className='w-12 h-[2px] bg-secondary'></span>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
        <div className='w-full md:max-w-[450px] relative group'>
          <div className='absolute -inset-4 bg-secondary/20 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
          <img className='w-full rounded-[3rem] border border-white/10 glass-card relative z-10' src={assets.about_img} alt="About Rohanshi's Creation" />
        </div>

        <div className='flex flex-col justify-center gap-8 md:w-2/4'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-[1px] bg-secondary'></div>
            <p className='font-outfit text-xs font-bold text-secondary tracking-widest uppercase'>The Vision</p>
          </div>

          <div className='flex flex-col gap-6 text-gray-400 text-lg leading-relaxed font-sans tracking-wide opacity-80'>
            <p>Rohanshi’s Creation was born from a passion for creativity, elegance, and self-expression. We believe that the right accessory has the power to transform not just an outfit, but the confidence of the person wearing it.</p>
            <p>Our journey began with a simple vision — to offer thoughtfully designed fashion accessories that blend modern trends with timeless charm. From delicate jewelry and stylish hair accessories to everyday essentials and festive favorites, every piece in our collection is carefully curated to suit different moods, styles, and occasions.</p>
            <p>At Rohanshi’s Creation, quality and comfort are at the heart of everything we do. We focus on lightweight designs, fine detailing, and reliable materials to ensure our products are both beautiful and easy to wear.</p>
          </div>

          <div className='p-10 glass-card rounded-[2.5rem] border border-white/5 gold-glow mt-4'>
            <p className='font-outfit text-white font-bold tracking-widest uppercase mb-4'>Our Mission</p>
            <p className='text-gray-400 leading-relaxed italic opacity-90 font-sans'>
              "To celebrate individuality through thoughtfully designed fashion accessories. We aim to empower every customer with confidence, style, and comfort by offering beautifully crafted pieces that are easy to wear and effortless to style."
            </p>
          </div>
        </div>
      </div>

      <div className='mt-32 mb-16 text-center'>
        <Title text1={'WHY'} text2={'CHOOSE US?'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
        <div className='p-10 glass-card rounded-[3rem] border border-white/5 flex flex-col gap-6 hover:border-secondary/30 transition-all group scale-hover'>
          <div className='w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-black transition-all duration-500'>
            <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
          </div>
          <p className='font-outfit font-bold text-white tracking-widest uppercase'>Quality Assurance</p>
          <p className='text-gray-500 leading-relaxed font-sans text-sm'>All our products are made with the highest quality materials and undergo rigorous testing to ensure durability and safety.</p>
        </div>

        <div className='p-10 glass-card rounded-[3rem] border border-white/5 flex flex-col gap-6 hover:border-secondary/30 transition-all group scale-hover'>
          <div className='w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-black transition-all duration-500'>
            <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' /></svg>
          </div>
          <p className='font-outfit font-bold text-white tracking-widest uppercase'>Convenience</p>
          <p className='text-gray-500 leading-relaxed font-sans text-sm'>Our online platform makes shopping easy and accessible, with a seamless user experience and fast delivery options.</p>
        </div>

        <div className='p-10 glass-card rounded-[3rem] border border-white/5 flex flex-col gap-6 hover:border-secondary/30 transition-all group scale-hover'>
          <div className='w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-black transition-all duration-500'>
            <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' /></svg>
          </div>
          <p className='font-outfit font-bold text-white tracking-widest uppercase'>Customer Care</p>
          <p className='text-gray-500 leading-relaxed font-sans text-sm'>We provide excellent customer service, including easy returns, responsive support, and a hassle-free shopping experience.</p>
        </div>
      </div>

      <NewsletterBox />

    </div>
  )
}

export default About