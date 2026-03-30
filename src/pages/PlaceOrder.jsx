import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('razorpay');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, discount, setDiscount, couponCode, setCouponCode } = useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!token) return;
        const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
        if (response.data.success) {
          setAddresses(response.data.user.addresses || []);
          if (response.data.user.addresses && response.data.user.addresses.length > 0) {
            setSelectedAddressIndex(0);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddresses();
  }, [token, backendUrl]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (addresses.length === 0 || selectedAddressIndex === null) {
        toast.error("Please select a delivery address");
        return;
      }

      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: addresses[selectedAddressIndex],
        items: orderItems,
        amount: getCartAmount() === 0 ? 0 : Math.max(0, getCartAmount() - discount) + delivery_fee,
        couponCode: couponCode || ''
      }

      switch (method) {

        //API Calls for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (response.data.success) {
            setCartItems({})
            setCouponCode('')
            setDiscount(0)
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
          if (responseRazorpay.data.success) {
            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID,
              amount: responseRazorpay.data.order.amount,
              currency: responseRazorpay.data.order.currency,
              name: "Premium Jewelry",
              description: "Payment",
              order_id: responseRazorpay.data.order.id,
              receipt: responseRazorpay.data.order.receipt,
              handler: async (response) => {
                try {
                  const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } })
                  if (data.success) {
                    navigate('/orders')
                    setCartItems({})
                    setCouponCode('')
                    setDiscount(0)
                    toast.success("Order Placed Successfully")
                  } else {
                    toast.error(data.message)
                  }
                } catch (error) {
                  console.log(error)
                  toast.error(error.message)
                }
              },
              modal: {
                ondismiss: async () => {
                  try {
                    await axios.post(backendUrl + '/api/order/cancel-razorpay', { razorpay_order_id: responseRazorpay.data.order.id }, { headers: { token } })
                    toast.error("Payment Cancelled")
                  } catch (error) {
                    console.log(error)
                  }
                }
              }
            }
            const rzp = new window.Razorpay(options)
            rzp.open()
          } else {
            toast.error(responseRazorpay.data.message)
          }
          break;

        default:
          break;
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-8 sm:gap-16 pt-5 sm:pt-14 min-h-[80vh] border-t border-white/5 px-4 sm:px-[5vw] mb-24'>
      {/*---------------- Left Side ------------------*/}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='flex items-center gap-4 mb-6 sm:mb-8'>
          <h3 className='text-xl sm:text-2xl font-outfit font-bold text-white uppercase tracking-tighter'>Shipping Address</h3>
          <div className='flex-1 h-[1px] bg-secondary/30'></div>
        </div>
        {addresses.length === 0 ? (
          <div className='glass-card p-10 rounded-[2.5rem] flex flex-col items-center gap-6 mt-4 border border-white/5 gold-glow'>
            <div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl opacity-50'>📍</div>
            <p className='text-gray-400 text-center font-outfit uppercase tracking-widest text-sm'>No saved addresses found.</p>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className='px-8 py-3 bg-white text-black rounded-xl font-outfit font-bold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-lg'
            >
              Add Address in Profile
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-4 mt-4'>
            {addresses.map((addr, index) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddressIndex(index)}
                className={`glass-card p-6 rounded-[2rem] cursor-pointer transition-all duration-500 border relative overflow-hidden group ${selectedAddressIndex === index ? 'border-secondary bg-secondary/5 gold-glow' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
              >
                {selectedAddressIndex === index && (
                  <div className='absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-full -mr-10 -mt-10 blur-2xl'></div>
                )}
                <div className='flex items-center gap-4 mb-4'>
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center transition-colors ${selectedAddressIndex === index ? 'border-secondary bg-secondary' : 'border-white/20'}`}>
                    {selectedAddressIndex === index && <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black'></div>}
                  </div>
                  <p className={`font-outfit font-bold text-base sm:text-lg uppercase tracking-tight transition-colors ${selectedAddressIndex === index ? 'text-secondary' : 'text-white'}`}>
                    {addr.firstName} {addr.lastName}
                  </p>
                </div>
                <div className='space-y-1 pl-9 opacity-70 group-hover:opacity-100 transition-opacity'>
                  <p className='text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed'>{addr.street}, {addr.city}</p>
                  <p className='text-[11px] text-gray-400 uppercase tracking-widest'>{addr.state}, {addr.country} - {addr.zipcode}</p>
                  <p className='text-[10px] text-secondary font-bold tracking-[0.2em] mt-3 font-outfit'>PH: {addr.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/*---------------- Right Side ------------------*/}
      <div className='w-full sm:max-w-[450px]'>

        <div className='mt-8'>
          <CartTotal />
        </div>

        <div className='mt-12 sm:mt-16'>
          <div className='flex items-center gap-4 mb-6 sm:mb-8'>
            <h3 className='text-xl sm:text-2xl font-outfit font-bold text-white uppercase tracking-tighter'>Payment</h3>
            <div className='flex-1 h-[1px] bg-secondary/30'></div>
          </div>

          <div className='flex flex-col gap-4'>
            <div
              onClick={() => setMethod('razorpay')}
              className={`glass-card p-5 sm:p-6 rounded-xl sm:rounded-[1.5rem] cursor-pointer transition-all duration-500 border flex items-center justify-between group ${method === 'razorpay' ? 'border-secondary bg-secondary/5 gold-glow' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
            >
              <div className='flex items-center gap-4'>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${method === 'razorpay' ? 'border-secondary bg-secondary' : 'border-white/20'}`}>
                  {method === 'razorpay' && <div className='w-2 h-2 rounded-full bg-black'></div>}
                </div>
                <img className='h-5 filter brightness-110' src={assets.razorpay_logo} alt="Razorpay" />
              </div>
              <p className='text-[10px] font-outfit font-bold text-secondary uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity'>Secure Gateway</p>
            </div>
          </div>

          <div className='w-full mt-12'>
            <button type='submit' className='premium-button w-full sm:w-auto sm:px-20 py-5 text-sm uppercase tracking-[0.5em] shadow-[0_20px_40px_rgba(0,0,0,0.3)]'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder