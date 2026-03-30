import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
    return (
        <div className='flex flex-col md:flex-row justify-between gap-8 py-24 px-4 sm:px-[5vw]'>
            <div className='flex-1 p-10 glass-card rounded-[2.5rem] gold-glow text-center group hover:-translate-y-2 transition-all duration-500'>
                <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center m-auto mb-8 border border-white/10 group-hover:border-secondary/50 transition-colors'>
                    <img src={assets.exchange_icon} className='w-8 invert opacity-80' alt="" />
                </div>
                <p className='font-outfit font-bold text-lg text-white mb-3 tracking-tighter uppercase'>Seamless Exchange</p>
                <p className='text-gray-500 text-xs font-sans tracking-widest leading-relaxed'>Experience perfection with our tailored, hassle-free exchange service.</p>
            </div>

            <div className='flex-1 p-10 glass-card rounded-[2.5rem] gold-glow text-center group hover:-translate-y-2 transition-all duration-500'>
                <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center m-auto mb-8 border border-white/10 group-hover:border-secondary/50 transition-colors'>
                    <img src={assets.quality_icon} className='w-8 invert opacity-80' alt="" />
                </div>
                <p className='font-outfit font-bold text-lg text-white mb-3 tracking-tighter uppercase'>Assured Purity</p>
                <p className='text-gray-500 text-xs font-sans tracking-widest leading-relaxed'>Curated excellence guaranteed with our 7-day uncompromising return policy.</p>
            </div>

            <div className='flex-1 p-10 glass-card rounded-[2.5rem] gold-glow text-center group hover:-translate-y-2 transition-all duration-500'>
                <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center m-auto mb-8 border border-white/10 group-hover:border-secondary/50 transition-colors'>
                    <img src={assets.support_img} className='w-8 invert opacity-80' alt="" />
                </div>
                <p className='font-outfit font-bold text-lg text-white mb-3 tracking-tighter uppercase'>Support</p>
                <p className='text-gray-500 text-xs font-sans tracking-widest leading-relaxed'>Dedicated assistance around the clock for your bespoke inquiries.</p>
            </div>
        </div>
    )
}

export default OurPolicy