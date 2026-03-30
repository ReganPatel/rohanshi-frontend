import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false)
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    }, [location])

    return showSearch && visible ? (
        <div className='sticky top-[90px] z-40 w-full px-4 sm:px-[5vw] transition-all duration-500 animate-reveal'>
            <div className='glass-card rounded-full p-2 gold-glow border border-white/10 flex items-center gap-4 max-w-3xl mx-auto backdrop-blur-2xl'>
                <div className='flex-1 flex items-center bg-white/5 rounded-full px-6 py-3 border border-white/5 focus-within:border-secondary/50 transition-all duration-300'>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='flex-1 outline-none bg-transparent text-white text-sm font-outfit tracking-widest placeholder:text-gray-500 uppercase'
                        type="text"
                        placeholder='Search the collection...'
                    />
                    <img className='w-5 invert opacity-60' src={assets.search_icon} alt="" />
                </div>
                <button
                    onClick={() => setShowSearch(false)}
                    className='p-3 hover:bg-white/10 rounded-full transition-colors group'
                >
                    <img className='w-3 invert opacity-40 group-hover:opacity-100 transition-opacity' src={assets.cross_icon} alt="" />
                </button>
            </div>
        </div>
    ) : null
}

export default SearchBar