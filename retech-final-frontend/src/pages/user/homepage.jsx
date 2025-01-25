import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";
import SEOComponent from '../../components/SEO/SEOComponent';
import CartItems from "../../components/user/cart/Cartitems"; // Importing CartItems
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// Scroll progress component
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '4px',
        backgroundColor: '#ec4899',
        transition: 'width 0.3s ease-out',
        zIndex: 1000,
      }}
    />
  );
};

// Main HomePage Component
const HomePage = ({ handleCheckout }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state

  const carouselSlides = [
    {
      title: "50% OFF",
      description: "Surprise your loved ones with our Special Gifts",
      image: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "New Arrivals",
      description: "Check out our latest collection of gifts",
      image: "https://i.pinimg.com/originals/96/24/6e/96246e3c133e6cb5ae4c7843f9e45b22.jpg"
    },
    {
      title: "Special Offers",
      description: "Limited time deals on selected items",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://api.merabestie.com/get-product');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Carousel slide logic
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5005);
    return () => clearInterval(timer);
  }, []);

  // ProductGrid component with Add to Cart functionality
  const ProductGrid = ({ title, products }) => {
    const [cartVisible, setCartVisible] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    // Handle adding to cart
    const handleAddToCart = async (product) => {
      try {
        // Get cartId from localStorage
        let cartId = localStorage.getItem("cartId");
        if (!cartId) {
          cartId = "cart_" + Math.random().toString(36).substring(2, 15);  // Generate a new cartId if not present
          localStorage.setItem("cartId", cartId);
        }
    
        const userId = cartId;  // Using cartId as userId for testing purposes.
    
        // Fetch the existing cart (if any)
        let existingCart = await fetchCart(userId, cartId);
    
        // If cart exists, ensure productsInCart is an array and check if the product already exists in the cart
        if (existingCart) {
          if (!Array.isArray(existingCart.productsInCart)) {
            existingCart.productsInCart = []; // Initialize as an empty array if not already an array
          }
    
          const productIndex = existingCart.productsInCart.findIndex(item => item === product._id);
    
          if (productIndex >= 0) {
            // Product already exists in the cart, do nothing (or you can handle quantity increment here)
            alert("This product is already in the cart.");
          } else {
            // Product doesn't exist in the cart, push the product ID into productsInCart
            existingCart.productsInCart.push(product._id);
          }
        } else {
          // If no cart exists, create a new cart with the first product
          existingCart = {
            userId,
            cartId,
            productsInCart: [product._id]  // Push only productId
          };
        }
    
        // Send the updated cart data to the backend
        console.log("Updated cart:", existingCart.productsInCart);
        const response = await fetch("http://localhost:5000/cart/addtocart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,         // Use cartId as userId
            cartId,         // Send cartId as well
            productsInCart: existingCart.productsInCart,  // Send updated productsInCart array
          }),
        });
    
        const data = await response.json();
    
        if (data.success) {
          // Update the cart items in the UI and make the cart visible
          setCartItems(existingCart.productsInCart);
          // console.log(existingCart.productsInCart)
          setCartVisible(true);
          localStorage.setItem("cartItems", JSON.stringify(existingCart.productsInCart)); // Store the updated cart in localStorage
        } else {
          alert(data.message || "Failed to add item to cart.");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("An error occurred while adding to the cart.");
      }
    };
    
    
    
    
    
    // Helper function to fetch existing cart (if any)
    const fetchCart = async (userId, cartId) => {
      try {
        const response = await fetch("http://localhost:5000/cart/get-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, cartId }),
        });
    
        const data = await response.json();
        if (data.success) {
          return data.cart;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        return null;
      }
    };
    
    

    const handleBuyNow = async (product) => {
      await handleAddToCart(product);
      window.location.href = "/cart";
    };

    return (
      <section className="container mx-auto px-4 py-8">
        {cartVisible && (
          <div className="fixed top-0 right-0 w-1/4 h-full bg-gray-900 bg-opacity-90 text-white z-50 pt-16">
            <CartItems cartItem={cartItems} />
            <button
              onClick={() => setCartVisible(false)}
              className="absolute top-4 right-4 text-white bg-pink-600 hover:bg-pink-800 p-2 rounded-full"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <a href="/shop">
            <button className="bg-pink-100 text-pink-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-200 transition-colors">
              View All
            </button>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-1 relative"
            >
              <div className="relative">
                <img
                  src={product.img[0] || "/fallback-image.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-75 text-white opacity-0 hover:opacity-100 transition-opacity">
                  Shop Now
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">₹{product.price}</span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-600"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // New Arrivals Grid Component
  const NewArrivalsGrid = () => {
    const newArrivals = products.slice(0, 4);
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">New Arrival</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 relative group overflow-hidden rounded-lg">
            <img
              src={newArrivals[0]?.img[0] || "/fallback-image.jpg"}
              alt={newArrivals[0]?.name}
              className="w-full h-[600px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-2xl font-semibold mb-2">{newArrivals[0]?.name}</h3>
              <p className="text-white text-lg">₹{newArrivals[0]?.price}</p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {newArrivals.slice(1).map((product, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-lg">
                <img
                  src={product?.img[0] || "/fallback-image.jpg"}
                  alt={product?.name}
                  className="w-full h-[300px] object-cover transition-transform duration-300 transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h4 className="text-white text-lg">{product?.name}</h4>
                  <p className="text-white">₹{product?.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50">
      <SEOComponent />
      <ScrollProgress />
      <Navbar />
      <main>
        {/* Carousel */}
        <div className="relative">
          <div className="h-96 w-full bg-cover bg-center" style={{ backgroundImage: `url(${carouselSlides[currentSlide].image})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="flex flex-col items-center justify-center h-full text-white">
                <h2 className="text-4xl font-semibold">{carouselSlides[currentSlide].title}</h2>
                <p className="text-lg mt-2">{carouselSlides[currentSlide].description}</p>
              </div>
            </div>
          </div>
        </div>

        <NewArrivalsGrid />
        <ProductGrid title="Top Picks" products={products} />
        <Footer />
      </main>
    </div>
  );
};

export default HomePage;
