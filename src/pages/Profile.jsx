import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const statePinMapping = {
    'Andaman and Nicobar Islands': ['7'],
    'Andhra Pradesh': ['5'],
    'Arunachal Pradesh': ['7'],
    'Assam': ['7'],
    'Bihar': ['8'],
    'Chandigarh': ['1'],
    'Chhattisgarh': ['4'],
    'Dadra and Nagar Haveli and Daman and Diu': ['3'],
    'Delhi': ['1'],
    'Goa': ['4'],
    'Gujarat': ['3'],
    'Haryana': ['1'],
    'Himachal Pradesh': ['1'],
    'Jammu and Kashmir': ['1'],
    'Jharkhand': ['8'],
    'Karnataka': ['5'],
    'Kerala': ['6'],
    'Ladakh': ['1'],
    'Lakshadweep': ['6'],
    'Madhya Pradesh': ['4'],
    'Maharashtra': ['4'],
    'Manipur': ['7'],
    'Meghalaya': ['7'],
    'Mizoram': ['7'],
    'Nagaland': ['7'],
    'Odisha': ['7'],
    'Puducherry': ['6'],
    'Punjab': ['1'],
    'Rajasthan': ['3'],
    'Sikkim': ['7'],
    'Tamil Nadu': ['6'],
    'Telangana': ['5'],
    'Tripura': ['7'],
    'Uttar Pradesh': ['2'],
    'Uttarakhand': ['2'],
    'West Bengal': ['7']
};
const indianStates = Object.keys(statePinMapping);

const Profile = () => {
    const { token, navigate, backendUrl, setCartItems, setToken } = useContext(ShopContext);

    const [userData, setUserData] = useState({ name: '', email: '', addresses: [] });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressFormData, setAddressFormData] = useState({
        firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: 'India', phone: ''
    });

    const handleAddressChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAddressFormData((data) => ({ ...data, [name]: value }));
    };

    const fetchProfileData = async () => {
        try {
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
            if (response.data.success) {
                setUserData({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    addresses: response.data.user.addresses || []
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [token]);

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.post(
                backendUrl + '/api/user/update-profile',
                { name: userData.name },
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                setIsEditing(false);
                setUserData({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    addresses: response.data.user.addresses || []
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(addressFormData.phone)) {
            return toast.error("Please enter a valid 10-digit mobile number.");
        }

        const zipRegex = /^[0-9]{6}$/;
        if (!zipRegex.test(addressFormData.zipcode)) {
            return toast.error("Please enter a valid 6-digit PIN code.");
        }

        if (!addressFormData.state) {
            return toast.error("Please select a state.");
        }

        const validStartDigits = statePinMapping[addressFormData.state];
        if (validStartDigits && !validStartDigits.includes(addressFormData.zipcode[0])) {
            return toast.error(`The PIN code ${addressFormData.zipcode} does not match the selected state (${addressFormData.state}).`);
        }

        const payloadAddress = {
            ...addressFormData,
            country: 'India',
            phone: '+91' + addressFormData.phone
        };

        try {
            let response;
            if (isEditingAddress) {
                response = await axios.post(
                    backendUrl + '/api/user/update-address',
                    { addressId: editingAddressId, updatedAddress: payloadAddress },
                    { headers: { token } }
                );
            } else {
                response = await axios.post(
                    backendUrl + '/api/user/add-address',
                    { address: payloadAddress },
                    { headers: { token } }
                );
            }
            if (response.data.success) {
                toast.success(response.data.message);
                setUserData({ ...userData, addresses: response.data.addresses });
                setIsAddingAddress(false);
                setIsEditingAddress(false);
                setEditingAddressId(null);
                setAddressFormData({ firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: 'India', phone: '' });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleEditAddress = (addr) => {
        setAddressFormData({
            firstName: addr.firstName,
            lastName: addr.lastName,
            email: addr.email,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipcode: addr.zipcode,
            country: addr.country,
            phone: addr.phone.replace('+91', '')
        });
        setEditingAddressId(addr.id);
        setIsEditingAddress(true);
        setIsAddingAddress(true);
        // Scroll to form
        window.scrollTo({ top: document.querySelector('form')?.offsetTop - 100 || 0, behavior: 'smooth' });
    };

    const handleRemoveAddress = async (addressId) => {
        try {
            const response = await axios.post(
                backendUrl + '/api/user/remove-address',
                { addressId },
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                setUserData({ ...userData, addresses: response.data.addresses });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const logout = () => {
        navigate('/login');
        sessionStorage.removeItem('token');
        setToken('');
        setCartItems({});
    };

    if (loading) {
        return <div className="text-center mt-20 text-gray-500">Loading Profile...</div>;
    }

    return (
        <div className='pt-10 sm:pt-20 px-4 sm:px-[5vw] transition-all duration-700 ease-out opacity-100 pb-24'>
            <div className='max-w-4xl mx-auto'>
                <div className='text-2xl sm:text-3xl font-outfit font-bold tracking-tighter mb-8 sm:mb-12 flex items-center gap-3 sm:gap-4 uppercase'>
                    <span className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-secondary'></span>
                    <Title text1={'MY'} text2={'PROFILE'} />
                </div>

                <div className='glass-card rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/10 p-5 sm:p-12 gold-glow flex flex-col gap-8 sm:gap-10'>
                    {/* Information Card */}
                    <div className='flex flex-col gap-8 sm:gap-10'>
                        <div className='flex items-center gap-3 sm:gap-4'>
                            <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20'>
                                <span className='text-secondary text-base sm:text-xl'>👤</span>
                            </div>
                            <h3 className='text-lg sm:text-2xl font-outfit font-bold text-white uppercase tracking-wider'>My Information</h3>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10'>
                            <div className='flex flex-col gap-2 sm:gap-3'>
                                <p className='text-[8px] sm:text-[10px] font-outfit font-bold text-gray-500 uppercase tracking-[0.3em]'>NAME</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white font-outfit text-sm sm:text-base focus:border-secondary outline-none transition-all'
                                    />
                                ) : (
                                    <p className='text-lg sm:text-xl text-white font-outfit font-bold tracking-tight'>{userData.name}</p>
                                )}
                            </div>

                            <div className='flex flex-col gap-2 sm:gap-3'>
                                <p className='text-[8px] sm:text-[10px] font-outfit font-bold text-gray-500 uppercase tracking-[0.3em]'>EMAIL ADDRESS</p>
                                <p className='text-lg sm:text-xl text-white font-outfit font-bold tracking-tight opacity-70'>{userData.email}</p>
                                <p className='text-[8px] sm:text-[9px] text-gray-500 font-outfit uppercase tracking-widest italic opacity-60'>Your primary account email</p>
                            </div>
                        </div>
                    </div>

                    {/* Edit & Save Controls */}
                    <div className='flex justify-end'>
                        {isEditing ? (
                            <div className='flex gap-4 w-full sm:w-auto'>
                                <button onClick={() => { setIsEditing(false); fetchProfileData(); }} className='flex-1 sm:flex-none px-10 py-4 border border-white/10 text-white rounded-2xl hover:bg-white/5 transition-all font-outfit font-bold text-[10px] uppercase tracking-widest'>CANCEL</button>
                                <button onClick={handleUpdateProfile} className='flex-1 sm:flex-none px-10 py-4 bg-white text-black rounded-2xl hover:bg-secondary transition-all font-outfit font-bold text-[10px] uppercase tracking-widest shadow-xl'>SAVE CHANGES</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className='w-full sm:w-auto px-12 py-4 bg-white text-black rounded-2xl hover:bg-secondary transition-all font-outfit font-bold text-[10px] uppercase tracking-widest shadow-lg'>EDIT PROFILE</button>
                        )}
                    </div>

                    {/* Saved Addresses Section */}
                    <div className='flex flex-col gap-6 sm:gap-8 border-t border-white/5 pt-8 sm:pt-10'>
                        <div className='flex items-center gap-3 sm:gap-4'>
                            <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20'>
                                <span className='text-secondary text-base sm:text-xl'>📍</span>
                            </div>
                            <h3 className='text-lg sm:text-2xl font-outfit font-bold text-white uppercase tracking-wider'>Saved Addresses</h3>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                            {userData.addresses && userData.addresses.map((addr) => (
                                <div key={addr.id} className='bg-white/5 border border-white/10 p-5 sm:p-6 rounded-xl sm:rounded-[1.5rem] flex flex-col justify-between hover:border-secondary/30 transition-all hover:bg-white/[0.07] group'>
                                    <div className='font-outfit'>
                                        <p className='text-white font-bold tracking-wider mb-2 uppercase text-[12px] sm:text-sm'>{addr.firstName} {addr.lastName}</p>
                                        <div className='space-y-1 opacity-70'>
                                            <p className='text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest'>{addr.street}, {addr.city}</p>
                                            <p className='text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wide sm:tracking-widest'>{addr.state}, {addr.country} - {addr.zipcode}</p>
                                            <p className='text-[9px] sm:text-[10px] text-secondary font-bold tracking-widest mt-2 sm:mt-3'>PH: {addr.phone}</p>
                                        </div>
                                    </div>
                                    <div className='flex gap-4 mt-5 sm:mt-6 self-end'>
                                        <button onClick={() => handleEditAddress(addr)} className='text-secondary hover:text-white text-[9px] sm:text-[10px] font-outfit font-bold uppercase tracking-widest transition-colors'>Edit</button>
                                        <button onClick={() => handleRemoveAddress(addr.id)} className='text-red-400/50 hover:text-red-400 text-[9px] sm:text-[10px] font-outfit font-bold uppercase tracking-widest transition-colors'>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isAddingAddress ? (
                            <form onSubmit={handleAddAddress} id="address-form" className='flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-6 bg-white/5 border border-white/10 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] animate-fadeIn'>
                                <p className='font-outfit font-bold text-secondary uppercase tracking-[0.2em] text-[9px] sm:text-[10px] mb-1 sm:mb-2'>{isEditingAddress ? 'Update Address' : 'Add New Address'}</p>
                                <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                                    <input onChange={handleAddressChange} name='firstName' value={addressFormData.firstName} className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl text-white font-outfit text-[10px] sm:text-xs focus:border-secondary outline-none transition-all' type="text" placeholder='FIRST NAME' required />
                                    <input onChange={handleAddressChange} name='lastName' value={addressFormData.lastName} className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl text-white font-outfit text-[10px] sm:text-xs focus:border-secondary outline-none transition-all' type="text" placeholder='LAST NAME' required />
                                </div>
                                <input onChange={handleAddressChange} name='email' value={addressFormData.email} className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl text-white font-outfit text-[10px] sm:text-xs focus:border-secondary outline-none transition-all' type="email" placeholder='EMAIL' required />
                                <input onChange={handleAddressChange} name='street' value={addressFormData.street} className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl text-white font-outfit text-[10px] sm:text-xs focus:border-secondary outline-none transition-all' type="text" placeholder='STREET ADDRESS' required />
                                <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                                    <input onChange={handleAddressChange} name='city' value={addressFormData.city} className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl text-white font-outfit text-[10px] sm:text-xs focus:border-secondary outline-none transition-all' type="text" placeholder='CITY' required />
                                    <select onChange={handleAddressChange} name='state' value={addressFormData.state} className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl text-white font-outfit text-[10px] sm:text-xs focus:border-secondary outline-none transition-all appearance-none cursor-pointer' required>
                                        <option value="" disabled className='bg-black'>SELECT STATE</option>
                                        {indianStates.map(state => (
                                            <option key={state} value={state} className='bg-black'>{state.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                                    <input onChange={handleAddressChange} name='zipcode' value={addressFormData.zipcode} className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl text-white font-outfit text-[10px] sm:text-xs focus:border-secondary outline-none transition-all' type="text" placeholder='ZIP / PIN CODE' required maxLength="6" />
                                    <input name='country' value='INDIA' className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-gray-500 font-outfit text-[8px] sm:text-[10px] tracking-widest outline-none cursor-not-allowed uppercase' type="text" readOnly />
                                </div>
                                <div className='flex gap-2 items-center bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 group focus-within:border-secondary transition-all'>
                                    <span className='text-secondary font-outfit font-bold text-[10px] sm:text-xs tracking-widest'>+91</span>
                                    <input onChange={handleAddressChange} name='phone' value={addressFormData.phone} className='outline-none w-full bg-transparent text-white font-outfit text-[10px] sm:text-xs tracking-[0.2em]' type="text" placeholder='PHONE NUMBER' required maxLength="10" />
                                </div>

                                <div className='flex gap-4 mt-2 sm:mt-4 justify-end'>
                                    <button onClick={() => { setIsAddingAddress(false); setIsEditingAddress(false); setEditingAddressId(null); setAddressFormData({ firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: 'India', phone: '' }); }} type="button" className='px-6 sm:px-10 py-3 sm:py-4 border border-white/10 text-white rounded-xl sm:rounded-2xl hover:bg-white/5 transition-all font-outfit font-bold text-[9px] sm:text-[10px] uppercase tracking-widest'>CANCEL</button>
                                    <button type="submit" className='px-6 sm:px-10 py-3 sm:py-4 bg-white text-black rounded-xl sm:rounded-2xl hover:bg-secondary transition-all font-outfit font-bold text-[9px] sm:text-[10px] uppercase tracking-widest shadow-xl'>{isEditingAddress ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}</button>
                                </div>
                            </form>
                        ) : (
                            <button onClick={() => setIsAddingAddress(true)} className='mt-6 sm:mt-8 px-8 sm:px-10 py-3 sm:py-4 border border-secondary/30 text-secondary rounded-xl sm:rounded-2xl hover:bg-secondary/10 self-start transition-all font-outfit font-bold text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em]'>+ ADD NEW ADDRESS</button>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className='mt-12 sm:mt-16'>
                    <div className='flex items-center gap-4 mb-6 sm:mb-8'>
                        <h3 className='text-lg sm:text-xl font-outfit font-bold text-white uppercase tracking-[0.2em] sm:tracking-[0.3em]'>Account Actions</h3>
                        <div className='flex-1 h-[1px] bg-white/5'></div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                        <div onClick={() => navigate('/orders')} className='glass-card p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] cursor-pointer hover:border-secondary/30 transition-all group flex flex-col justify-between border border-white/5 gold-glow h-40 sm:h-48'>
                            <div>
                                <p className='text-[8px] sm:text-[10px] font-outfit text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold mb-1 sm:mb-2'>ORDER HISTORY</p>
                                <span className='text-2xl sm:text-3xl font-outfit font-bold text-white group-hover:gold-text transition-colors uppercase'>Order History</span>
                            </div>
                            <span className='text-xl sm:text-2xl group-hover:translate-x-4 transition-transform duration-500'>→</span>
                        </div>
                        <div onClick={logout} className='glass-card p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] cursor-pointer hover:border-red-500/30 transition-all group flex flex-col justify-between border border-white/5 h-40 sm:h-48'>
                            <div>
                                <p className='text-[8px] sm:text-[10px] font-outfit text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold mb-1 sm:mb-2'>ACCOUNT SECURITY</p>
                                <span className='text-2xl sm:text-3xl font-outfit font-bold text-red-400'>SIGN OUT</span>
                            </div>
                            <span className='text-xl sm:text-2xl text-red-400 group-hover:translate-x-4 transition-transform duration-500'>→</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
