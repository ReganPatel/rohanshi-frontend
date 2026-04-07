import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const Hero = () => {
  const { siteConfig, navigate } = useContext(ShopContext)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = siteConfig === null
    ? [] // Still loading config
    : (siteConfig?.heroImages?.length > 0 
        ? siteConfig.heroImages 
        : [assets.hero_img]) // Default fallback

  useEffect(() => {
    if (heroImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 2000) // Change image every 2 seconds

    return () => clearInterval(timer)
  }, [heroImages.length])

  const nextImage = () => {
    if (heroImages.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    if (heroImages.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    )
  }

  const handleDotClick = (index) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className='flex flex-col lg:flex-row bg-background min-h-[80vh] sm:min-h-[90vh] relative overflow-hidden'>
      {/*Hero Left Side */}
      <div className='w-full lg:w-1/2 flex flex-col items-start justify-center px-6 sm:px-10 lg:pl-12 lg:pr-8 xl:pl-20 xl:pr-12 py-12 lg:py-0 z-20'>
        <div className='inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6 gold-glow'>
          <div className='w-2 h-2 rounded-full bg-secondary animate-pulse'></div>
          <p className='text-[10px] sm:text-xs font-outfit tracking-[0.2em] text-gray-300'>ESTABLISHED 2025</p>
        </div>

        <h1 className='font-outfit font-bold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] sm:leading-[0.9] text-white mb-6 sm:mb-8 tracking-tighter uppercase'>
          Crafting <span className='gold-text italic'>Eternal</span> <br /> Elegance
        </h1>

        <p className='text-gray-400 font-sans mb-8 sm:mb-10 max-w-lg text-xs sm:text-base leading-relaxed sm:leading-loose tracking-wide uppercase opacity-80'>
          Experience the pinnacle of luxury with our meticulously handcrafted jewelry, designed for those who command distinction in every detail.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 w-full lg:w-auto mb-12 sm:mb-16'>
          <button onClick={() => navigate('/collection')} className='premium-button w-full sm:w-auto shadow-[0_0_30px_rgba(242,204,13,0.2)]'>
            EXPLORE COLLECTION
          </button>
          <button onClick={() => navigate('/about')} className='px-10 py-3 rounded-full border border-white/20 font-outfit text-xs tracking-widest hover:bg-white/5 transition-all w-full sm:w-auto'>
            OUR STORY
          </button>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-2 sm:flex items-center gap-6 sm:gap-12 w-full lg:w-auto p-6 sm:p-8 glass-card rounded-[1.5rem] sm:rounded-[2rem] gold-glow'>
          <div className='flex flex-col'>
            <p className='font-outfit font-bold text-2xl sm:text-3xl gold-text'>200+</p>
            <p className='text-[9px] sm:text-[10px] tracking-[0.2em] text-gray-500 uppercase mt-1'>Exclusive Designs</p>
          </div>
          <div className='hidden sm:block h-10 w-[1px] bg-white/10'></div>
          <div className='flex flex-col'>
            <p className='font-outfit font-bold text-2xl sm:text-3xl gold-text'>25+</p>
            <p className='text-[9px] sm:text-[10px] tracking-[0.2em] text-gray-500 uppercase mt-1'>Master Artisans</p>
          </div>
          <div className='hidden sm:block h-10 w-[1px] bg-white/10'></div>
          <div className='flex flex-col col-span-2 sm:col-span-1 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5'>
            <p className='font-outfit font-bold text-2xl sm:text-3xl gold-text'>30K+</p>
            <p className='text-[9px] sm:text-[10px] tracking-[0.2em] text-gray-500 uppercase mt-1'>Happy Customers</p>
          </div>
        </div>
      </div>

      {/*Hero Right Side - Slider*/}
      <div className='relative w-full h-[60vh] lg:h-auto lg:w-1/2 overflow-hidden'>
        {heroImages.length === 0 ? (
          <div className='w-full h-full flex items-center justify-center bg-white/5 animate-pulse'>
            <div className='w-10 h-10 rounded-full border-2 border-secondary border-t-transparent animate-spin'></div>
          </div>
        ) : (
          <div
            className='flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.8,0,0.2,1)]'
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {heroImages.map((img, index) => (
              <div key={index} className='w-full h-full flex-shrink-0 relative'>
                <img
                  className='w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700'
                  src={img}
                  alt={`Hero Collection ${index + 1}`}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60'></div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {heroImages.length > 1 && (
          <>
            <div className='absolute bottom-10 right-10 flex gap-4 z-30'>
              <button
                onClick={prevImage}
                className='w-12 h-12 flex items-center justify-center glass-card rounded-full gold-text hover:bg-white/10 transition-all'
                aria-label="Previous image"
              >
                &#10094;
              </button>
              <button
                onClick={nextImage}
                className='w-12 h-12 flex items-center justify-center glass-card rounded-full gold-text hover:bg-white/10 transition-all'
                aria-label="Next image"
              >
                &#10095;
              </button>
            </div>

            {/* Pagination Line */}
            <div className='absolute bottom-12 left-10 right-32 h-[1px] bg-white/10 z-30 overflow-hidden hidden lg:block'>
              <div
                className='h-full bg-secondary transition-all duration-500 ease-in-out'
                style={{ width: `${((currentImageIndex + 1) / heroImages.length) * 100}%` }}
              ></div>
            </div>
          </>
        )}
      </div>

      {/* Background Decorative Element */}
      <div className='absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/5 blur-[120px] rounded-full pointer-events-none'></div>
      <div className='absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-secondary/5 blur-[100px] rounded-full pointer-events-none'></div>
    </div>
  )
}

export default Hero