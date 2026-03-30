import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useLocation } from 'react-router-dom';

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext);
  const location = useLocation();
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [ratingFilter, setRatingFilter] = useState('');
  const [discountFilter, setDiscountFilter] = useState('');
  const [sortType, setSortType] = useState('relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Read subCategory from router state if navigating from home page Browse By Style
  useEffect(() => {
    if (location.state && location.state.subCategory) {
      setSubCategory([location.state.subCategory]);
    }
  }, [location.state]);

  const hairAccessoryTypes = [
    'Barrettes', 'Bows', 'Hair Combs', 'Hair Clips',
    'Hair Pins', 'Hair Ties', 'Ponytail Holders', 'Scrunchies', 'Headbands'
  ];

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => {
        // If "Hair accessories" is selected, match any of its subcategories
        if (subCategory.includes("Hair accessories") && hairAccessoryTypes.includes(item.subCategory)) {
          return true;
        }
        return subCategory.includes(item.subCategory);
      });
    }

    if (ratingFilter) {
      productsCopy = productsCopy.filter(item => item.rating >= Number(ratingFilter));
    }

    if (discountFilter) {
      productsCopy = productsCopy.filter(item => {
        if (!item.originalPrice || item.originalPrice <= item.price) return false;
        const discountPercentage = ((item.originalPrice - item.price) / item.originalPrice) * 100;
        return discountPercentage <= Number(discountFilter);
      });
    }

    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)))
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)))
        break;

      case 'popularity':
        setFilterProducts(fpCopy.sort((a, b) => (b.rating - a.rating)))
        break;

      default:
        applyFilter();
        break;
    }
  }

  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { label: 'Relevant', value: 'relevant' },
    { label: 'Popularity', value: 'popularity' },
    { label: 'Price: Low to High', value: 'low-high' },
    { label: 'Price: High to Low', value: 'high-low' },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortType)?.label || 'Relevant';

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, ratingFilter, discountFilter])

  useEffect(() => {
    sortProduct();
  }, [sortType])

  useEffect(() => {
    setCurrentPage(1);
  }, [category, subCategory, search, showSearch, ratingFilter, discountFilter, sortType]);

  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);
  const currentProducts = filterProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Clear subCategory selections when categories change and those subCats are no longer available
  useEffect(() => {
    if (products.length === 0) return;

    let relevantProducts = products;
    if (category.length > 0) {
      relevantProducts = products.filter(p => category.includes(p.category));
    }

    const subsInStock = new Set();
    relevantProducts.forEach(p => {
      if (hairAccessoryTypes.includes(p.subCategory)) {
        subsInStock.add("Hair accessories");
      } else {
        subsInStock.add(p.subCategory);
      }
    });

    setSubCategory(prev => prev.filter(s => subsInStock.has(s)));
  }, [category, products])

  return (
    <div className='flex flex-col sm:flex-row gap-4 sm:gap-10 pt-6 sm:pt-10 border-t border-white/5'>

      {/* Filter Options */}
      <div className='w-full sm:w-64 md:w-72 shrink-0'>
        <div
          onClick={() => setShowFilter(!showFilter)}
          className='glass-card p-4 rounded-xl sm:rounded-2xl border border-white/5 mb-4 flex items-center justify-between cursor-pointer group hover:border-secondary/30 transition-all duration-500 sm:hidden'
        >
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center'>
              <img className='h-3.5 opacity-70 group-hover:scale-110 transition-transform invert' src={assets.dropdown_icon} alt="" />
            </div>
            <p className='text-xs font-black tracking-[0.2em] text-white/80'>FILTERS</p>
          </div>
          <span className='px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-white/40'>
            {showFilter ? 'CLOSE' : 'OPEN'}
          </span>
        </div>

        <p className='hidden sm:flex items-center gap-3 mb-8 px-2'>
          <span className='w-1 h-8 bg-secondary rounded-full shadow-[0_0_15px_rgba(242,204,13,0.5)]'></span>
          <span className='text-lg sm:text-xl font-black tracking-[0.2em] text-white uppercase'>Filter By</span>
        </p>

        <div className={`${showFilter ? 'flex' : 'hidden'} sm:flex flex-col gap-4 sm:gap-6 animate-in fade-in slide-in-from-left-4 duration-500`}>

          {/* Category Filter */}
          <div className='glass-card p-4 sm:p-5 rounded-2xl sm:rounded-[1.5rem] border border-white/5 shadow-2xl relative overflow-hidden group'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-2xl -mr-12 -mt-12 group-hover:bg-secondary/10 transition-colors duration-700'></div>
            <p className='mb-4 sm:mb-6 text-[10px] font-black tracking-[0.2em] text-white/50 border-b border-white/5 pb-3'>CATEGORIES</p>
            <div className='flex flex-col gap-4'>
              {['Men', 'Women', 'Kids'].map((cat) => (
                <label key={cat} className='flex items-center gap-4 cursor-pointer group/item'>
                  <div className='relative flex items-center justify-center'>
                    <input
                      type="checkbox"
                      value={cat}
                      onChange={toggleCategory}
                      checked={category.includes(cat)}
                      className='peer appearance-none w-5 h-5 rounded-md border border-white/10 bg-white/5 checked:bg-secondary checked:border-secondary transition-all duration-300'
                    />
                    <svg className='absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className='text-sm font-medium text-white/60 group-hover/item:text-secondary transition-colors'>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SubCategory Filter */}
          <div className='glass-card p-4 sm:p-5 rounded-2xl sm:rounded-[1.5rem] border border-white/5 shadow-2xl relative overflow-hidden group'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-2xl -mr-12 -mt-12 group-hover:bg-secondary/10 transition-colors duration-700'></div>
            <p className='mb-4 sm:mb-6 text-[10px] font-black tracking-[0.2em] text-white/50 border-b border-white/5 pb-3'>PRODUCT TYPE</p>
            <div className='flex flex-col gap-3 sm:gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar'>
              {
                (() => {
                  const baseSubCategories = ['Anklets', 'Hair accessories', 'Bracelets', 'Brooches', 'Bangles', 'Earrings', 'Necklaces', 'Nose Rings', 'Rings', 'Toe Rings'];

                  let relevantProducts = products;
                  if (category.length > 0) {
                    relevantProducts = products.filter(p => category.includes(p.category));
                  }

                  const subsInStock = new Set();
                  relevantProducts.forEach(p => {
                    if (hairAccessoryTypes.includes(p.subCategory)) {
                      subsInStock.add("Hair accessories");
                    } else {
                      subsInStock.add(p.subCategory);
                    }
                  });

                  const availableSubCategories = baseSubCategories;

                  return availableSubCategories.map((item, index) => (
                    <label key={index} className='flex items-center gap-4 cursor-pointer group/item'>
                      <div className='relative flex items-center justify-center'>
                        <input
                          type="checkbox"
                          value={item}
                          onChange={toggleSubCategory}
                          checked={subCategory.includes(item)}
                          className='peer appearance-none w-5 h-5 rounded-md border border-white/10 bg-white/5 checked:bg-secondary checked:border-secondary transition-all duration-300'
                        />
                        <svg className='absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className='text-sm font-medium text-white/60 group-hover/item:text-secondary transition-colors'>{item}</span>
                    </label>
                  ))
                })()
              }
            </div>
          </div>

          {/* Rating Filter */}
          <div className='glass-card p-4 sm:p-5 rounded-2xl sm:rounded-[1.5rem] border border-white/5 shadow-2xl relative overflow-hidden group'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-2xl -mr-12 -mt-12 group-hover:bg-secondary/10 transition-colors duration-700'></div>
            <p className='mb-6 text-xs font-black tracking-[0.2em] text-white/50 border-b border-white/5 pb-3'>RATING</p>
            <div className='flex flex-col gap-4'>
              {[
                { label: '4★ & above', value: '4' },
                { label: '3★ & above', value: '3' },
                { label: '2★ & above', value: '2' },
                { label: '1★ & above', value: '1' },
                { label: 'Any Rating', value: '' }
              ].map((r) => (
                <label key={r.value} className='flex items-center gap-4 cursor-pointer group/item'>
                  <div className='relative flex items-center justify-center'>
                    <input
                      type="radio"
                      name="rating"
                      value={r.value}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      checked={ratingFilter === r.value}
                      className='peer appearance-none w-5 h-5 rounded-full border border-white/10 bg-white/5 checked:bg-secondary checked:border-secondary transition-all duration-300'
                    />
                    <div className='absolute w-2 h-2 rounded-full bg-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none'></div>
                  </div>
                  <span className='text-sm font-medium text-white/60 group-hover/item:text-secondary transition-colors'>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount Filter */}
          <div className='glass-card p-4 sm:p-5 rounded-2xl sm:rounded-[1.5rem] border border-white/5 shadow-2xl relative overflow-hidden group'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-2xl -mr-12 -mt-12 group-hover:bg-secondary/10 transition-colors duration-700'></div>
            <p className='mb-6 text-xs font-black tracking-[0.2em] text-white/50 border-b border-white/5 pb-3'>DISCOUNT</p>
            <div className='flex flex-col gap-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
              {[
                { label: 'Any Discount', value: '' },
                { label: 'Up to 25%', value: '25' },
                { label: 'Up to 50%', value: '50' },
                { label: 'Up to 75%', value: '75' }
              ].map((d) => (
                <label key={d.value} className='flex items-center gap-4 cursor-pointer group/item'>
                  <div className='relative flex items-center justify-center'>
                    <input
                      type="radio"
                      name="discount"
                      value={d.value}
                      onChange={(e) => setDiscountFilter(e.target.value)}
                      checked={discountFilter === d.value}
                      className='peer appearance-none w-5 h-5 rounded-full border border-white/10 bg-white/5 checked:bg-secondary checked:border-secondary transition-all duration-300'
                    />
                    <div className='absolute w-2 h-2 rounded-full bg-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none'></div>
                  </div>
                  <span className='text-sm font-medium text-white/60 group-hover/item:text-secondary transition-colors'>{d.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-6'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />

          {/* Custom Product Sort Dropdown */}
          <div className="relative group w-full sm:min-w-[180px] sm:w-auto">
            <div
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-secondary/50 transition-all duration-300 group/sort shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Sort:</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">{currentSortLabel}</span>
              </div>
              <img
                className={`h-2.5 w-2.5 transition-transform duration-300 opacity-60 group-hover/sort:opacity-100 invert ${isSortOpen ? 'rotate-180' : ''}`}
                src={assets.dropdown_icon}
                alt="chevron"
              />
            </div>

            {isSortOpen && (
              <div
                className="absolute top-full right-0 mt-3 w-full sm:w-56 glass-card !bg-background/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 p-2"
                onMouseLeave={() => setIsSortOpen(false)}
              >
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSortType(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all rounded-xl flex items-center justify-between mb-1 last:mb-0 ${sortType === option.value
                      ? 'bg-secondary text-black shadow-lg shadow-secondary/10'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {option.label}
                    {sortType === option.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black/50" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            currentProducts.map((item, index) => (
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} originalPrice={item.originalPrice} image={item.image} rating={item.rating} numReviews={item.numReviews} />
            ))
          }
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='flex flex-wrap justify-center items-center gap-4 mt-16 mb-12'>
            {/* Previous Button */}
            <button
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all font-outfit text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl ${currentPage === 1
                ? 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-secondary/50 hover:text-secondary hover:shadow-[0_0_20px_rgba(242,204,13,0.1)] active:scale-95'
                }`}
            >
              <img className='h-2.5 rotate-180 opacity-40 brightness-0 invert' src={assets.dropdown_icon} alt="" />
              PREV
            </button>

            {/* Page Numbers Container */}
            <div className='flex gap-2.5 glass-card p-2 rounded-[2rem] border border-white/5 backdrop-blur-xl'>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-12 h-12 rounded-2xl transition-all duration-500 font-outfit text-sm flex items-center justify-center ${currentPage === i + 1
                    ? 'bg-secondary text-black shadow-[0_0_25px_rgba(242,204,13,0.4)] scale-110 font-black border-none'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all font-outfit text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl ${currentPage === totalPages
                ? 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-secondary/50 hover:text-secondary hover:shadow-[0_0_20px_rgba(242,204,13,0.1)] active:scale-95'
                }`}
            >
              NEXT
              <img className='h-2.5 opacity-40 brightness-0 invert' src={assets.dropdown_icon} alt="" />
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Collection