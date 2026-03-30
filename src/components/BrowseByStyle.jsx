import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';

const BrowseByStyle = () => {
    const { products } = useContext(ShopContext);
    const navigate = useNavigate();

    // Store the active image index for each category block
    const [imageIndexes, setImageIndexes] = useState({
        Necklaces: 0,
        Earrings: 0,
        Rings: 0,
        Bracelets: 0
    });

    // Extract images for each target subCategory from the products array
    const getImagesForCategory = (categoryName) => {
        const matchingProducts = products.filter(p => p.subCategory === categoryName && p.image && p.image.length > 0);
        return matchingProducts.map(p => p.image[0]);
    };

    const necklacesImages = getImagesForCategory('Necklaces');
    const earringsImages = getImagesForCategory('Earrings'); // Replaced Jhumkas
    const ringsImages = getImagesForCategory('Rings');
    const braceletsImages = getImagesForCategory('Bracelets');

    // Auto-rotate images every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndexes(prev => ({
                Necklaces: necklacesImages.length ? (prev.Necklaces + 1) % necklacesImages.length : 0,
                Earrings: earringsImages.length ? (prev.Earrings + 1) % earringsImages.length : 0,
                Rings: ringsImages.length ? (prev.Rings + 1) % ringsImages.length : 0,
                Bracelets: braceletsImages.length ? (prev.Bracelets + 1) % braceletsImages.length : 0
            }));
        }, 4000);

        return () => clearInterval(interval);
    }, [necklacesImages.length, earringsImages.length, ringsImages.length, braceletsImages.length]);

    const handleCategoryClick = (categoryName) => {
        navigate('/collection', { state: { subCategory: categoryName } });
    };

    return (
        <div className='my-12 sm:my-24 px-4 sm:px-6'>
            <div className='flex flex-col items-center mb-10 sm:mb-16 px-4 text-center'>
                <div className='flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4'>
                    <span className='w-6 sm:w-12 h-[1px] bg-secondary/50'></span>
                    <p className='text-secondary font-outfit text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase'>Curated Selection</p>
                    <span className='w-6 sm:w-12 h-[1px] bg-secondary/50'></span>
                </div>
                <h2 className='font-outfit font-black text-2xl sm:text-4xl md:text-5xl lg:text-7xl text-white tracking-[0.1em] sm:tracking-widest uppercase mb-4 relative group'>
                    Browse By Style
                    <span className='absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-1 bg-secondary rounded-full gold-glow group-hover:w-48 transition-all duration-700 opacity-80'></span>
                </h2>
            </div>

            {/* Bento Grid Layout */}
            <div className='grid grid-cols-2 md:grid-cols-4 grid-rows-[auto] md:grid-rows-2 gap-3 sm:gap-4 max-w-6xl mx-auto'>

                {/* Large Feature Item (Necklaces) */}
                <div onClick={() => handleCategoryClick('Necklaces')} className='col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl bg-[#F0EEED] aspect-[4/3] md:aspect-auto min-h-[250px] md:min-h-[300px] cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300'>
                    {necklacesImages.length > 0 && (
                        <img
                            src={necklacesImages[imageIndexes.Necklaces]}
                            className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0'
                            alt="Necklaces"
                        />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:bg-black/20 transition-colors z-10 duration-300'></div>
                    <div className='absolute top-4 left-4 md:top-6 md:left-6 z-20'>
                        <h3 className='font-bold text-2xl md:text-3xl lg:text-4xl text-white capitalize drop-shadow-md'>Necklaces</h3>
                    </div>
                    <div className='absolute bottom-4 left-4 md:bottom-6 md:left-6 md:left-1/2 md:-translate-x-1/2 z-20 w-fit pointer-events-none'>
                        <span className='text-gray-900 font-semibold tracking-widest text-xs md:text-sm bg-white/95 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md transition-all'>View Collection</span>
                    </div>
                </div>

                {/* Medium Top Item (Earrings) */}
                <div onClick={() => handleCategoryClick('Earrings')} className='col-span-2 md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-2xl bg-[#F0EEED] min-h-[160px] md:min-h-[250px] aspect-[2/1] md:aspect-auto cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300'>
                    {earringsImages.length > 0 && (
                        <img
                            src={earringsImages[imageIndexes.Earrings]}
                            className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0'
                            alt="Earrings"
                        />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:bg-black/20 transition-colors z-10 duration-300'></div>
                    <div className='absolute top-3 left-4 md:top-6 md:left-6 z-20'>
                        <h3 className='font-bold text-xl md:text-3xl text-white capitalize drop-shadow-md'>Earrings</h3>
                    </div>
                    <div className='absolute bottom-3 right-4 md:bottom-4 md:right-4 z-20 w-fit pointer-events-none'>
                        <span className='text-gray-900 font-medium tracking-wide text-[10px] md:text-xs bg-white/95 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm'>Explore</span>
                    </div>
                </div>

                {/* Small Bottom Left Item (Rings) */}
                <div onClick={() => handleCategoryClick('Rings')} className='col-span-1 md:row-span-1 relative group overflow-hidden rounded-2xl bg-[#F0EEED] min-h-[150px] md:min-h-[250px] aspect-square md:aspect-auto cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300'>
                    {ringsImages.length > 0 && (
                        <img
                            src={ringsImages[imageIndexes.Rings]}
                            className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0'
                            alt="Rings"
                        />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:to-black/10 group-hover:bg-black/20 transition-colors z-10 duration-300'></div>
                    <div className='absolute bottom-3 left-3 md:top-6 md:left-6 md:bottom-auto z-20'>
                        <h3 className='font-bold text-lg md:text-2xl text-white capitalize drop-shadow-md'>Rings</h3>
                    </div>
                    <div className='hidden md:block absolute bottom-4 right-4 z-20 w-fit pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity'>
                        <span className='text-gray-900 font-medium tracking-wide text-xs bg-white/95 px-4 py-2 rounded-full'>Shop</span>
                    </div>
                </div>

                {/* Small Bottom Right Item (Bracelets) */}
                <div onClick={() => handleCategoryClick('Bracelets')} className='col-span-1 md:row-span-1 relative group overflow-hidden rounded-2xl bg-[#F0EEED] min-h-[150px] md:min-h-[250px] aspect-square md:aspect-auto cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300'>
                    {braceletsImages.length > 0 && (
                        <img
                            src={braceletsImages[imageIndexes.Bracelets]}
                            className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0'
                            alt="Bracelets"
                        />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:to-black/10 group-hover:bg-black/20 transition-colors z-10 duration-300'></div>
                    <div className='absolute bottom-3 left-3 md:top-6 md:left-6 md:bottom-auto z-20'>
                        <h3 className='font-bold text-lg md:text-2xl text-white capitalize drop-shadow-md'>Bracelets</h3>
                    </div>
                    <div className='hidden md:block absolute bottom-4 right-4 z-20 w-fit pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity'>
                        <span className='text-gray-900 font-medium tracking-wide text-xs bg-white/95 px-4 py-2 rounded-full'>Shop</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BrowseByStyle;
