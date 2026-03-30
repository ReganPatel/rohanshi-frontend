import React from 'react';

const Privacy = () => {
    return (
        <div className='py-16 px-4 sm:px-[5vw] font-outfit text-gray-300'>
            <div className='glass-card p-8 md:p-16 rounded-[3rem] gold-glow'>
                <h1 className='text-3xl md:text-5xl font-black gold-text mb-12 tracking-widest text-center uppercase'>Privacy Policy</h1>

                <div className='space-y-12 leading-loose'>
                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>1. Introduction</h2>
                        <p className='text-gray-400'>
                            Welcome to <span className='gold-text'>Rohanshi’s Creation</span>. We value your trust and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>2. Information We Collect</h2>
                        <div className='space-y-4 text-gray-400'>
                            <p><strong>Personal Information:</strong> We collect details such as your name, billing and shipping addresses, email, and phone number when you register or place an order.</p>
                            <p><strong>Transaction Details:</strong> We maintain records of products you purchase, transaction dates, and amounts. Payment information is securely processed by our payment gateways (e.g., Razorpay) and is never stored on our servers.</p>
                            <p><strong>Technical Data:</strong> We automatically collect information about your device, including IP address, browser type, and duration of visit to improve our site performance.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>3. How We Use Your Data</h2>
                        <p className='text-gray-400'>We use your information to:</p>
                        <ul className='list-disc list-inside text-gray-400 space-y-2 mt-4 ml-4'>
                            <li>Process and fulfill your orders effectively.</li>
                            <li>Send order updates and tracking information.</li>
                            <li>Personalize your shopping experience and product recommendations.</li>
                            <li>Detect and prevent fraudulent activities.</li>
                            <li>Communicate promotional offers and newsletters (only if you opt-in).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>4. Sharing with Third Parties</h2>
                        <p className='text-gray-400'>
                            We do not sell your personal data. We only share information with trusted partners necessary for business operations:
                        </p>
                        <ul className='list-disc list-inside text-gray-400 space-y-2 mt-4 ml-4'>
                            <li><strong>Delivery Partners:</strong> To ensure your orders reach you.</li>
                            <li><strong>Payment Processors:</strong> To facilitate secure financial transactions.</li>
                            <li><strong>Analytics Providers:</strong> To help us understand site usage and improve user experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>5. Data Security</h2>
                        <p className='text-gray-400'>
                            We use <span className='gold-text'>SSL (Secure Sockets Layer)</span> encryption to protect your data during transmission. Our servers are secured with advanced firewalls and access controls to prevent unauthorized access.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>6. Your Rights</h2>
                        <p className='text-gray-400'>
                            You have the right to access, update, or request the deletion of your personal data at any time. You can also opt-out of marketing communications by clicking the "unsubscribe" link in our emails or contacting our support.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>7. Cookies</h2>
                        <p className='text-gray-400'>
                            Our site uses cookies to remember your preferences and cart items. You can manage cookie settings in your browser, although this may affect site functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-2 inline-block'>8. Contact Information</h2>
                        <p className='text-gray-400'>
                            For any queries regarding this policy, please reach out to us:
                        </p>
                        <div className='mt-6 p-6 bg-white/5 rounded-2xl border border-white/10'>
                            <p className='font-bold gold-text'>Rohanshi’s Creation Support</p>
                            <p>Email: <a href="mailto:rohanshicreation@gmail.com" className='hover:underline'>rohanshicreation@gmail.com</a></p>
                            <p>Phone: <a href="tel:+916355990921" className='hover:underline'>+91-635-599-0921</a></p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
