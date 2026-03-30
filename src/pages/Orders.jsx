import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import TrackingModal from '../components/TrackingModal';
import { assets } from '../assets/assets';

const Orders = () => {

  const { backendUrl, token, currency, addToCart, navigate } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([])
  const [reviewFormVisibleId, setReviewFormVisibleId] = useState(null)
  const [returnFormVisibleId, setReturnFormVisibleId] = useState(null)
  const [trackingModalItem, setTrackingModalItem] = useState(null)
  const [ratingInput, setRatingInput] = useState(5)
  const [commentInput, setCommentInput] = useState('')
  const [returnReason, setReturnReason] = useState('')
  const [returnImages, setReturnImages] = useState([])

  const submitReview = async (productId) => {
    if (!token) return;
    try {
      const response = await axios.post(backendUrl + '/api/product/review', {
        productId,
        rating: ratingInput,
        comment: commentInput
      }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setReviewFormVisibleId(null);
        setCommentInput('');
        setRatingInput(5);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReturnImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      toast.error('You can only upload up to 4 images');
      return;
    }
    setReturnImages(files);
  };

  const requestReturn = async (orderId) => {
    if (!token) return;
    if (!returnReason.trim()) {
      toast.error("Please provide a reason for the return");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('returnReason', returnReason);

      returnImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post(backendUrl + '/api/order/request-return', formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setReturnFormVisibleId(null);
        setReturnReason('');
        setReturnImages([]);
        loadOrderData(); // refresh
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to cancel this order? Any payments will be automatically refunded.")) return;

    try {
      const response = await axios.post(backendUrl + '/api/order/cancel', { orderId }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        loadOrderData(); // refresh
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['deliveryDate'] = order.deliveryDate
            item['orderId'] = order._id
            item['statusHistory'] = order.statusHistory || []
            item['address'] = order.address
            // The API total amount is the whole order's amount, but we might want it per item.
            // Using total order amount for now as per data structure limits.
            item['orderAmount'] = order.amount

            let totalMRP = 0;
            order.items.forEach(oi => {
              totalMRP += (oi.originalPrice || oi.price) * oi.quantity;
            });

            item['totalMRP'] = totalMRP;
            item['subtotal'] = order.subtotal || (order.amount - (order.deliveryFee || 50) + (order.discount || 0)) // Fallback for old orders
            item['discountOnMRP'] = Math.max(0, totalMRP - item['subtotal']);
            item['discountAmount'] = order.discount || 0
            item['deliveryFee'] = order.deliveryFee !== undefined ? order.deliveryFee : 50
            item['couponCode'] = order.couponCode || ""
            item['fullOrderItems'] = order.items

            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse());
      }


    } catch (error) {

    }
  }

  const handleBuyAgain = async (item) => {
    let size = '';
    let color = '';

    // Historical order "size" string actually holds the sizeColorKey (e.g "M_red" or "N/A_blue")
    if (item.size && item.size !== 'N/A') {
      if (item.size.includes('_')) {
        const parts = item.size.split('_');
        size = parts[0] === 'N/A' ? '' : parts[0];
        color = parts[1] === 'N/A' ? '' : parts[1];
      } else {
        size = item.size;
      }
    }

    // Add the specific item (and specific color/size variants) to the cart
    await addToCart(item._id, size, color);
    // Redirect the user to the cart to checkout
    navigate('/cart');
    // Optional feedback to user 
    toast.success(`${item.name} added to cart!`);
  }

  const downloadInvoice = (item) => {
    const logoSrc = assets.logo1.startsWith('data:') ? assets.logo1 : window.location.origin + assets.logo1;
    const invoiceDate = new Date().toLocaleDateString();
    const orderDate = new Date(item.date).toLocaleDateString();

    // Use the full order items if available, else fallback to just this item
    const orderItems = item.fullOrderItems || [item];

    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ${item.orderId}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; position: relative; line-height: 1.5; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
            .title { font-size: 32px; font-weight: bold; color: #111; letter-spacing: -1px; }
            .order-info { color: #666; font-size: 13px; text-align: right; }
            .order-info strong { color: #333; }
            .address-container { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .address-section { width: 45%; font-size: 14px; }
            .address-section h4 { text-transform: uppercase; color: #888; font-size: 11px; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items th { border-bottom: 2px solid #eee; padding: 12px 10px; text-align: left; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
            .items td { border-bottom: 1px solid #eee; padding: 15px 10px; font-size: 14px; }
            .items td strong { display: block; color: #111; }
            .items td small { color: #888; }
            
            .summary-container { display: flex; justify-content: flex-end; }
            .summary-table { width: 300px; }
            .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .summary-row.total { border-top: 2px solid #111; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: bold; color: #111; }
            .summary-label { color: #666; }
            
            .footer { margin-top: 60px; text-align: center; color: #aaa; font-size: 11px; border-top: 1px solid #eee; padding-top: 30px; }
            .payment-method { display: inline-block; background: #f9f9f9; padding: 4px 12px; border-radius: 4px; color: #555; font-weight: bold; margin-top: 10px; }
            
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-30deg);
              opacity: 0.05;
              z-index: -1;
              width: 600px;
              pointer-events: none;
            }
            .logo-top {
              width: 140px;
              height: auto;
              margin-bottom: 10px;
            }
            .mrp-tag { text-decoration: line-through; color: #999; font-size: 12px; margin-right: 5px; }
          </style>
        </head>
        <body>
          <img class="watermark" src="${logoSrc}" alt="" />
          
          <div class="header">
            <div>
              <img class="logo-top" src="${logoSrc}" alt="Logo" />
              <div class="title">TAX INVOICE</div>
            </div>
            <div class="order-info">
              <div><strong>Order ID:</strong> ${item.orderId}</div>
              <div><strong>Order Date:</strong> ${orderDate}</div>
              <div><strong>Invoice Date:</strong> ${invoiceDate}</div>
            </div>
          </div>
          
          <div class="address-container">
            <div class="address-section">
              <h4>Billed To</h4>
              <strong>${item.address ? `${item.address.firstName} ${item.address.lastName}` : 'N/A'}</strong><br>
              ${item.address ? `${item.address.street}<br>${item.address.city}, ${item.address.state} - ${item.address.zipcode}<br>Phone: ${item.address.phone}` : ''}
            </div>
            <div class="address-section" style="text-align: right;">
              <h4>Sold By</h4>
              <strong>Rohanshi's Creation</strong><br>
              India<br>
              GSTIN: Applied For
            </div>
          </div>

          <table class="items">
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map(oi => `
                <tr>
                  <td>
                    <strong>${oi.name}</strong>
                    ${oi.size && oi.size !== 'N/A' ? `<small>Size: ${oi.size}</small>` : ''}
                  </td>
                  <td style="text-align: center;">${oi.quantity}</td>
                  <td style="text-align: right;">
                    ${oi.originalPrice && oi.originalPrice > oi.price ? `<span class="mrp-tag">${currency}${oi.originalPrice}</span>` : ''}
                    ${currency}${oi.price}
                  </td>
                  <td style="text-align: right;">${currency}${oi.price * oi.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-container">
            <div class="summary-table">
              <div class="summary-row">
                <span class="summary-label">MRP</span>
                <span>${currency}${item.totalMRP}</span>
              </div>
              ${item.discountOnMRP > 0 ? `
                <div class="summary-row" style="color: #666;">
                  <span class="summary-label">Product Discount</span>
                  <span>-${currency}${item.discountOnMRP}</span>
                </div>
              ` : ''}
              ${item.discountAmount > 0 ? `
                <div class="summary-row" style="color: #e53e3e;">
                  <span class="summary-label">Coupon Discount ${item.couponCode ? `(${item.couponCode})` : ''}</span>
                  <span>-${currency}${item.discountAmount}</span>
                </div>
              ` : ''}
              <div class="summary-row">
                <span class="summary-label">Shipping Charges</span>
                <span>${currency}${item.deliveryFee}</span>
              </div>
              <div class="summary-row total">
                <span>Total Amount</span>
                <span>${currency}${item.orderAmount}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Rohanshi's Creation!</p>
            <div class="payment-method">Payment via ${item.paymentMethod}</div>
            <p style="margin-top: 20px;">This is a computer generated invoice and does not require a physical signature.</p>
          </div>
          
          <script>
            window.onload = function() { 
              setTimeout(function() {
                window.print(); 
              }, 500);
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='pt-20 px-4 sm:px-[5vw] transition-all duration-700 ease-out opacity-100'>

      <div className='text-3xl font-outfit font-bold tracking-tighter mb-12 flex items-center gap-4 uppercase'>
        <span className='w-12 h-[2px] bg-secondary'></span>
        <Title text1={'ORDER'} text2={'HISTORY'} />
      </div>

      <div className='flex flex-col gap-8'>
        {orderData.map((item, index) => {

          // Calculate delivery window info
          const deliveryTime = item.deliveryDate || item.date;
          const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
          const isWithinReturnWindow = (Date.now() - deliveryTime) <= sevenDaysInMillis;
          const expiryDate = new Date(deliveryTime + sevenDaysInMillis).toDateString();

          return (
            <React.Fragment key={index}>
              <div className='glass-card rounded-[2.5rem] border border-white/10 flex flex-col lg:flex-row gap-8 p-6 lg:p-10 gold-glow group hover:border-secondary/30 transition-all duration-500'>

                {/* LEFT COLUMN: Product, Timeline, Actions */}
                <div className='flex-1 border-r-0 lg:border-r border-white/5 lg:pr-10'>
                  {/* Product Header */}
                  <div className='flex gap-6 items-start pb-8 border-b border-white/5'>
                    <div className='flex-1'>
                      <p className='text-[10px] font-outfit uppercase tracking-[0.3em] text-secondary mb-2 font-bold'>The Excellence Collection</p>
                      <h3 className='text-2xl font-outfit font-bold text-white leading-tight uppercase tracking-tight mb-2 group-hover:gold-text transition-colors'>{item.name}</h3>
                      <div className='flex flex-wrap items-center gap-4 mt-1'>
                        {item.size !== 'N/A' && (
                          <span className='px-3 py-1 rounded-full bg-white/5 text-[10px] font-outfit uppercase tracking-widest text-gray-400 border border-white/5'>
                            SIZE: {item.size}
                          </span>
                        )}
                        <span className='px-3 py-1 rounded-full bg-white/5 text-[10px] font-outfit uppercase tracking-widest text-gray-400 border border-white/5'>
                          QTY: {item.quantity}
                        </span>
                        <span className='px-3 py-1 rounded-full bg-indigo-500/10 text-[10px] font-outfit uppercase tracking-widest text-indigo-400 border border-indigo-500/20'>
                          ORDER ID: {item.orderId}
                        </span>
                      </div>
                      <p className='text-3xl font-outfit font-bold text-secondary mt-6 tracking-tighter uppercase'>₹{item.price}</p>
                    </div>
                    <div className='relative w-32 h-40 rounded-2xl overflow-hidden border border-white/10 shrink-0'>
                      <img className='w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110' src={item.image[0]} alt="" />
                    </div>
                  </div>

                  {/* Horizontal Visual Status Stepper */}
                  <div className='py-12 border-b border-white/5 relative px-2 sm:px-6'>
                    {(() => {
                      const returnStatuses = ['Return Requested', 'Initiated', 'Dropped off', 'Received', 'Refund Issued', 'Refund Credited', 'Return Canceled'];
                      const isReturn = returnStatuses.includes(item.status);

                      const steps = isReturn
                        ? ['Requested', 'Approved', 'Picked Up', 'Refunded']
                        : ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];

                      let currentStepIndex = -1;
                      if (isReturn) {
                        currentStepIndex = item.status === 'Return Canceled' ? 0 : (item.status === 'Refund Credited' || item.status === 'Refund Issued' ? 3 : (item.status === 'Received' || item.status === 'Dropped off' ? 2 : (item.status === 'Initiated' ? 1 : 0)));
                      } else {
                        currentStepIndex = steps.indexOf(item.status);
                        // Handle legacy or unknown statuses
                        if (currentStepIndex === -1 && item.status === 'Delivered') currentStepIndex = 4;
                        if (currentStepIndex === -1 && item.status === 'Ready to Ship') currentStepIndex = 1;
                      }

                      const progressWidth = (currentStepIndex / (steps.length - 1)) * 100;
                      const activeColor = item.status === 'Return Canceled' ? 'bg-red-500' : (isReturn ? 'bg-orange-500' : 'bg-secondary');

                      return (
                        <div className="flex flex-col gap-10">
                          <div className="flex items-center justify-between w-full relative">
                            {/* Background Line */}
                            <div className="absolute top-1/2 left-1 right-1 h-[2px] bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
                              {/* Success Progress Line */}
                              <div
                                className={`absolute top-0 left-0 h-full ${activeColor} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(212,175,55,0.2)]`}
                                style={{ width: `${progressWidth}%` }}
                              ></div>
                            </div>

                            {/* Milestone Dots */}
                            {steps.map((step, idx) => {
                              const isCompleted = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;

                              return (
                                <div key={idx} className="relative z-10 flex flex-col items-center">
                                  {/* Milestone Circle */}
                                  <div className={`w-4 h-4 rounded-full transition-all duration-700 flex items-center justify-center border-2 border-background 
                                    ${isCompleted ? `${activeColor} ${isCurrent ? 'animate-pulse scale-125' : ''}` : 'bg-white/10 opacity-50'}`}
                                  >
                                    {isCompleted && (
                                      <svg className="w-1.5 h-1.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>

                                  {/* Milestone Label */}
                                  <div className="absolute top-7 whitespace-nowrap flex flex-col items-center gap-1 group">
                                    <p className={`text-[7px] sm:text-[9px] font-outfit font-bold uppercase tracking-widest transition-all duration-500 text-center
                                        ${isCompleted ? 'text-white' : 'text-gray-600'}`}
                                    >
                                      {step.replace('Out for delivery', 'Out for Del')}
                                    </p>
                                    {isCurrent && (
                                      <span className={`h-[2px] w-4 rounded-full ${activeColor} animate-pulse`}></span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className='flex items-center gap-4'>
                              <div className={`w-2 h-2 rounded-full ${isReturn ? (item.status === 'Return Canceled' ? 'bg-red-500' : 'bg-orange-500') : 'bg-secondary'} animate-pulse`}></div>
                              <p className='text-[10px] sm:text-xs font-outfit font-bold text-white tracking-[0.2em] uppercase'>
                                {item.status === 'Refund Credited' ? 'REFUNDED' : (item.status === 'Return Canceled' ? 'RETURN REJECTED' : (item.status === 'Out for delivery' ? 'OUT FOR DELIVERY' : item.status))}
                              </p>
                            </div>
                            <button onClick={() => setTrackingModalItem(item)} className='text-secondary font-outfit font-bold text-[9px] sm:text-[10px] tracking-widest uppercase hover:gap-3 transition-all flex items-center gap-2'>
                              More Details <span className='text-xs'>→</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {isWithinReturnWindow && item.status === 'Delivered' && (
                      <div className='flex items-center gap-3 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5'>
                        <span className='text-secondary text-lg'>✨</span>
                        <p className='text-[10px] text-gray-400 font-outfit uppercase tracking-widest leading-relaxed'>
                          Return period valid through <span className='text-white font-bold'>{expiryDate}</span>
                        </p>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className='flex flex-wrap gap-3 mt-6'>
                      {item.status === 'Delivered' && isWithinReturnWindow && (
                        <button
                          onClick={() => {
                            setReturnFormVisibleId(returnFormVisibleId === index ? null : index);
                            setReviewFormVisibleId(null);
                          }}
                          className='flex-1 min-w-[120px] py-4 rounded-xl glass-card text-[10px] font-outfit font-bold text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/5'>
                          Request Return
                        </button>
                      )}
                      {['Order Placed', 'Packing'].includes(item.status) && (
                        <button
                          onClick={() => cancelOrder(item.orderId)}
                          className='flex-1 min-w-[120px] py-4 rounded-xl glass-card text-[10px] font-outfit font-bold text-red-400 uppercase tracking-[0.2em] hover:bg-red-400/10 transition-all border border-red-400/10'>
                          Cancel Order
                        </button>
                      )}
                      <button onClick={() => handleBuyAgain(item)} className='flex-1 min-w-[120px] py-4 rounded-xl bg-white text-black text-[10px] font-outfit font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all'>
                        Buy Again
                      </button>
                    </div>
                  </div>

                  {/* Rate Experience Section */}
                  {item.status === 'Delivered' && (
                    <div className='pt-8'>
                      <h4 className='font-outfit font-bold text-[10px] tracking-[0.3em] text-white uppercase mb-5'>Share Your Experience</h4>
                      <button
                        onClick={() => {
                          setReviewFormVisibleId(reviewFormVisibleId === index ? null : index);
                          setReturnFormVisibleId(null);
                        }}
                        className='w-full glass-card rounded-2xl p-5 text-gray-500 hover:text-white transition-all flex items-center justify-between border border-white/5 hover:border-secondary/30 group'
                      >
                        <div className='flex items-center gap-4'>
                          <span className='bg-white/5 px-3 py-2 rounded-xl text-xs group-hover:bg-secondary/20 group-hover:text-secondary transition-all'>★</span>
                          <span className='text-xs font-outfit font-bold uppercase tracking-widest'>Write a Review</span>
                        </div>
                        <span className='text-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all'>→</span>
                      </button>
                    </div>
                  )}

                  {/* Collapsible Forms inside Left Column */}

                  {/* Review Form */}
                  {reviewFormVisibleId === index && (
                    <div className='pt-8 pb-4 w-full animate-fadeIn'>
                      <div className='glass-card rounded-[2rem] p-8 border border-white/5'>
                        <h3 className='text-lg font-outfit font-bold text-white uppercase tracking-widest mb-6'>Write a Review</h3>
                        <div className='flex flex-col gap-3 mb-6'>
                          <label className='text-[10px] font-outfit font-bold text-gray-500 uppercase tracking-widest'>RATING</label>
                          <select value={ratingInput} onChange={(e) => setRatingInput(Number(e.target.value))} className='w-full px-5 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-outfit focus:border-secondary outline-none transition-all'>
                            <option value="5" className='bg-black'>5 STARS - EXCELLENT</option>
                            <option value="4" className='bg-black'>4 STARS - VERY GOOD</option>
                            <option value="3" className='bg-black'>3 STARS - GOOD</option>
                            <option value="2" className='bg-black'>2 STARS - POOR</option>
                            <option value="1" className='bg-black'>1 STAR - VERY POOR</option>
                          </select>
                        </div>
                        <div className='flex flex-col gap-3 mb-8'>
                          <label className='text-[10px] font-outfit font-bold text-gray-500 uppercase tracking-widest'>YOUR REVIEW</label>
                          <textarea value={commentInput} onChange={(e) => setCommentInput(e.target.value)} required className='w-full px-5 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-outfit focus:border-secondary outline-none transition-all resize-none' rows="4" placeholder="Share your detailed experience with this product..." />
                        </div>
                        <button onClick={() => submitReview(item._id)} className='bg-white text-black px-12 py-4 rounded-xl font-outfit font-bold text-xs uppercase tracking-[0.2em] hover:bg-secondary transition-all w-full sm:w-fit'>
                          SEND REVIEW
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Return Form */}
                  {returnFormVisibleId === index && (
                    <div className='pt-8 pb-4 w-full animate-fadeIn'>
                      <div className='glass-card rounded-[2rem] p-8 border border-red-500/10'>
                        <h3 className='text-lg font-outfit font-bold text-red-400 uppercase tracking-widest mb-4'>Start Return</h3>
                        <p className='text-[10px] text-gray-500 font-outfit leading-relaxed uppercase tracking-widest mb-8'>Tell us why you're returning the item. Returns are accepted within 7 days of delivery.</p>
                        <div className='flex flex-col gap-3 mb-6'>
                          <label className='text-[10px] font-outfit font-bold text-gray-500 uppercase tracking-widest'>REASON FOR RETURN *</label>
                          <textarea value={returnReason} onChange={(e) => setReturnReason(e.target.value)} required className='w-full px-5 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-outfit focus:border-red-400 outline-none transition-all resize-none' rows="4" placeholder="Briefly describe why you are returning this item..." />
                        </div>
                        <div className='flex flex-col gap-4 mb-8'>
                          <label className='text-[10px] font-outfit font-bold text-gray-500 uppercase tracking-widest'>UPLOAD IMAGES (MAX 4)</label>
                          <input type="file" multiple accept="image/*" onChange={handleReturnImageChange} className='w-full px-5 py-4 bg-white/5 rounded-2xl border border-white/10 text-gray-400 font-outfit text-xs file:mr-6 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer' />
                          {returnImages.length > 0 && <p className='text-[10px] text-secondary font-bold tracking-widest uppercase'>{returnImages.length} PHOTO(S) ATTACHED</p>}
                        </div>
                        <button onClick={() => requestReturn(item.orderId)} className='bg-red-500 text-white px-12 py-4 rounded-xl font-outfit font-bold text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all w-full sm:w-fit'>
                          SEND REQUEST
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* RIGHT COLUMN: Delivery details, Price details */}
                <div className='w-full lg:w-96 shrink-0 flex flex-col gap-6'>
                  <div className='glass-card border border-white/5 p-8 rounded-[2rem]'>
                    <h4 className='font-outfit font-bold text-[10px] tracking-[0.3em] text-white uppercase mb-6 flex items-center gap-3'>
                      <span className='w-6 h-[1px] bg-secondary'></span> DELIVERY ADDRESS
                    </h4>
                    {item.address && (
                      <div className='text-xs text-gray-400 space-y-4 font-outfit tracking-wider leading-relaxed'>
                        <div className='flex items-start gap-4'>
                          <span className='text-secondary'>◈</span>
                          <div className='flex flex-col gap-1'>
                            <span className='font-bold text-white uppercase'>{item.address.firstName} {item.address.lastName}</span>
                            <p className='opacity-80'>{item.address.street}, {item.address.city}, {item.address.state} - {item.address.zipcode}</p>
                          </div>
                        </div>
                        <div className='flex items-center gap-4'>
                          <span className='text-secondary'>◈</span>
                          <p className='font-bold text-white tracking-[0.2em]'>{item.address.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='glass-card border border-white/5 p-8 rounded-[2rem] flex flex-col gold-glow'>
                    <h4 className='font-outfit font-bold text-[10px] tracking-[0.3em] text-white uppercase mb-6 flex items-center gap-3'>
                      <span className='w-6 h-[1px] bg-secondary'></span> SUMMARY
                    </h4>

                    <div className='space-y-4 mb-8'>
                      <div className='flex justify-between text-[10px] font-outfit text-gray-400 tracking-[0.2em] uppercase'>
                        <p>Price</p>
                        <p>₹{item.price}</p>
                      </div>
                      <div className='flex justify-between text-[10px] font-outfit text-gray-400 tracking-[0.2em] uppercase'>
                        <p>Qty</p>
                        <p>{item.quantity}</p>
                      </div>
                      <div className='pt-4 border-t border-white/5 flex justify-between font-outfit font-bold text-white tracking-[0.2em] uppercase'>
                        <p className='text-secondary'>Subtotal</p>
                        <p className='text-xl'>₹{item.price * item.quantity}</p>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 mb-8'>
                      <p className='text-[8px] font-outfit font-bold text-gray-500 uppercase tracking-widest'>PAYMENT METHOD</p>
                      <p className='text-[10px] font-outfit font-bold text-white tracking-[0.2em] uppercase'>{item.paymentMethod}</p>
                    </div>

                    <button onClick={() => downloadInvoice(item)} className='w-full py-5 rounded-2xl glass-card text-[10px] font-outfit font-bold text-white uppercase tracking-[0.3em] hover:bg-white/10 transition-all border border-white/10 flex justify-center items-center gap-3 mt-auto'>
                      INVOICE <span className='text-xs'>↓</span>
                    </button>
                  </div>
                </div>

              </div>

            </React.Fragment>
          );
        })}
      </div>

      {/* Tracking History Modal overlay */}
      <TrackingModal
        isOpen={!!trackingModalItem}
        onClose={() => setTrackingModalItem(null)}
        item={trackingModalItem}
      />

    </div>
  )
}

export default Orders