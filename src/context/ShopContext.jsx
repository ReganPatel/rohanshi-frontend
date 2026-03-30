import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const currency = '₹';
  const delivery_fee = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems, setCartItems] = useState(sessionStorage.getItem('cartItems') ? JSON.parse(sessionStorage.getItem('cartItems')) : {});
  const [wishlist, setWishlist] = useState(sessionStorage.getItem('wishlist') ? JSON.parse(sessionStorage.getItem('wishlist')) : []);
  const [couponCode, setCouponCode] = useState(sessionStorage.getItem('couponCode') ? sessionStorage.getItem('couponCode') : '');
  const [discount, setDiscount] = useState(sessionStorage.getItem('discount') ? Number(sessionStorage.getItem('discount')) : 0);
  const [products, setProducts] = useState([]);
  const [siteConfig, setSiteConfig] = useState(null)
  const [token, setToken] = useState(sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '')
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Axios Interceptor for handling blocked users globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        if (response.data && response.data.success === false && response.data.message === "Your account has been blocked. Please contact support.") {
          setToken("");
          sessionStorage.removeItem("token");
          toast.error("Your account has been blocked. Logging out...");
          navigate("/login");
        }
        return response;
      },
      (error) => {
        if (error.response && error.response.data && error.response.data.message === "Your account has been blocked. Please contact support.") {
          setToken("");
          sessionStorage.removeItem("token");
          toast.error("Your account has been blocked. Logging out...");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, [navigate]);


  const addToCart = async (itemId, size, color) => {

    let productData = products.find((product) => product._id === itemId);

    if (productData && productData.sizes && productData.sizes.length > 0 && !size) {
      toast.error("Please select a size before adding to cart");
      return;
    }

    if (!size) {
      size = "N/A";
    }

    if (productData && productData.colors && productData.colors.length > 0 && !color) {
      toast.error("Please select a colour before adding to cart");
      return;
    }

    if (!color) {
      color = "N/A";
    }

    // Create a composite key for size and color to allow adding different colors of the same size
    const sizeColorKey = `${size}_${color}`;

    let cartData = structuredClone(cartItems);

    let currentQty = 0;
    if (cartData[itemId] && cartData[itemId][sizeColorKey]) {
      currentQty = cartData[itemId][sizeColorKey];
    } else if (cartData[itemId] && cartData[itemId][size]) {
      // Fallback for legacy items without a color key
      currentQty = cartData[itemId][size];
    }

    // Determine the available stock for this specific color/size vs total stock
    let availableStock = productData.stock || 0;
    if (color !== 'N/A' && productData.colorStock && productData.colorStock[color] !== undefined) {
      availableStock = productData.colorStock[color];
    } else if (size !== 'N/A' && productData.sizeStock && productData.sizeStock[size] !== undefined) {
      availableStock = productData.sizeStock[size];
    }

    if (currentQty + 1 > availableStock) {
      if (color !== 'N/A') {
        toast.error(`Cannot add more. Only ${availableStock} left in stock for colour ${color}.`);
      } else {
        toast.error(`Cannot add more. Only ${availableStock} left in stock.`);
      }
      return;
    }

    if (cartData[itemId]) {
      if (cartData[itemId][sizeColorKey]) {
        cartData[itemId][sizeColorKey] += 1;
      }
      else {
        cartData[itemId][sizeColorKey] = 1;
      }
    }
    else {
      cartData[itemId] = {};
      cartData[itemId][sizeColorKey] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {

        await axios.post(backendUrl + '/api/cart/add', { itemId, size: sizeColorKey }, { headers: { token } })

      } catch (error) {
        toast.error(error.message)
      }
    }

  }

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      let productData = products.find((product) => product._id === items);
      if (!productData) continue;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {

        }
      }
    }
    return totalCount;
  }

  const updateQuantity = async (itemId, sizeColorKey, quantity) => {

    let productData = products.find((product) => product._id === itemId);

    // Extract color for stock check
    let color = 'N/A';
    if (sizeColorKey.includes('_')) {
      color = sizeColorKey.split('_')[1];
    }

    let availableStock = productData?.stock || 0;
    if (color !== 'N/A' && productData?.colorStock && productData.colorStock[color] !== undefined) {
      availableStock = productData.colorStock[color];
    } else if (size !== 'N/A' && productData?.sizeStock && productData.sizeStock[size] !== undefined) {
      availableStock = productData.sizeStock[size];
    }

    if (productData && quantity > availableStock) {
      if (color !== 'N/A') {
        toast.error(`Cannot add more. Only ${availableStock} left in stock for colour ${color}.`);
      } else {
        toast.error(`Cannot add more. Only ${availableStock} left in stock.`);
      }
      quantity = availableStock;
    }

    let cartData = structuredClone(cartItems);

    cartData[itemId][sizeColorKey] = quantity;

    setCartItems(cartData);

    if (token) {
      try {

        await axios.post(backendUrl + '/api/cart/update', { itemId, size: sizeColorKey, quantity }, { headers: { token } })

      } catch (error) {
        toast.error(error.message)
      }
    }
  }


  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {

        }
      }
    }
    return totalAmount;
  }

  const getCartMRP = () => {
    let totalMRP = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            // Use originalPrice if available and higher than price, otherwise fallback to price
            let itemMrp = (itemInfo.originalPrice && itemInfo.originalPrice > itemInfo.price) ? itemInfo.originalPrice : itemInfo.price;
            totalMRP += itemMrp * cartItems[items][item];
          }
        } catch (error) {

        }
      }
    }
    return totalMRP;
  }

  const getProductData = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const getSiteConfig = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/siteConfig')
      if (response.data.success) {
        setSiteConfig(response.data.config)
      } else {
        // Site config failed silently
      }
    } catch (error) {
    }
  }

  const getUserCart = async (token) => {
    try {

      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getUserProfile = async (token) => {
    try {
      const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      // Ignore profile errors
    }
  }

  const toggleWishlist = async (itemId) => {
    let wishlistData = [...wishlist];

    // Check if item is already in wishlist
    if (wishlistData.includes(itemId)) {
      // Remove it
      wishlistData = wishlistData.filter(id => id !== itemId);
      setWishlist(wishlistData);

      if (token) {
        try {
          await axios.post(backendUrl + '/api/wishlist/remove', { itemId }, { headers: { token } });
        } catch (error) {
          toast.error(error.message);
        }
      }
    } else {
      // Add it
      wishlistData.push(itemId);
      setWishlist(wishlistData);

      if (token) {
        try {
          await axios.post(backendUrl + '/api/wishlist/add', { itemId }, { headers: { token } });
        } catch (error) {
          toast.error(error.message);
        }
      }
    }
  }

  const getUserWishlist = async (token) => {
    try {
      const response = await axios.post(backendUrl + '/api/wishlist/get', {}, { headers: { token } });
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const getWishlistCount = () => {
    return wishlist.filter(id => products.some(p => p._id === id)).length;
  }

  useEffect(() => {
    getProductData()
    getSiteConfig()
  }, [])

  useEffect(() => {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    sessionStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    sessionStorage.setItem('couponCode', couponCode)
  }, [couponCode])

  useEffect(() => {
    sessionStorage.setItem('discount', discount.toString())
  }, [discount])

  useEffect(() => {
    if (token) {
      getUserCart(token)
      getUserWishlist(token)
      getUserProfile(token)
    } else if (sessionStorage.getItem('token')) {
      const savedToken = sessionStorage.getItem('token');
      setToken(savedToken)
    }
  }, [token])

  // Automatic Coupon Re-validation logic
  useEffect(() => {
    if (couponCode && token) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const cartAmount = getCartAmount();

          if (cartAmount === 0) {
            setCouponCode('');
            setDiscount(0);
            return;
          }

          const response = await axios.post(
            backendUrl + '/api/coupon/validate',
            { code: couponCode, cartAmount },
            { headers: { token } }
          );

          if (!response.data.success) {
            // Coupon no longer valid (e.g., amount fell below minimum purchase requirement)
            setCouponCode('');
            setDiscount(0);
            toast.error(`Coupon removed: ${response.data.message}`);
          } else {
            // Update discount if it changed (essential for percentage-based coupons)
            if (response.data.discount !== Number(discount)) {
              setDiscount(response.data.discount);
            }
          }
        } catch (error) {
          console.error("Coupon auto-validation error:", error);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
    // Also clear coupon if cart is emptied manually but coupon remains
    if (couponCode && Object.keys(cartItems).length === 0) {
      setCouponCode('');
      setDiscount(0);
    }
  }, [cartItems, couponCode, token, products]);

  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, addToCart, setCartItems,
    getCartCount, updateQuantity,
    getCartAmount, getCartMRP, navigate, backendUrl,
    setToken, token, siteConfig,
    wishlist, setWishlist, toggleWishlist, getUserWishlist, getWishlistCount,
    couponCode, setCouponCode, discount, setDiscount,
    userData, setUserData
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )

}

export default ShopContextProvider;
