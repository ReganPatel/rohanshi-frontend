import React, { useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = () => {

    const { products, currency, cartItems, updateQuantity, navigate, getCartAmount, backendUrl, token, setCouponCode, setDiscount, couponCode } = useContext(ShopContext);

    const [cartData, setCartData] = useState([]);
    const [couponInput, setCouponInput] = useState(couponCode || '');
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [showCoupons, setShowCoupons] = useState(false);

    const fetchAvailableCoupons = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/coupon/available');
            if (response.data.success) {
                setAvailableCoupons(response.data.coupons);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAvailableCoupons();
    }, [backendUrl]);

    const applyCoupon = async () => {
        if (!couponInput) {
            toast.error('Please enter a coupon code');
            return;
        }
        try {
            const response = await axios.post(backendUrl + '/api/coupon/validate', {
                code: couponInput.trim().toUpperCase(),
                cartAmount: getCartAmount()
            }, { headers: { token } });

            if (response.data.success) {
                setDiscount(response.data.discount);
                setCouponCode(couponInput.trim().toUpperCase());
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeCoupon = () => {
        setDiscount(0);
        setCouponCode('');
        setCouponInput('');
        toast.success('Coupon removed');
    };

    useEffect(() => {

        if (products.length > 0) {
            const tempData = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        tempData.push({
                            _id: items,
                            size: item,
                            quantity: cartItems[items][item]
                        })
                    }
                }
            }
            setCartData(tempData);
        }
    }, [cartItems, products]);

    return (
        <div className='pt-10 sm:pt-20 px-4 sm:px-[5vw] transition-all duration-700 ease-out opacity-100 pb-24'>
            <div className='max-w-6xl mx-auto'>
                <div className='text-2xl sm:text-3xl font-outfit font-bold tracking-tighter mb-8 sm:mb-12 flex items-center gap-3 sm:gap-4 uppercase'>
                    <span className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-secondary'></span>
                    <Title text1={'SHOPPING'} text2={'BAG'} />
                </div>

                <div className='flex flex-col gap-6'>
                    {
                        cartData.map((item, index) => {
                            const productData = products.find((product) => product._id === item._id);

                            if (!productData) {
                                return null;
                            }

                            let displaySize = item.size;
                            let displayColor = null;
                            if (item.size && item.size.includes('_')) {
                                const parts = item.size.split('_');
                                displaySize = parts[0];
                                displayColor = parts[1] !== 'N/A' ? parts[1] : null;
                            } else {
                                displaySize = item.size;
                            }

                            return (
                                <div key={index} className='glass-card p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 gold-glow flex flex-col sm:flex-row items-center gap-4 sm:gap-8 group hover:border-white/10 transition-all'>
                                    <Link to={`/product/${item._id}`} className='flex items-center gap-4 sm:gap-8 flex-1 w-full group/link'>
                                        <div className='w-20 sm:w-32 h-20 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-white/5 border border-white/5 p-2 group-hover/link:border-secondary/30 transition-all'>
                                            <img className='w-full h-full object-contain group-hover/link:scale-110 transition-transform duration-500' src={productData.image[0]} alt="" />
                                        </div>
                                        <div className='flex-1'>
                                            <p className='text-[10px] sm:text-xs font-outfit text-gray-400 uppercase tracking-widest mb-1'>{productData.category}</p>
                                            <p className='text-base sm:text-xl font-outfit font-bold text-white tracking-tight leading-tight mb-2 group-hover/link:gold-text transition-colors'>{productData.name}</p>
                                            <div className='flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4'>
                                                <p className='text-lg sm:text-xl font-bold gold-text'>{currency}{productData.price}</p>
                                                <div className='flex items-center gap-2'>
                                                    {displaySize !== 'N/A' && <span className='px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/5 text-[8px] sm:text-[10px] font-outfit font-bold text-gray-300 uppercase tracking-widest'>{displaySize}</span>}
                                                    {displayColor && <span className='px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-[8px] sm:text-[10px] font-outfit font-bold text-secondary uppercase tracking-widest'>{displayColor}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className='flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto mt-4 sm:mt-0'>
                                        <div className='flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-2'>
                                            <button
                                                onClick={() => item.quantity > 1 && updateQuantity(item._id, item.size, item.quantity - 1)}
                                                className='w-8 h-8 rounded-xl hover:bg-white/5 text-white transition-colors flex items-center justify-center font-bold'
                                            >
                                                -
                                            </button>
                                            <input
                                                onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                                                className='bg-transparent text-white font-outfit font-bold text-center w-10 text-lg outline-none'
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                            />
                                            <button
                                                onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                                className='w-8 h-8 rounded-xl hover:bg-white/5 text-white transition-colors flex items-center justify-center font-bold'
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.size, 0)}
                                            className='p-4 hover:bg-red-500/10 rounded-2xl text-gray-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/10 group'
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className='flex flex-col lg:flex-row justify-between gap-16 mt-20'>
                    {/* Coupon Display Box */}
                    <div className='flex-1 max-w-xl'>
                        <div className='glass-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-white/5 gold-glow overflow-hidden relative'>
                            <div className='absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl'></div>

                            <div className='mb-6 sm:mb-8'>
                                <p className='text-[8px] sm:text-[10px] font-outfit text-secondary uppercase tracking-[0.4em] font-bold mb-2'>Apply Coupon</p>
                                <h3 className='text-lg sm:text-xl font-outfit font-bold text-white uppercase tracking-wider'>Got a code?</h3>
                            </div>

                            <div className='flex items-center gap-3 sm:gap-4 h-14 sm:h-16'>
                                <input
                                    type="text"
                                    placeholder="ENTER CODE"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value)}
                                    className='flex-1 h-full px-4 sm:px-8 bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl text-white font-outfit font-bold text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] outline-none focus:border-secondary transition-all uppercase placeholder:text-gray-600'
                                />
                                <button
                                    onClick={couponCode === couponInput.trim().toUpperCase() && couponCode !== '' ? removeCoupon : applyCoupon}
                                    className={`h-full px-6 sm:px-10 font-outfit font-bold text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] rounded-xl sm:rounded-2xl transition-all shadow-xl ${couponCode === couponInput.trim().toUpperCase() && couponCode !== '' ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'bg-white text-black hover:bg-secondary'}`}
                                >
                                    {couponCode === couponInput.trim().toUpperCase() && couponCode !== '' ? 'REMOVE' : 'APPLY'}
                                </button>
                            </div>

                            {couponCode && (
                                <div className='mt-5 sm:mt-6 flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-4 sm:px-6 bg-secondary/10 border border-secondary/20 rounded-full w-fit animate-fadeIn'>
                                    <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary rounded-full animate-pulse'></span>
                                    <p className='text-[8px] sm:text-[10px] font-outfit font-bold text-secondary uppercase tracking-widest'>Coupon Applied: <span className='text-white ml-2'>{couponCode}</span></p>
                                </div>
                            )}

                            <button onClick={() => setShowCoupons(!showCoupons)} className='mt-8 sm:mt-10 flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[9px] font-outfit font-bold text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:text-white transition-colors group'>
                                {showCoupons ? 'HIDE COUPONS' : 'SEE COUPONS'}
                                <span className={`transition-transform duration-500 ${showCoupons ? 'rotate-180' : ''}`}>↓</span>
                            </button>

                            {showCoupons && (
                                <div className='mt-8 flex flex-col gap-4 animate-fadeIn'>
                                    {availableCoupons.length > 0 ? (
                                        availableCoupons.map((coupon, index) => (
                                            <div key={index} className='bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-secondary/30 transition-all group'>
                                                <div>
                                                    <p className='text-sm font-outfit font-bold text-white tracking-[0.3em] mb-1'>{coupon.code}</p>
                                                    <p className='text-[9px] text-gray-500 font-outfit uppercase tracking-widest'>
                                                        {coupon.discountType === 'fixed' ? `${currency}${coupon.discountAmount} Off` : `${coupon.discountAmount}% Off`}
                                                        {coupon.minimumPurchase > 0 && ` on orders above ${currency}${coupon.minimumPurchase}`}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (couponCode === coupon.code) {
                                                            removeCoupon();
                                                        } else {
                                                            setCouponInput(coupon.code);
                                                            setShowCoupons(false);
                                                        }
                                                    }}
                                                    className={`px-6 py-2 rounded-xl font-outfit font-bold text-[9px] tracking-widest uppercase transition-all ${couponCode === coupon.code ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                                                >
                                                    {couponCode === coupon.code ? 'REMOVE' : 'APPLY'}
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-[10px] text-gray-600 font-outfit uppercase tracking-widest p-4 text-center'>No coupons available at this time.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='w-full lg:w-[450px]'>
                        <CartTotal />
                        <div className='mt-12'>
                            <button
                                onClick={() => navigate('/place-order')}
                                className='w-full py-6 bg-white text-black font-outfit font-bold text-[11px] uppercase tracking-[0.5em] rounded-3xl hover:bg-secondary transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-secondary/20 relative overflow-hidden group'
                            >
                                <span className='relative z-10'>PROCEED TO PAY</span>
                                <div className='absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-500'></div>
                            </button>
                            <p className='text-center mt-6 text-[9px] text-gray-600 font-outfit uppercase tracking-widest opacity-60'>Secure and encrypted checkout</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart