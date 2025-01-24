import React, { useState, useEffect } from "react";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import emptyCart from '../../Images/empty_cart.webp';
import { Link } from 'react-router-dom';
import Homepage from '../../../pages/user/homepage';


const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voucher, setVoucher] = useState('');
  const [discountInfo, setDiscountInfo] = useState({
    code: '',
    percentage: 0,
    message: ''
  });

  useEffect(() => {
    console.log(cartItems); 
    const fetchCartItems = async () => {
      try {
        // Mock cart data (unchanged)
        const cartData = {
          id: 159252,
          title: "Notebook ",
          body_html: "\u003Cp\u003ECategory: Stationery, Rating: 4.1, Price: 429\u003C/p\u003E",
          vendor: "",
          product_type: "Stationery",
          created_at: "2025-01-17T09:42:14.285Z",
          handle: "notebook-",
          updated_at: "2025-01-17T09:42:14.293Z",
          tags: "",
          status: "active",
          variants: [
            {
              id: 159252,
              title: "Default Variant",
              price: "429",
              sku: "SKU-159252",
              created_at: "2025-01-17T09:42:14.293Z",
              updated_at: "2025-01-17T09:42:14.293Z",
              taxable: true,
              grams: "",
              image: {
                src: "https://i.etsystatic.com/19893040/r/il/0ddcd7/3907960016/il_570xN.3907960016_ej9x.jpg",
              },
              weight: "",
              weight_unit: "",
            },
          ],
          image: {
            src: "https://i.etsystatic.com/19893040/r/il/0ddcd7/3907960016/il_570xN.3907960016_ej9x.jpg",
          },
        };
    
        // Process the mock cart data
        const products = [
          {
            id: cartData.id,
            title: cartData.title,
            price: cartData.variants[0].price,
            quantity: 1, // Default quantity for mock data
            image: cartData.image.src,
          },
        ];
    
        // Update state with cart items
        setCartItems(products);
        setLoading(false);
      } catch (err) {
        setError("Error fetching cart items");
        setLoading(false);
      }
    };
    
    

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (itemId, change) => {
    const item = cartItems.find(item => item._id === itemId);
    const newQuantity = item.quantity + change;
  
    if (newQuantity >= 1) {
      // Update the quantity in the UI immediately
      const updatedItems = cartItems.map(item => {
        if (item._id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedItems);
  
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await fetch('https://api.merabestie.com/cart/update-quantity', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            productId: item.productId,
            productQty: newQuantity
          })
        });
  
        const data = await response.json();
        if (!data.success) {
          console.error('Failed to update quantity:', data.message);
          // Note: We're not reverting the UI change here
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
        // Note: We're not reverting the UI change here
      }
    }
  };
  
  
  const handleRemoveItem = async (itemId) => {
    const item = cartItems.find(item => item._id === itemId);
  
    // Immediately update the UI by removing the item
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
  
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await fetch('https://api.merabestie.com/cart/delete-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          productId: item.productId
        })
      });
      
      const data = await response.json();
      if (!data.success) {
        console.error('Failed to remove item from server:', data.message);
        // Note: We're not reverting the UI change here
      }
    } catch (err) {
      console.error('Error removing item:', err);
      // Note: We're not reverting the UI change here
    }
  };
  

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity);
    }, 0);
    const discountedTotal = subtotal * (1 - (discountInfo.percentage / 100));
    return discountedTotal.toFixed(2);
  };

  const handleVoucherRedeem = async () => {
    try {
      const response = await fetch('https://api.merabestie.com/coupon/verify-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: voucher
        })
      });

      const data = await response.json();

      if (data.message === 'Invalid coupon code') {
        setDiscountInfo({
          code: '',
          percentage: 0,
          message: 'Invalid coupon code'
        });
      } else if (data.discountPercentage) {
        setDiscountInfo({
          code: voucher,
          percentage: data.discountPercentage,
          message: `${data.discountPercentage}% discount applied!`
        });
      }
    } catch (err) {
      console.error('Error verifying coupon:', err);
      setDiscountInfo({
        code: '',
        percentage: 0,
        message: 'Error verifying coupon'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
        <img src={emptyCart} alt="Empty Cart" className="w-48 h-48 mb-4" />
        <p className="text-lg text-gray-600 mb-4">{error || 'Your cart is empty'}</p>
        <Link 
          to="/HomePage" 
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Transform function for mydata
function transformData(mydata) {
  return {
      cart_data: {
          items: mydata.map(item => ({
              variant_id: item.variant_id,
              quantity: item.quantity
          }))
      },
      redirect_url: "https://your-domain.requestcatcher.com/?=anyparam=anyvalue&more=2",
      timestamp: new Date().toISOString()
  };
}

  // ------------------------------------------------------------------------
  // const handleCheckout = async (event) => {
  //   const userId = sessionStorage.getItem('userId');
  //   // if (!userId) {
  //   //   alert('Please log in to proceed.');
  //   //   return;
  //   // }
  
  //   // Transform cart data
  //   const mydata = 
  //    cartItems.map(item => ({
  //       variant_id: item.productId,
  //       quantity: item.quantity || 1
  //     }));
        
    

  //   console.log("my data  : ", mydata); 
  
  //   // try {
  //   //   // Send transformed data to the /shiprocketapi endpoint

  //   //   const response = await fetch('http://localhost:5000/shiprocketapi', { 
  //   //     method: 'POST',
  //   //     headers: {
  //   //       "Content-Type": 'application/json',
  //   //     },
  //   //     body: JSON.stringify({
  //   //       // userId: userId, // Use the actual userId from sessionStorage
  //   //       // cart_data: transformedCartData.cart_data.items, // Send the transformed cart data
  //   //       // transformedCartData

  //   //       cart_data: mydata ,
  //   //       // redirect_url: transformedCartData.redirect_url,
  //   //       // timestamp: transformedCartData.timestamp,
  //   //     })
  //   //   });
  
  //   //   const data = await response.json();
  //   //   console.log(data); 

  //   //   // var response1 = await fetch('https://checkout-api.shiprocket.com/api/v1/custom-platform-order/details', { 
  //   //   //   method: 'POST',
  //   //   //   headers: {
  //   //   //     'token': data.token,
  //   //   //     'X-Api-Key': 'H3E8hebrr7oZFnVV',
  //   //   //     'X-Api-HMAC-SHA256': 'FYttb1JEV3KL0iaqcA30FkNE1665aPThcHX37J4sWvo=',
  //   //   //     'Content-Type': 'application/json',
  //   //   //   },
  //   //   //   body: JSON.stringify({
  //   //   //     order_id: "65a000df3fc6c468b9da1f53",
  //   //   //     timestamp: transformedCartData.timestamp,
  //   //   //   })
  //   //   // });
  
  //   //   // const data1 = await response1.json();
  //   //   // alert("hello...");
  //   //   if (data.ok) {
  //   //     // console.log("Generated token : ", data.token); 
  //   //     // alert(data.token);
  //   //     window.HeadlessCheckout.addToCart(event, data.token, {fallbackUrl: "https://your.fallback.com?product=123"});
  //   //     // Redirect or update UI as needed
  //   //   } else {
  //   //     alert(`Failed to place order: ${data.message}`);
  //   //   }
  //   // } catch (error) {
  //   //   console.error('Error during checkout:', error);
  //   //   alert('An error occurred during checkout. Please try again.');
  //   // }

  //   try {
  //     const transformedData = transformData(mydata);
  
  //     const response = await fetch('http://localhost:5000/shiprocketapi', { 
  //         method: 'POST',
  //         headers: {
  //             "Content-Type": 'application/json',
  //         },
  //         body: JSON.stringify(transformedData)
  //     });
  
  //     const myresponse = await response.json() ;
  //     console.log("this was received : ", myresponse.token); 
  //     window.HeadlessCheckout.addToCart( event , myresponse.token, {fallbackUrl: "https://your.fallback.com?product=123"});
  // } catch (error) {
  //     console.error('Error sending request:', error);
  // }
  
  // };
  


  const handleCheckout = async (event) => {
    const userId = sessionStorage.getItem('userId');
    // if (!userId) {
    //   alert('Please log in to proceed.');
    //   return;
    // }
  
    // Transform cart data
    const mydata = 
     cartItems.map(item => ({
        variant_id: item.productId,
        quantity: item.quantity || 1
      }));
        
    

    console.log("my data  : ", mydata); 
  
    // try {
    //   // Send transformed data to the /shiprocketapi endpoint

    //   const response = await fetch('http://localhost:5000/shiprocketapi', { 
    //     method: 'POST',
    //     headers: {
    //       "Content-Type": 'application/json',
    //     },
    //     body: JSON.stringify({
    //       // userId: userId, // Use the actual userId from sessionStorage
    //       // cart_data: transformedCartData.cart_data.items, // Send the transformed cart data
    //       // transformedCartData

    //       cart_data: mydata ,
    //       // redirect_url: transformedCartData.redirect_url,
    //       // timestamp: transformedCartData.timestamp,
    //     })
    //   });
  
    //   const data = await response.json();
    //   console.log(data); 

    //   // var response1 = await fetch('https://checkout-api.shiprocket.com/api/v1/custom-platform-order/details', { 
    //   //   method: 'POST',
    //   //   headers: {
    //   //     'token': data.token,
    //   //     'X-Api-Key': 'H3E8hebrr7oZFnVV',
    //   //     'X-Api-HMAC-SHA256': 'FYttb1JEV3KL0iaqcA30FkNE1665aPThcHX37J4sWvo=',
    //   //     'Content-Type': 'application/json',
    //   //   },
    //   //   body: JSON.stringify({
    //   //     order_id: "65a000df3fc6c468b9da1f53",
    //   //     timestamp: transformedCartData.timestamp,
    //   //   })
    //   // });
  
    //   // const data1 = await response1.json();
    //   // alert("hello...");
    //   if (data.ok) {
    //     // console.log("Generated token : ", data.token); 
    //     // alert(data.token);
    //     window.HeadlessCheckout.addToCart(event, data.token, {fallbackUrl: "https://your.fallback.com?product=123"});
    //     // Redirect or update UI as needed
    //   } else {
    //     alert(`Failed to place order: ${data.message}`);
    //   }
    // } catch (error) {
    //   console.error('Error during checkout:', error);
    //   alert('An error occurred during checkout. Please try again.');
    // }

    try {
      const transformedData = transformData(mydata);
  
      const response = await fetch('http://localhost:5000/shiprocketapi', { 
          method: 'POST',
          headers: {
              "Content-Type": 'application/json',
          },
          body: JSON.stringify(transformedData)
      });
  
      const myresponse = await response.json() ;
      console.log("this was received : ", myresponse.token); 
      window.HeadlessCheckout.addToCart( event , myresponse.token, {fallbackUrl: "https://your.fallback.com?product=123"});
  } catch (error) {
      console.error('Error sending request:', error);
  }
  
  };
  //------------------------------------------------------------------------------------------------ 

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
        </div>
        <div className="p-4 space-y-4">
  {cartItems.map((item) => (
    <div
      key={item.id} // Updated to match the mock data's `id` field
      className="flex flex-col md:flex-row items-center justify-between border-b pb-4 last:border-b-0"
    >
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={item.img ? item.img[0] || item.img : "https://i.etsystatic.com/19893040/r/il/0ddcd7/3907960016/il_570xN.3907960016_ej9x.jpg"} // Added fallback for missing image
            alt={item.title} // Changed to match `title` field from mock data
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <h3 className="font-semibold text-base">{item.title}</h3> {/* Updated to match `title` */}
            <p className="text-sm text-gray-500">{item.description || "No description available"}</p> {/* Fallback for description */}
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full mt-4 md:mt-0">
            <span className="font-medium text-base">₹{item.price}</span>

            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantityChange(item.id, -1)} // Updated to match `id`
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faMinus} className="text-sm" />
              </button>
              <input
                type="text"
                value={item.quantity} // Updated to use `quantity` field
                readOnly
                className="w-12 text-center border-none text-sm"
              />
              <button
                onClick={() => handleQuantityChange(item.id, 1)} // Updated to match `id`
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faPlus} className="text-sm" />
              </button>
            </div>

            <button
              onClick={() => handleRemoveItem(item.id)} // Updated to match `id`
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              className="flex-grow border rounded-md px-3 py-2"
            />
            <button 
              className="w-full md:w-auto bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600" 
              onClick={handleVoucherRedeem}
            >
              Redeem
            </button>
          </div>
          
          {discountInfo.message && (
            <div className={`text-sm ${discountInfo.code ? 'text-green-600' : 'text-red-600'}`}>
              {discountInfo.message}
            </div>
          )}
          
          <div className="space-y-2 text-sm">
            <div className="flex flex-col md:flex-row justify-between">
              <span>Subtotal</span>
              <span>₹{cartItems.reduce((total, item) => 
                total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * (item.quantity || 1)), 
                0).toFixed(2)}</span>
            </div>
            {discountInfo.percentage > 0 && (
              <div className="flex flex-col md:flex-row justify-between text-green-600">
                <span>Discount ({discountInfo.percentage}%)</span>
                <span>- ₹{(cartItems.reduce((total, item) => 
                  total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * (item.quantity || 1)), 
                  0) * (discountInfo.percentage / 100)).toFixed(2)}</span>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between">
              <span>Shipping</span>
              <span>₹ 0.00</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between font-bold text-base">
              <span>Total</span>
              <span>₹ {calculateTotal()}</span>
            </div>
          </div>
          
          {/* <Link 
            to={'/checkout'}
            state={{
              total: calculateTotal(),
              discount: discountInfo.percentage
            }}
            className="block"
          > */}
            <button 
            onClick={handleCheckout}
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600">
              Proceed to Checkout
            </button>
            <Homepage handleCheckout={handleCheckout} />
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default CartItems;