import React, { useState } from 'react'
import { toast } from 'react-toastify';

const NewsletterBox = () => {

  const [email, setEmail] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing! We'll be in touch.");
      setEmail('');
    }
  }

  return (
    <div className='text-center py-24 px-4 m-4 sm:mx-[5vw] glass-card rounded-[3rem] gold-glow relative overflow-hidden'>
      {/* Background Glow */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none'></div>

      <p className='font-outfit text-4xl sm:text-5xl font-bold text-white uppercase tracking-tighter mb-6'>NEWSLETTER <span className='gold-text italic'>SIGNUP</span></p>

      <p className='text-gray-400 mt-4 max-w-xl mx-auto leading-loose text-sm sm:text-base font-sans tracking-widest uppercase opacity-70'>
        Join our mailing list and get <span className='gold-text font-bold'>20% OFF</span> on your first order at Rohanshi’s Creation.
      </p>

      <div className='mt-12 flex flex-col items-center gap-6'>
        <p className='text-[10px] sm:text-xs font-outfit font-medium text-gray-500 uppercase tracking-[0.4em]'>REDEEM AT CHECKOUT</p>
        <div
          onClick={() => {
            navigator.clipboard.writeText('NEWUSER20');
            toast.success('Discount code copied!');
          }}
          className='group relative cursor-pointer'
        >
          <div className='bg-primary/50 text-secondary border-2 border-dashed border-secondary/30 px-12 py-6 rounded-3xl text-4xl sm:text-5xl font-outfit font-bold tracking-[0.2em] transform transition-all duration-500 group-hover:scale-105 group-hover:border-secondary shadow-2xl backdrop-blur-md'>
            NEWUSER20
          </div>
          <div className='absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-[10px] font-outfit tracking-widest text-secondary uppercase'>
            Click to Copy Code
          </div>
        </div>
        <p className='mt-12 text-[10px] text-gray-600 font-sans tracking-[0.2em] uppercase'>
          *For first-time customers only. Applied at checkout.
        </p>
      </div>
    </div>
  )
}

export default NewsletterBox