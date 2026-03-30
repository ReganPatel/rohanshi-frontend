import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { toast } from 'react-toastify';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token, wishlist, toggleWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [isClicked, setIsClicked] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  const [isZoomed, setIsZoomed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Zoom logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.5)' // Zoom level
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  const [activeTab, setActiveTab] = useState('description');

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className='text-secondary text-sm'>★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className='text-secondary text-sm'>★</span>);
      } else {
        stars.push(<span key={i} className='text-white/20 text-sm'>★</span>);
      }
    }
    return stars;
  };

  const fetchProductData = async () => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }

  useEffect(() => {
    fetchProductData();
    // Scroll to top when product changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reset selections for new product
    setSize('');
    setColor('');
    setIsClicked(false);
  }, [productId, products])

  let currentStock = productData.stock;
  if (color && productData.colorStock && productData.colorStock[color] !== undefined) {
    currentStock = productData.colorStock[color];
  } else if (size && productData.sizeStock && productData.sizeStock[size] !== undefined) {
    currentStock = productData.sizeStock[size];
  }

  return productData ? (
    <div className='pt-6 sm:pt-12 transition-all duration-700 ease-out opacity-100 px-4 sm:px-[5vw]'>
      {/*-------------- Product Data ---------------*/}
      <div className='flex gap-8 lg:gap-12 flex-col lg:flex-row'>

        {/*-------------- Product Images --------------*/}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto no-scrollbar justify-start sm:justify-normal sm:w-[18.7%] w-full sm:max-h-[600px] gap-3 pb-2 sm:pb-0'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[22%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer aspect-square object-contain bg-white/5 rounded-xl p-1 border border-white/5 transition-all hover:bg-white/10' alt="" />
              ))
            }
          </div>
          <div
            className='w-full sm:w-[82%] relative group glass-card rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden gold-glow border border-white/10 flex items-center justify-center bg-black/20 backdrop-blur-sm h-[350px] sm:h-[500px] lg:h-[650px] cursor-zoom-in'
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setShowModal(true)}
          >
            <img
              className={`w-full h-full object-contain transform transition-transform duration-300 pointer-events-none select-none px-4 py-4 ${isZoomed ? 'scale-[2.5]' : ''}`}
              src={image}
              alt=""
              style={isZoomed ? zoomStyle : {}}
            />
            {/* Overlay hint */}
            {!isZoomed && (
              <div className='absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-secondary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                </svg>
                <span className='text-[10px] text-white font-outfit font-bold tracking-widest uppercase'>Click to Zoom</span>
              </div>
            )}

            {productData.image.length > 1 && !isZoomed && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = productData.image.indexOf(image);
                    const prevIndex = currentIndex === 0 ? productData.image.length - 1 : currentIndex - 1;
                    setImage(productData.image[prevIndex]);
                  }}
                  className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = productData.image.indexOf(image);
                    const nextIndex = currentIndex === productData.image.length - 1 ? 0 : currentIndex + 1;
                    setImage(productData.image[nextIndex]);
                  }}
                  className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/*-------------- Product Info --------------*/}
        <div className='flex-1 lg:pl-4'>
          <p className='text-[10px] sm:text-xs font-outfit uppercase tracking-[0.3em] text-secondary mb-3 sm:mb-4 font-bold'>The Excellence Collection</p>
          <h1 className='font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tighter uppercase mb-4 sm:mb-6 leading-tight'>{productData.name}</h1>

          <div className='flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 glass-card w-fit px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/5'>
            <div className='flex items-center gap-1'>
              {renderStars(Math.round(productData.rating || 0))}
            </div>
            <span className='w-[1px] h-3 sm:h-4 bg-white/10'></span>
            <p className='text-gray-400 text-[10px] sm:text-xs font-outfit tracking-widest uppercase'>({productData.numReviews || 0} REVIEWS)</p>
          </div>

          <div className='mb-6 sm:mb-8 flex items-end gap-4 sm:gap-6'>
            {productData.originalPrice > productData.price ? (
              <div className='flex flex-col gap-1'>
                <p className='text-[10px] sm:text-sm font-outfit text-gray-500 line-through tracking-widest uppercase'>WORTH ₹{productData.originalPrice}</p>
                <div className='flex items-center gap-3 sm:gap-4'>
                  <p className='text-3xl sm:text-5xl font-outfit gold-text font-bold uppercase tracking-tighter'>₹{productData.price}</p>
                  <span className='text-[8px] sm:text-[10px] bg-secondary/10 text-secondary px-2 sm:px-3 py-1 rounded-full font-outfit font-bold tracking-[0.2em] animate-pulse'>
                    {Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}% OFF
                  </span>
                </div>
              </div>
            ) : (
              <p className='text-3xl sm:text-5xl font-outfit gold-text font-bold uppercase tracking-tighter'>₹{productData.price}</p>
            )}
          </div>

          <p className='text-gray-400 text-base leading-relaxed font-sans tracking-wide max-w-xl mb-10 opacity-80'>{productData.description}</p>

          {productData.sizes && productData.sizes.length > 0 && (
            <div className='flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10'>
              <p className='font-outfit text-[10px] sm:text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2'>
                SELECT SIZE <span className='w-8 sm:w-12 h-[1px] bg-secondary'></span>
              </p>
              <div className='flex flex-wrap gap-2 sm:gap-3'>
                {productData.sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    className={`min-w-[60px] sm:min-w-[70px] py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-outfit font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 border ${item === size ? 'bg-secondary text-black border-secondary' : 'glass-card text-white border-white/10 hover:border-secondary/50'}`}
                    key={index}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {productData.colors && productData.colors.length > 0 && (
            <div className='flex flex-col gap-4 sm:gap-6 mb-10 sm:mb-12'>
              <p className='font-outfit text-[10px] sm:text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2'>
                SELECT COLOR <span className='w-8 sm:w-12 h-[1px] bg-secondary'></span>
              </p>
              <div className='flex flex-wrap gap-2 sm:gap-3'>
                {productData.colors.map((item, index) => (
                  <button
                    onClick={() => {
                      setColor(item);
                      if (productData.colorImage && productData.colorImage[item]) {
                        setImage(productData.colorImage[item]);
                      }
                    }}
                    className={`min-w-[80px] sm:min-w-[100px] py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-outfit font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 border ${item === color ? 'bg-secondary text-black border-secondary' : 'glass-card text-white border-white/10 hover:border-secondary/50'}`}
                    key={index}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='flex flex-col gap-6'>
            <div className='flex flex-wrap items-center gap-3 sm:gap-4'>
              <button
                onClick={() => {
                  if (productData.sizes.length > 0 && !size) {
                    toast.error('Please select a size');
                    return;
                  }
                  if (productData.colors && productData.colors.length > 0 && !color) {
                    toast.error('Please select a color');
                    return;
                  }

                  if (!isClicked) {
                    setIsClicked(true);
                    addToCart(productData._id, size, color);
                    setTimeout(() => {
                      setIsClicked(false);
                    }, 2000);
                  }
                }}
                disabled={currentStock <= 0}
                className={`flex-1 sm:flex-none sm:min-w-[280px] py-4 sm:py-6 px-8 sm:px-12 rounded-2xl sm:rounded-3xl font-outfit font-bold text-sm sm:text-base tracking-[0.2em] uppercase transition-all duration-500 shadow-2xl relative overflow-hidden group ${currentStock <= 0 ? 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-white text-black hover:bg-secondary hover:text-black border-none'}`}
              >
                {currentStock <= 0 ? (
                  'UNAVAILABLE'
                ) : (
                  <div className='flex items-center justify-center gap-3'>
                    <span className={`${isClicked ? 'opacity-0' : 'opacity-100'} transition-opacity`}>ADD TO CART</span>
                    {isClicked && (
                      <span className='absolute inset-0 flex items-center justify-center bg-secondary font-bold text-black animate-reveal'>ADDED TO CART</span>
                    )}
                  </div>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(productData._id)}
                className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card transition-all duration-300 border border-white/10 hover:border-secondary/50 hover:scale-105 active:scale-95 ${wishlist && wishlist.includes(productData._id) ? 'text-red-500 border-red-500/30' : 'text-white'}`}
                title="Wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={wishlist && wishlist.includes(productData._id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: productData.name,
                      text: `Discover ${productData.name} at Rohanshi’s Creation`,
                      url: window.location.href,
                    }).catch((error) => { });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard');
                  }
                }}
                className='p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card border border-white/10 hover:border-secondary/50 text-white transition-all duration-300 hover:scale-105 active:scale-95'
                title="Share Product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
              </button>
            </div>
            {currentStock > 0 && currentStock <= 5 && (
              <p className='text-red-400 text-[10px] sm:text-xs font-outfit font-bold tracking-widest uppercase animate-pulse mt-2'>ONLY {currentStock} LEFT</p>
            )}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12 mb-10 sm:mb-12'>
            <div className='p-4 sm:p-6 glass-card rounded-xl sm:rounded-2xl border border-white/5 flex items-center gap-3 sm:gap-4'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary'>
                <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
              </div>
              <p className='text-[8px] sm:text-[10px] font-outfit text-gray-400 tracking-widest uppercase'>100% Original</p>
            </div>
            <div className='p-4 sm:p-6 glass-card rounded-xl sm:rounded-2xl border border-white/5 flex items-center gap-3 sm:gap-4'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary'>
                <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' /></svg>
              </div>
              <p className='text-[8px] sm:text-[10px] font-outfit text-gray-400 tracking-widest uppercase'>Easy Payments</p>
            </div>
            <div className='p-4 sm:p-6 glass-card rounded-xl sm:rounded-2xl border border-white/5 flex items-center gap-3 sm:gap-4 group hover:border-secondary/50 transition-all'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform'>
                <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' /></svg>
              </div>
              <p className='text-[8px] sm:text-[10px] font-outfit text-gray-400 tracking-widest uppercase'>Assured delivery in 3-5 working days</p>
            </div>
          </div>
        </div>
      </div>

      {/*---------------- Description & Review Section ----------------*/}
      <div className='mt-20 sm:mt-32'>
        <div className='flex gap-1 sm:gap-2 mb-8 sm:mb-10'>
          <button onClick={() => setActiveTab('description')} className={`flex-1 sm:flex-none px-4 sm:px-10 py-4 sm:py-5 rounded-t-2xl sm:rounded-t-[2.5rem] font-outfit font-bold text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 ${activeTab === 'description' ? 'bg-white/10 text-white border-b-2 border-secondary' : 'text-gray-500 hover:text-white'}`}>DESCRIPTION</button>
          <button onClick={() => setActiveTab('reviews')} className={`flex-1 sm:flex-none px-4 sm:px-10 py-4 sm:py-5 rounded-t-2xl sm:rounded-t-[2.5rem] font-outfit font-bold text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 ${activeTab === 'reviews' ? 'bg-white/10 text-white border-b-2 border-secondary' : 'text-gray-500 hover:text-white'}`}>REVIEWS ({productData.numReviews || 0})</button>
        </div>

        <div className='glass-card rounded-[1.5rem] sm:rounded-[3rem] p-6 sm:p-12 border border-white/5 gold-glow'>
          {activeTab === 'description' ? (
            <div className='flex flex-col gap-6 sm:gap-8 max-w-4xl'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='w-8 sm:w-12 h-[1px] bg-secondary'></div>
                <p className='font-outfit text-[10px] sm:text-xs font-bold text-secondary tracking-widest uppercase'>Product Description</p>
              </div>
              <p className='text-gray-400 text-sm sm:text-lg leading-relaxed font-sans tracking-wide'>Rohanshi’s Creation brings you thoughtfully designed fashion accessories crafted to elevate your everyday style. Each piece is created with attention to detail, blending modern trends with timeless elegance to suit both casual and special occasions.</p>
              <p className='text-gray-400 text-sm sm:text-lg leading-relaxed font-sans tracking-wide'>Our products are lightweight, comfortable to wear, and made using quality materials to ensure durability and a refined finish. Whether you’re styling for daily wear, festive celebrations, or special moments, Rohanshi’s Creation offers versatile designs that complement every look.</p>
            </div>
          ) : (
            <div className='flex flex-col gap-8 sm:gap-10'>
              {productData.reviews && productData.reviews.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
                  {productData.reviews.map((review, index) => (
                    <div key={index} className='p-6 sm:p-8 glass-card rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5'>
                      <div className='flex items-center justify-between mb-4 sm:mb-6'>
                        <div className='flex flex-col gap-1'>
                          <span className='font-outfit font-bold text-white tracking-widest uppercase text-xs sm:text-sm'>{review.name}</span>
                          <span className='text-[8px] sm:text-[10px] text-gray-500 font-outfit tracking-widest'>{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <div className='flex gap-0.5 sm:gap-1'>
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className='text-gray-400 text-xs sm:text-sm font-sans tracking-wide leading-relaxed italic'>"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='py-8 sm:py-12 text-center flex flex-col items-center gap-4 sm:gap-6'>
                  <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-600'>
                    <svg className='w-8 h-8 sm:w-10 sm:h-10' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' /></svg>
                  </div>
                  <p className='text-gray-500 font-outfit tracking-widest uppercase text-[10px] sm:text-sm'>No reviews yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/*---------------- Display Related Products ----------------*/}
      <div className='mt-20 sm:mt-32 mb-10 sm:mb-20'>
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>

      {/*---------------- Full Screen Modal ----------------*/}
      {showModal && (
        <div
          className='fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fadeIn'
          onClick={() => setShowModal(false)}
        >
          <div className='absolute top-4 sm:top-8 right-4 sm:right-8 flex gap-4'>
            <button
              className='p-3 sm:p-4 rounded-full glass-card hover:bg-white/10 transition-colors gold-glow border border-white/10'
              onClick={() => setShowModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className='relative w-full max-w-5xl h-[80vh] flex items-center justify-center p-4' onClick={(e) => e.stopPropagation()}>
            {productData.image.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const currentIndex = productData.image.indexOf(image);
                    const prevIndex = currentIndex === 0 ? productData.image.length - 1 : currentIndex - 1;
                    setImage(productData.image[prevIndex]);
                  }}
                  className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-4 sm:p-6 rounded-full glass-card hover:bg-white/10 text-white transition-all z-10'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const currentIndex = productData.image.indexOf(image);
                    const nextIndex = currentIndex === productData.image.length - 1 ? 0 : currentIndex + 1;
                    setImage(productData.image[nextIndex]);
                  }}
                  className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-4 sm:p-6 rounded-full glass-card hover:bg-white/10 text-white transition-all z-10'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}
            <img
              className='max-w-full max-h-full object-contain rounded-2xl animate-reveal'
              src={image}
              alt="Product Zoomed"
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full p-4'>
              {productData.image.map((item, index) => (
                <img
                  key={index}
                  onClick={() => setImage(item)}
                  src={item}
                  className={`w-16 sm:w-20 h-16 sm:h-20 object-contain p-1.5 rounded-xl cursor-pointer transition-all border ${image === item ? 'border-secondary bg-secondary/10' : 'border-white/5 bg-white/5 opacity-50'}`}
                  alt=""
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div >
  ) : <div className='opacity-0'></div>
}

export default Product