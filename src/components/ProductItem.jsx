import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';


const ProductItem = ({ id, image, name, price, originalPrice, stock, rating, numReviews }) => {

  const { currency, wishlist, toggleWishlist } = useContext(ShopContext);

  const isWishlisted = wishlist && wishlist.includes(id);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className='text-secondary text-sm'>★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Can't do half-star perfectly with just character codes without CSS, 
        // but normally a separate icon or full star for ease works.
        stars.push(<span key={i} className='text-secondary text-sm'>★</span>);
      } else {
        stars.push(<span key={i} className='text-white/20 text-sm'>★</span>); // Dull star empty
      }
    }
    return stars;
  };

  return (
    <Link className={`cursor-pointer group flex flex-col items-start w-full relative ${stock <= 0 ? 'opacity-80' : ''}`} to={`/product/${id}`}>
      <div className='overflow-hidden w-full aspect-[4/5] bg-white/5 flex items-center justify-center rounded-[2rem] relative border border-white/5 group-hover:border-secondary/30 transition-all duration-500'>
        <img className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]' src={image[0]} alt={name} />
        {/* Soft overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(id);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full glass-card hover:bg-white transition-all duration-300 z-10 hover:scale-110 active:scale-95 ${isWishlisted ? 'text-red-500' : 'text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Out of stock badge */}
        {stock <= 0 && (
          <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center'>
            <span className='bg-red-600 text-white font-bold px-4 py-2 rounded-full tracking-wider shadow-md transform -rotate-12'>OUT OF STOCK</span>
          </div>
        )}
      </div>
      <div className='w-full flex flex-col items-start mt-6 px-1'>
        <p className='text-xs font-outfit uppercase tracking-[0.2em] text-gray-500 mb-2'>Fine Jewelry</p>
        <p className='text-lg font-outfit font-medium text-white group-hover:gold-text transition-colors duration-300 truncate w-full'>{name}</p>
        <div className='flex items-center gap-2 mt-2 mb-3'>
          <div className='flex items-center'>
            {renderStars(rating)}
          </div>
          <span className='text-gray-500 text-[10px] font-outfit tracking-widest'>({numReviews || 0} REVIEWS)</span>
        </div>
        <div className='flex items-center gap-3'>
          {originalPrice > price ? (
            <>
              <p className='text-lg font-outfit gold-text font-bold uppercase'>₹{price}</p>
              <p className='text-sm font-outfit text-gray-500 line-through decoration-1 tracking-wider uppercase'>₹{originalPrice}</p>
              <span className='text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-outfit tracking-widest ml-2'>
                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
              </span>
            </>
          ) : (
            <p className='text-lg font-outfit gold-text font-bold uppercase'>₹{price}</p>
          )}
        </div>
        <p className='text-[10px] sm:text-[11px] font-outfit text-secondary tracking-[0.2em] uppercase mt-3 animate-pulse'>Assured delivery in 3-5 working days</p>
      </div>
    </Link>
  )
}

export default ProductItem