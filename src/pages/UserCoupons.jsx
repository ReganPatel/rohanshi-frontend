import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserCoupons = () => {
    const { backendUrl, currency, token, navigate } = useContext(ShopContext);
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCoupons = async () => {
        try {
            // This route might not require auth, but we pass token just in case 
            // the backend expects it to avoid guest spam.
            const response = await axios.get(backendUrl + '/api/coupon/available', { headers: { token } });
            if (response.data.success) {
                setCoupons(response.data.coupons || []);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchCoupons();
    }, [token, backendUrl, navigate]);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Coupon code ${code} copied to clipboard!`);
    };

    return (
        <div className='pt-20 px-4 sm:px-[5vw] transition-all duration-700 ease-out opacity-100 pb-24'>
            <div className='max-w-6xl mx-auto'>
                <div className='text-3xl font-outfit font-bold tracking-tighter mb-16 flex items-center gap-4 uppercase'>
                    <span className='w-12 h-[2px] bg-secondary'></span>
                    <Title text1={'AVAILABLE'} text2={'COUPONS'} />
                </div>

                {isLoading ? (
                    <div className='py-24 text-center text-gray-400 flex flex-col justify-center items-center gap-6 glass-card border border-white/5 rounded-[3rem] gold-glow'>
                        <div className="w-12 h-12 border-[3px] border-white/10 border-t-secondary rounded-full animate-spin"></div>
                        <p className='font-outfit font-bold uppercase tracking-[0.3em] text-xs'>Loading Coupons...</p>
                    </div>
                ) : coupons.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                        {coupons.map((coupon) => (
                            <div key={coupon._id} className='relative glass-card border border-white/10 rounded-[2.5rem] overflow-hidden gold-glow hover:border-secondary/30 transition-all group flex flex-col h-full'>

                                {/* Decorative notches */}
                                <div className='absolute left-[-15px] top-[60%] -translate-y-1/2 w-8 h-8 bg-[#0a0a0a] rounded-full border border-white/5 z-10'></div>
                                <div className='absolute right-[-15px] top-[60%] -translate-y-1/2 w-8 h-8 bg-[#0a0a0a] rounded-full border border-white/5 z-10'></div>

                                <div className='p-8 flex flex-col items-center justify-center border-b border-dashed border-white/10 relative pb-12 pt-10'>
                                    <p className='text-[10px] font-outfit font-bold text-gray-500 uppercase tracking-[0.4em] mb-4'>COUPON CODE</p>
                                    <div className='bg-white/5 text-secondary px-6 py-3 border border-secondary/20 rounded-2xl text-2xl font-outfit font-bold tracking-[0.4em] shadow-inner mb-6'>
                                        {coupon.code}
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <p className='text-5xl font-outfit font-bold text-white tracking-tighter'>
                                            {coupon.discountType === 'fixed' ? currency : ''}{coupon.discountAmount}{coupon.discountType === 'percentage' ? '%' : ''}
                                        </p>
                                        <p className='text-[10px] font-outfit font-bold text-secondary uppercase tracking-[0.5em] mt-1'>OFF</p>
                                    </div>
                                </div>

                                <div className='p-8 bg-white/[0.02] flex flex-col items-center gap-8 flex-1 justify-between pt-10'>
                                    <div className='text-[10px] text-gray-400 font-outfit text-center space-y-2 uppercase tracking-[0.2em] leading-relaxed'>
                                        {coupon.minimumPurchase > 0 ? (
                                            <p>Applicable on orders above <span className='text-white font-bold'>{currency}{coupon.minimumPurchase}</span></p>
                                        ) : (
                                            <p>No minimum purchase required</p>
                                        )}
                                        {coupon.expirationDate && (
                                            <div className='flex items-center justify-center gap-2 mt-4 py-1.5 px-3 bg-red-500/5 border border-red-500/10 rounded-full'>
                                                <span className='w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse'></span>
                                                <p className='text-red-400 font-bold'>
                                                    EXPIRES: {new Date(coupon.expirationDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleCopyCode(coupon.code)}
                                        className='w-full py-4 bg-white text-black rounded-2xl text-[10px] font-outfit font-bold uppercase tracking-[0.4em] hover:bg-secondary transition-all shadow-xl'
                                    >
                                        Copy Code
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='py-28 text-center glass-card border border-white/10 rounded-[3rem] gold-glow'>
                        <div className='text-7xl mb-8 grayscale opacity-50'>🎫</div>
                        <p className='text-white font-outfit font-bold text-xl uppercase tracking-[0.2em] mb-3'>No Active Coupons</p>
                        <p className='text-gray-500 font-outfit text-sm uppercase tracking-widest max-w-md mx-auto'>Check back later for new discounts and special offers.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCoupons;
