import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SavedAddresses = () => {
    const { backendUrl, token, navigate } = useContext(ShopContext);
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const fetchAddresses = async () => {
        try {
            if (!token) return;
            const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
            if (response.data.success) {
                setAddresses(response.data.user.addresses || []);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchAddresses();
    }, [token, backendUrl, navigate]);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let response;
            if (isEditingAddress) {
                response = await axios.post(backendUrl + '/api/user/update-address', { addressId: editingAddressId, updatedAddress: form }, { headers: { token } });
            } else {
                response = await axios.post(backendUrl + '/api/user/add-address', form, { headers: { token } });
            }
            if (response.data.success) {
                toast.success(isEditingAddress ? "Address updated successfully" : "Address added successfully");
                setShowAddForm(false);
                setIsEditingAddress(false);
                setEditingAddressId(null);
                setForm({
                    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
                });
                fetchAddresses(); // Refresh list
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditAddress = (addr) => {
        setForm({
            firstName: addr.firstName,
            lastName: addr.lastName,
            email: addr.email,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipcode: addr.zipcode,
            country: addr.country,
            phone: addr.phone.replace('+91', '') // Remove prefix if it was added manually or by another component
        });
        setEditingAddressId(addr.id);
        setIsEditingAddress(true);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRemoveAddress = async (addressId) => {
        if (!window.confirm("Are you sure you want to remove this address?")) return;
        try {
            const response = await axios.post(backendUrl + '/api/user/remove-address', { addressId }, { headers: { token } });
            if (response.data.success) {
                toast.success("Address removed successfully");
                fetchAddresses();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='pt-20 px-4 sm:px-[5vw] transition-all duration-700 ease-out opacity-100 pb-24'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16'>
                    <div className='text-3xl font-outfit font-bold tracking-tighter uppercase flex items-center gap-4'>
                        <span className='w-12 h-[2px] bg-secondary'></span>
                        <Title text1={'ADDRESS'} text2={'BOOK'} />
                    </div>
                    {!showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className='px-10 py-4 bg-white text-black rounded-2xl hover:bg-secondary transition-all font-outfit font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg flex items-center gap-2 group'
                        >
                            <span className='group-hover:rotate-90 transition-transform duration-500'>+</span> ADD NEW ADDRESS
                        </button>
                    )}
                </div>

                {/* Add Address Form toggle */}
                {showAddForm && (
                    <div className='glass-card p-10 sm:p-14 rounded-[3rem] mb-16 border border-white/10 gold-glow animate-fadeIn relative'>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className='absolute top-8 right-10 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full'
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <div className='flex flex-col gap-2 mb-10 text-center md:text-left'>
                            <p className='text-[10px] font-outfit text-secondary uppercase tracking-[0.4em] font-bold'>SHIPPING INFO</p>
                            <h3 className='text-2xl font-outfit font-bold text-white uppercase tracking-wider'>{isEditingAddress ? 'Update Address' : 'Add New Address'}</h3>
                        </div>

                        <form onSubmit={handleAddAddress} className='flex flex-col gap-6 max-w-4xl mx-auto'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <input required name="firstName" onChange={handleInputChange} value={form.firstName} className='w-full px-8 py-5 bg-black/30 border border-white/5 rounded-2xl text-white font-outfit text-sm focus:border-secondary outline-none transition-all' type="text" placeholder='FIRST NAME' />
                                <input required name="lastName" onChange={handleInputChange} value={form.lastName} className='w-full px-8 py-5 bg-black/30 border border-white/5 rounded-2xl text-white font-outfit text-sm focus:border-secondary outline-none transition-all' type="text" placeholder='LAST NAME' />
                            </div>
                            <input required name="email" onChange={handleInputChange} value={form.email} className='w-full px-8 py-5 bg-black/30 border border-white/5 rounded-2xl text-white font-outfit text-sm focus:border-secondary outline-none transition-all' type="email" placeholder='EMAIL' />
                            <input required name="street" onChange={handleInputChange} value={form.street} className='w-full px-8 py-5 bg-black/30 border border-white/5 rounded-2xl text-white font-outfit text-sm focus:border-secondary outline-none transition-all' type="text" placeholder='STREET ADDRESS' />
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <input required name="city" onChange={handleInputChange} value={form.city} className='w-full px-8 py-5 bg-black/30 border border-white/5 rounded-2xl text-white font-outfit text-sm focus:border-secondary outline-none transition-all' type="text" placeholder='CITY' />
                                <input required name="state" onChange={handleInputChange} value={form.state} className='w-full px-8 py-5 bg-black/30 border border-white/5 rounded-2xl text-white font-outfit text-sm focus:border-secondary outline-none transition-all' type="text" placeholder='STATE' />
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <input required name="zipcode" onChange={handleInputChange} value={form.zipcode} className='w-full px-8 py-5 bg-black/30 border border-white/5 rounded-2xl text-white font-outfit text-sm focus:border-secondary outline-none transition-all' type="number" placeholder='ZIP / PIN CODE' />
                                <input required name="country" onChange={handleInputChange} value={form.country} className='w-full px-8 py-5 bg-black/30 border border-white/5 rounded-2xl text-white font-outfit text-sm focus:border-secondary outline-none transition-all' type="text" placeholder='COUNTRY' />
                            </div>
                            <div className='flex gap-2 items-center bg-black/30 border border-white/5 rounded-2xl px-8 py-5 group focus-within:border-secondary transition-all'>
                                <span className='text-secondary font-outfit font-bold text-sm tracking-widest'>+91</span>
                                <input required name="phone" onChange={handleInputChange} value={form.phone} className='outline-none w-full bg-transparent text-white font-outfit text-sm tracking-[0.2em]' type="number" placeholder='PHONE NUMBER' />
                            </div>

                            <div className='flex justify-end gap-6 mt-6'>
                                <button
                                    type="button"
                                    onClick={() => { setShowAddForm(false); setIsEditingAddress(false); setEditingAddressId(null); setForm({ firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '' }); }}
                                    className='px-12 py-4 border border-white/10 text-white rounded-2xl hover:bg-white/5 transition-all font-outfit font-bold text-[10px] uppercase tracking-widest'
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-12 py-4 bg-white text-black rounded-2xl transition-all font-outfit font-bold text-[10px] uppercase tracking-widest shadow-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'}`}
                                >
                                    {isSubmitting ? 'SAVING...' : (isEditingAddress ? 'UPDATE ADDRESS' : 'SAVE ADDRESS')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Address List Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {addresses.length > 0 ? (
                        addresses.map((addr) => (
                            <div key={addr.id} className='glass-card p-10 rounded-[2.5rem] border border-white/5 hover:border-secondary/30 transition-all gold-glow relative group flex flex-col justify-between h-[320px]'>
                                <div>
                                    <div className='flex items-center gap-4 mb-8'>
                                        <div className='w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20'>
                                            <span className='text-secondary text-sm'>◈</span>
                                        </div>
                                        <p className='font-outfit font-bold text-white text-xl uppercase tracking-tighter truncate'>{addr.firstName} {addr.lastName}</p>
                                    </div>
                                    <div className='text-gray-400 space-y-2 font-outfit text-[11px] uppercase tracking-[0.2em] opacity-70'>
                                        <p className='leading-relaxed'>{addr.street}</p>
                                        <p>{addr.city}, {addr.state} {addr.zipcode}</p>
                                        <p className='text-secondary font-bold tracking-[0.3em] font-outfit mt-4'>PH: {addr.phone}</p>
                                    </div>
                                </div>

                                <div className='absolute bottom-8 right-8'>
                                    <div className='flex gap-4'>
                                        <button onClick={() => handleEditAddress(addr)} className='text-secondary hover:text-white text-[10px] font-outfit font-bold uppercase tracking-widest transition-colors py-2 px-4 hover:bg-white/5 rounded-xl border border-transparent hover:border-secondary/20'>Edit</button>
                                        <button
                                            onClick={() => handleRemoveAddress(addr.id)}
                                            className='text-red-400/50 hover:text-red-400 text-[10px] font-outfit font-bold uppercase tracking-widest transition-colors py-2 px-4 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/10'
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !showAddForm && (
                            <div className='col-span-full py-24 text-center glass-card border border-white/10 rounded-[3rem] gold-glow'>
                                <div className='text-6xl mb-6 grayscale opacity-50'>📍</div>
                                <p className='text-white font-outfit font-bold text-xl uppercase tracking-[0.2em] mb-2'>No Saved Addresses</p>
                                <p className='text-gray-500 font-outfit text-sm uppercase tracking-widest'>Save an address for a faster checkout experience.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedAddresses;
