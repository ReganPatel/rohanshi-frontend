import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Footer = () => {

    const { siteConfig } = useContext(ShopContext);

    return (
        <div className='mt-20 sm:mt-40'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-10 sm:gap-14 py-12 sm:py-16 px-6 sm:px-[5vw] glass-card rounded-[2rem] sm:rounded-[3rem] gold-glow mb-10 mx-2 sm:mx-4'>
                <div>
                    <img src={assets.logo} className='mb-6 sm:mb-8 w-32 sm:w-40' alt="" />
                    <p className='w-full md:w-4/5 text-gray-400 font-sans leading-relaxed sm:leading-loose text-sm'>
                        Rohanshi’s Creation is a high-end, dedicated jewelry brand crafting unique, premium designs with meticulous attention to detail. Every piece is a masterpiece, thoughtfully created to bring unmatched elegance and confidence into your style.
                    </p>
                </div>

                <div>
                    <p className='font-outfit text-lg sm:text-xl mb-6 sm:mb-8 gold-text tracking-[0.2em]'>COMPANY</p>
                    <ul className='flex flex-col gap-3 sm:gap-4 text-gray-400 font-outfit text-xs tracking-widest'>
                        <Link to='/' onClick={() => window.scrollTo(0, 0)} className='cursor-pointer hover:text-secondary transition-all py-1'>HOME</Link>
                        <Link to='/about' onClick={() => window.scrollTo(0, 0)} className='cursor-pointer hover:text-secondary transition-all py-1'>ABOUT US</Link>
                        <Link to='/contact' onClick={() => window.scrollTo(0, 0)} className='cursor-pointer hover:text-secondary transition-all py-1'>CONTACT US</Link>
                        <Link to='/privacy-policy' target='_blank' onClick={() => window.scrollTo(0, 0)} className='cursor-pointer hover:text-secondary transition-all py-1'>PRIVACY POLICY</Link>
                        <Link to='/terms-of-service' target='_blank' onClick={() => window.scrollTo(0, 0)} className='cursor-pointer hover:text-secondary transition-all py-1'>TERMS OF SERVICE</Link>
                    </ul>
                </div>

                <div>
                    <p className='font-outfit text-lg sm:text-xl mb-6 sm:mb-8 gold-text tracking-[0.2em]'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-3 sm:gap-4 text-gray-400 font-outfit text-xs tracking-widest'>
                        <li>
                            <a href={`tel:${siteConfig?.contactPhone || '+916355990921'}`} className='hover:text-secondary transition-all py-1 inline-block'>{siteConfig?.contactPhone || '+91-635-599-0921'}</a>
                        </li>
                        <li>
                            <a href={`mailto:${siteConfig?.contactEmail || 'rohanshicreation@gmail.com'}`} className='hover:text-secondary transition-all uppercase py-1 inline-block'>{siteConfig?.contactEmail || 'ROHANSHICREATION@GMAIL.COM'}</a>
                        </li>
                    </ul>
                    <div className='flex gap-6 mt-8'>
                        <a href={siteConfig?.facebookLink || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-secondary transition-all transform hover:scale-110'>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a href={siteConfig?.instagramLink || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-secondary transition-all transform hover:scale-110'>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>
                </div>

            </div>

            <div className='pb-10'>
                <hr className='border-white/10' />
                <p className='py-8 text-xs text-center text-gray-500 font-outfit tracking-[0.3em] uppercase'>Copyright 2025 @ rohanshicreation.com - All Right Reserved.</p>
            </div>

        </div>
    )
}

export default Footer