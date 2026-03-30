import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { products, wishlist } = useContext(ShopContext);
    const [wishlistProducts, setWishlistProducts] = useState([]);

    useEffect(() => {
        if (products.length > 0 && wishlist) {
            const items = products.filter(product => wishlist.includes(product._id));
            setWishlistProducts(items);
        }
    }, [products, wishlist]);

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                <Title text1={'MY'} text2={'WISHLIST'} />
            </div>

            <div className='flex flex-col gap-10'>
                {wishlistProducts.length > 0 ? (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                        {wishlistProducts.map((item, index) => (
                            <ProductItem
                                key={index}
                                name={item.name}
                                id={item._id}
                                price={item.price}
                                image={item.image}
                                originalPrice={item.originalPrice}
                                stock={item.stock}
                                rating={item.rating}
                                numReviews={item.numReviews}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center pt-10 text-gray-500'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <p className='text-lg'>Your wishlist is empty!</p>
                        <p className='mt-2 mb-6 text-sm text-center'>Explore more and shortlist some items.</p>
                        <Link to='/collection' className='bg-primary text-white py-2 px-6 rounded hover:bg-accent transition-colors'>
                            CONTINUE SHOPPING
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
