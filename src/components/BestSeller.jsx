import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const { products, siteConfig } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        let bestProduct = products.filter((item) => item.bestseller);

        if (siteConfig && siteConfig.bestsellerProducts && siteConfig.bestsellerProducts.length > 0) {
            const configBestsellers = products.filter(p => siteConfig.bestsellerProducts.includes(p._id));
            bestProduct = [...configBestsellers, ...bestProduct];
            // Remove duplicates (keep the custom ones first)
            bestProduct = bestProduct.filter((item, index, self) => index === self.findIndex((t) => t._id === item._id));
        }

        setBestSeller(bestProduct.slice(0, 5));
    }, [products, siteConfig])

    return (
        <div className='my-16 sm:my-24 px-4 sm:px-6'>
            <div className='text-center mb-10 sm:mb-12'>
                <h2 className='font-outfit text-2xl sm:text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-3 sm:mb-4'>
                    {siteConfig?.bestSellerTitle || "BEST SELLERS"}
                </h2>
                <div className='w-16 sm:w-24 h-[1px] sm:h-[2px] bg-secondary mx-auto mb-4 sm:mb-6'></div>
                <p className='max-w-2xl m-auto text-[10px] sm:text-sm text-gray-400 font-sans tracking-widest uppercase opacity-70'>
                    {siteConfig?.bestSellerSubtitle || "Discover our most-loved products, curated for their exceptional quality and timeless style."}
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4 sm:gap-8 md:gap-12'>
                {
                    bestSeller.map((item, index) => (
                        <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} originalPrice={item.originalPrice} rating={item.rating} numReviews={item.numReviews} />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller