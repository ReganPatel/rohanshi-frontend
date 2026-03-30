import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const { pathname } = useLocation();

    const { search, setSearch, showSearch, setShowSearch, getCartCount, navigate, token, setToken, setCartItems, wishlist, userData, getWishlistCount } = useContext(ShopContext);

    useEffect(() => {
        if (pathname.includes('collection')) {
            setIsSearchVisible(true);
        } else {
            setIsSearchVisible(false);
            setShowSearch(false);
        }
    }, [pathname])

    const logout = () => {
        navigate('/login')
        sessionStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    return (
        <>
            <div className='flex items-center justify-between py-3 sm:py-4 sticky top-0 sm:top-4 z-50 glass-card mx-0 sm:mx-[5vw] px-4 sm:px-0 md:px-[5vw] lg:px-[7vw] rounded-none sm:rounded-full gold-glow'>

                <Link to={'/'}><img src={assets.logo} className='w-28 sm:w-36' alt="" /></Link>

            {showSearch && isSearchVisible ? (
                <div className='flex-1 max-w-md mx-4 sm:mx-8 animate-in fade-in zoom-in duration-300'>
                    <div className='relative flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-secondary/50 transition-all duration-300 group'>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='flex-1 outline-none bg-transparent text-white text-xs font-outfit tracking-widest placeholder:text-gray-500 uppercase px-2'
                            type="text"
                            placeholder='Search jewelry...'
                            autoFocus
                        />
                        <div className='flex items-center gap-2'>
                            <img className='w-4 invert opacity-40 group-focus-within:opacity-100 transition-opacity' src={assets.search_icon} alt="" />
                            <button
                                onClick={() => setShowSearch(false)}
                                className='p-1.5 hover:bg-white/10 rounded-full transition-colors group/close'
                            >
                                <img className='w-2.5 invert opacity-40 group-hover/close:opacity-100 transition-opacity font-bold' src={assets.cross_icon} alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <ul className='hidden sm:flex items-center gap-2 text-xs font-outfit font-medium tracking-widest text-gray-300'>
                    <NavLink to='/' className={({ isActive }) => `px-5 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary text-black' : 'hover:text-secondary'}`}>
                        HOME
                    </NavLink>
                    <NavLink to='/collection' className={({ isActive }) => `px-5 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary text-black' : 'hover:text-secondary'}`}>
                        COLLECTION
                    </NavLink>
                    <NavLink to='/about' className={({ isActive }) => `px-5 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary text-black' : 'hover:text-secondary'}`}>
                        ABOUT
                    </NavLink>
                    <NavLink to='/contact' className={({ isActive }) => `px-5 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary text-black' : 'hover:text-secondary'}`}>
                        CONTACT
                    </NavLink>
                </ul>
            )}

            <div className='flex items-center gap-3 sm:gap-6'>
                {isSearchVisible && !showSearch && (
                    <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-4 sm:w-5 cursor-pointer transition-transform duration-300 hover:scale-110 invert' alt="" />
                )}

                <Link to='/wishlist' className='relative transition-transform duration-300 hover:scale-110'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 sm:w-6 cursor-pointer text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {getWishlistCount() > 0 && (
                        <p className='absolute right-[-8px] top-[-8px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-secondary text-black font-bold rounded-full text-[8px] sm:text-[10px] gold-glow'>{getWishlistCount()}</p>
                    )}
                </Link>

                <div className='group relative flex items-center justify-center'>
                    <img
                        onClick={() => token ? null : navigate('/login')}
                        className={`cursor-pointer transition-transform duration-300 hover:scale-110 ${token && userData?.profilePhoto ? 'w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-secondary gold-glow' : 'w-4 sm:w-5 invert'}`}
                        src={token && userData?.profilePhoto ? userData.profilePhoto : assets.profile_icon}
                        alt="Profile"
                    />
                    {/* Dropdown */}
                    {token &&
                        <div className='group-hover:block hidden absolute top-full right-0 pt-4 z-20'>
                            <div className='flex flex-col gap-1 w-48 sm:w-52 py-3 px-3 glass-card !bg-background/95 rounded-2xl gold-glow text-gray-200'>
                                <div onClick={() => navigate('/profile')} className='flex items-center gap-3 cursor-pointer hover:bg-white/5 py-3 px-3 rounded-xl transition-colors'>
                                    <img src={assets.profile_icon} alt="" className='w-4 invert opacity-70' />
                                    <p className='font-outfit text-sm'>My Profile</p>
                                </div>
                                <div onClick={() => navigate('/orders')} className='flex items-center gap-3 cursor-pointer hover:bg-white/5 py-3 px-3 rounded-xl transition-colors'>
                                    <img src={assets.orders_icon} alt="" className='w-4 invert opacity-70' />
                                    <p className='font-outfit text-sm'>Orders</p>
                                </div>
                                <div onClick={() => navigate('/coupons')} className='flex items-center gap-3 cursor-pointer hover:bg-white/5 py-3 px-3 rounded-xl transition-colors'>
                                    <img src={assets.coupons_icon} alt="" className='w-4 invert opacity-70' />
                                    <p className='font-outfit text-sm'>Coupons</p>
                                </div>
                                <div onClick={() => navigate('/saved-addresses')} className='flex items-center gap-3 cursor-pointer hover:bg-white/5 py-3 px-3 rounded-xl transition-colors'>
                                    <img src={assets.address_icon} alt="" className='w-4 invert opacity-70' />
                                    <p className='font-outfit text-sm'>Saved Addresses</p>
                                </div>
                                <hr className='border-white/10 my-1' />
                                <div onClick={logout} className='flex items-center gap-3 cursor-pointer hover:bg-red-500/10 py-3 px-3 rounded-xl transition-colors group/logout'>
                                    <img src={assets.logout_icon} alt="" className='w-4 invert opacity-70' />
                                    <p className='font-outfit text-sm text-red-400 group-hover/logout:text-red-300'>Logout</p>
                                </div>
                            </div>
                        </div>}
                </div>
                <Link to='/cart' className='relative transition-transform duration-300 hover:scale-110'>
                    <img src={assets.cart_icon} className='w-4 sm:w-5 min-w-[16px] sm:min-w-[20px] cursor-pointer invert' alt="" />
                    <p className='absolute right-[-8px] top-[-8px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-secondary text-black font-bold rounded-full text-[8px] sm:text-[10px] gold-glow'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 sm:w-6 cursor-pointer sm:hidden invert' alt="" />
            </div>
            
            {/* The main Navbar container is now closed. Sidebar is a sibling below. */}
        </div>

        {/*sidebar menu for small screens */}
        {/* We move this outside the glass-card sticky container, otherwise iOS/Safari backdrop-filter forces its height to match the navbar! */}
        <div className={`fixed top-0 right-0 bottom-0 overflow-hidden glass-card transition-all z-[100] ${visible ? 'w-full' : 'w-0'}`}>
            <div className='flex flex-col text-gray-200 h-full overflow-y-auto bg-background/95 custom-scrollbar backdrop-blur-3xl'>
                <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-5 cursor-pointer border-b border-white/10 shrink-0 bg-background'>
                    <img className='h-4 rotate-180 invert' src={assets.dropdown_icon} alt="" />
                    <p className='font-outfit uppercase tracking-widest'>Close Back</p>
                </div>
                <NavLink onClick={() => setVisible(false)} className='py-6 text-center border-b border-white/5 hover:bg-white/5 hover:text-secondary transition-all font-outfit text-lg tracking-widest' to='/'>HOME</NavLink>
                <NavLink onClick={() => setVisible(false)} className='py-6 text-center border-b border-white/5 hover:bg-white/5 hover:text-secondary transition-all font-outfit text-lg tracking-widest' to='/collection'>COLLECTION</NavLink>
                <NavLink onClick={() => setVisible(false)} className='py-6 text-center border-b border-white/5 hover:bg-white/5 hover:text-secondary transition-all font-outfit text-lg tracking-widest' to='/about'>ABOUT</NavLink>
                <NavLink onClick={() => setVisible(false)} className='py-6 text-center border-b border-white/5 hover:bg-white/5 hover:text-secondary transition-all font-outfit text-lg tracking-widest' to='/contact'>CONTACT</NavLink>
            </div>
        </div>
    </>
    )
}

export default Navbar
