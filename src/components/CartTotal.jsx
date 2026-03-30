import React, { useContext } from 'react'
import Title from './Title';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {

    const { currency, delivery_fee, getCartAmount, getCartMRP, discount } = useContext(ShopContext);

    const mrp = getCartMRP();
    const subtotal = getCartAmount();
    const discountOnMrp = mrp - subtotal;
    const finalTotal = subtotal === 0 ? 0 : Math.max(0, subtotal - discount) + delivery_fee;
    const totalSavings = discountOnMrp + discount;

    return (
        <div className='w-full'>
            <div className='text-2xl font-outfit font-bold tracking-tighter uppercase mb-6 flex items-center gap-3'>
                <span className='w-8 h-[1px] bg-secondary'></span>
                <Title text1={'ORDER'} text2={'SUMMARY'} />
            </div>

            <div className='flex flex-col gap-4 mt-4 text-xs font-outfit bg-white/5 p-8 rounded-[2rem] border border-white/10 gold-glow'>
                {/* Row 1: MRP */}
                <div className='flex justify-between items-center opacity-70'>
                    <p className='uppercase tracking-[0.2em] font-bold'>MRP</p>
                    <p className='text-lg font-bold tracking-tight'>{currency}{mrp}</p>
                </div>

                {/* Row 2: Fees */}
                <div className='flex justify-between items-center opacity-70'>
                    <p className='uppercase tracking-[0.2em] font-bold'>DELIVERY</p>
                    <p className='text-lg font-bold tracking-tight'>{currency}{delivery_fee}</p>
                </div>

                <hr className='border-white/5 my-2' />

                {/* Row 3: Discounts (if applicable) */}
                <div className='flex flex-col gap-4'>
                    <p className='text-[10px] text-secondary font-bold uppercase tracking-[0.3em]'>DISCOUNTS & COUPONS</p>

                    {discountOnMrp > 0 && (
                        <div className='flex justify-between items-center pl-4'>
                            <p className='uppercase tracking-[0.1em] text-gray-400'>PRODUCT DISCOUNT</p>
                            <p className='text-lg font-bold tracking-tight text-secondary'>- {currency}{discountOnMrp}</p>
                        </div>
                    )}

                    {discount > 0 && (
                        <div className='flex justify-between items-center pl-4 pb-2'>
                            <p className='uppercase tracking-[0.1em] text-gray-400'>COUPON DISCOUNT</p>
                            <p className='text-lg font-bold tracking-tight text-secondary'>- {currency}{Math.min(discount, subtotal)}</p>
                        </div>
                    )}
                </div>

                <hr className='border-white/5 my-2' />

                {/* Row 4: Total Amount */}
                <div className='flex justify-between items-center text-white mt-2'>
                    <p className='text-sm font-bold uppercase tracking-widest text-gray-400'>BAG TOTAL</p>
                    <p className='text-3xl font-bold tracking-tighter gold-text'>{currency}{finalTotal}</p>
                </div>

                {/* Savings Tag */}
                {totalSavings > 0 && (
                    <div className='mt-6 bg-secondary/10 text-secondary rounded-2xl py-4 px-6 flex items-center justify-center gap-3 border border-secondary/20'>
                        <span className='bg-secondary text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg'>%</span>
                        <p className='uppercase tracking-[0.2em] font-bold text-[10px]'>You saved {currency}{totalSavings} on this order</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartTotal;