import React from 'react';

const Terms = () => {
    return (
        <div className='py-16 px-4 sm:px-[5vw] font-outfit text-gray-300'>
            <div className='glass-card p-8 md:p-16 rounded-[3rem] gold-glow'>
                <h1 className='text-3xl md:text-5xl font-black gold-text mb-12 tracking-widest text-center uppercase'>Terms of Service</h1>

                <div className='space-y-12 leading-loose'>
                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>1. Acceptance of Terms</h2>
                        <p className='text-gray-400'>
                            By accessing and using the website of <span className='gold-text'>Rohanshi’s Creation</span>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>2. Product Disclaimer</h2>
                        <p className='text-gray-400'>
                            Most of our jewelry products are handcrafted with precision and care. As such, minor variations in color, texture, and finish are natural characteristics of the artisanal process. We strive to present our products as accurately as possible, but we cannot guarantee that your monitor's display of any color will be exactly the same as the physical item.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>3. Pricing and Payments</h2>
                        <ul className='list-disc list-inside text-gray-400 space-y-2 mt-2'>
                            <li>All prices are listed in Indian Rupees (INR) unless stated otherwise.</li>
                            <li>Pricing is subject to change without prior notice.</li>
                            <li>We use secure third-party payment gateways for all transactions. Rohanshi’s Creation does not store your credit/debit card details.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>4. Intellectual Property</h2>
                        <p className='text-gray-400'>
                            All content on this website, including designs, images, logos, and text, is the property of <span className='gold-text'>Rohanshi’s Creation</span> and is protected by copyright laws. Unauthorized use or reproduction of any material is strictly prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>5. Shipping and Delivery</h2>
                        <p className='text-gray-400'>
                            We aim to process and ship orders within 48-72 hours. Delivery timelines are provided by our courier partners and are estimates. Rohanshi’s Creation is not liable for delays caused by logistics providers or external factors beyond our control.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>6. Returns and Exchanges</h2>
                        <p className='text-gray-400'>
                            We accept returns only in cases where the product received is damaged, defective, or incorrect. Customers must notify us within <span className='gold-text'>7 days</span> of delivery to be eligible for a return or replacement. All items must be returned in their original packaging with tags intact.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>7. Limitation of Liability</h2>
                        <p className='text-gray-400'>
                            Rohanshi’s Creation shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our products or services.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>8. Governing Law</h2>
                        <p className='text-gray-400'>
                            These terms are governed by the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in our operating region.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
