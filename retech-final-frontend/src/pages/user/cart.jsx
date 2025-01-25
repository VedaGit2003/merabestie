import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CartItems from "../../components/user/cart/Cartitems";
import RecentlyViewed from "../../components/user/cart/recentlyviewed";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../../components/user/navbar/navbar";
import { Helmet } from "react-helmet";
import SEOComponent from "../../components/SEO/SEOComponent";
import axios from "axios";

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    // Try to get cartId from localStorage
    let storedCartId = localStorage.getItem('cartId');
    if (!storedCartId) {
      storedCartId = "cart_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('cartId', storedCartId);
    }
    setCartId(storedCartId);

    // Fetch the cart once the cartId is available
    if (storedCartId) {
      const fetchCart = async () => {
        try {
          const response = await axios.post('http://localhost:5000/cart/get-cart', { userId: storedCartId });
          // Extract only the _id from each product in the productsInCart array
          const productIds = response.data.cart.productsInCart;
          console.log(productIds);
          setCartItems(productIds); // Set only the productIds in the cartItems state
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      };
      fetchCart();
    }
  }, []);

  return (
    <div className="bg-pink-50 min-h-screen">
      <SEOComponent />
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6 mt-16">
        <div className="bg-white shadow-md rounded-lg">
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
            <Link
              to="/HomePage"
              className="flex items-center space-x-2 text-pink-600 hover:text-pink-800 transition-colors mt-4 md:mt-0"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
          <CartItems cartItem={cartItems} /> {/* Pass productIds to CartItems */}
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
