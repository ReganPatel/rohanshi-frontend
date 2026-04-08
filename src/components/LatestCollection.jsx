import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';


const LatestCollection = () => {

    const { products, siteConfig } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        if (siteConfig && siteConfig.latestProducts && siteConfig.latestProducts.length > 0) {
            // Show exactly what is selected in the admin panel, preserving order
            const configLatest = siteConfig.latestProducts
                .map(id => products.find(p => p._id === id))
                .filter(Boolean);
            setLatestProducts(configLatest);
        } else {
            // Fallback if nothing is selected in admin panel
            let latestItems = products.filter((item) => item.latest);
            setLatestProducts(latestItems.slice(0, 10));
        }
    }, [products, siteConfig])

    return (
        <div className='my-16 sm:my-24 px-4 sm:px-6'>
            <div className='text-center mb-10 sm:mb-12'>
                <h2 className='font-outfit text-2xl sm:text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-3 sm:mb-4'>
                    {siteConfig?.latestCollectionTitle || "LATEST COLLECTION"}
                </h2>
                <div className='w-16 sm:w-24 h-[1px] sm:h-[2px] bg-secondary mx-auto mb-4 sm:mb-6'></div>
                <p className='max-w-2xl m-auto text-[10px] sm:text-sm text-gray-400 font-sans tracking-widest uppercase opacity-70'>
                    {siteConfig?.latestCollectionSubtitle || "Step into a world of curated elegance, where every piece tells a story of timeless beauty and master craftsmanship."}
                </p>
            </div>
            {/*Rendering Products*/}
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4 sm:gap-8 md:gap-12'>
                {
                    latestProducts.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} originalPrice={item.originalPrice} rating={item.rating} numReviews={item.numReviews} />
                    ))
                }
            </div>
        </div>
    )
}

export default LatestCollection