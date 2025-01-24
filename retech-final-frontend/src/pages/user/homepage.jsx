import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";
import SEOComponent from '../../components/SEO/SEOComponent';
// import { handleCheckout } from '../../components/user/cart/Cartitems';
import Cart from "./cart"; // Import the Cart component
import { Link } from "react-router-dom";
// import { FaStar } from "react-icons/fa";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartItems from "../../components/user/cart/Cartitems";


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

const HomePage = ({ handleCheckout }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);

  const carouselSlides = [
    {
      title: "50% OFF",
      description: "Surprise your Loved person with our Special Gifts",
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

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://api.merabestie.com/get-product');
      const data = await response.json();
      console.log(data)
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5005);
    return () => clearInterval(timer);
  }, []);


  const ProductGrid = ({ title, products }) => {
    const [cartVisible, setCartVisible] = useState(false); // State for controlling cart visibility
    const [cartItems, setCartItems] = useState([]); // State for storing cart items
  
    const handleAddToCart = async (product) => {
      try {
        // Get or create a cartId for the user
        let cartId = localStorage.getItem("cartId");
        if (!cartId) {
          cartId = "cart_" + Math.random().toString(36).substring(2, 15);
          localStorage.setItem("cartId", cartId); // Store cartId in localStorage for persistence
        }
  
        const response = await fetch("http://localhost:5000/cart/addtocart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartId, // Send cartId instead of userId
            productId: product.id, // Adjust based on your product object structure
            quantity: 1, // Default quantity
          }),
        });
  
        const data = await response.json();
        if (data.success) {
          // alert("Item added to cart successfully!");
          setCartItems((prevItems) => [...prevItems, product]); // Update cartItems state
          setCartVisible(true); // Show the cart
        } else {
          alert(data.message || "Failed to add item to cart.");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("An error occurred while adding to the cart.");
      }
    };
  
    const handleBuyNow = async (product) => {
      try {
        // Add to cart first
        await handleAddToCart(product);
        // Redirect to checkout
        window.location.href = "/cart";
      } catch (error) {
        console.error("Error in Buy Now:", error);
      }
    };
  
    // Effect to close the cart after 5 minutes
    // useEffect(() => {
    //   if (cartVisible) {
    //     const timer = setTimeout(() => {
    //       setCartVisible(false);
    //     }, 300000); // 5 minutes in milliseconds
    //     return () => clearTimeout(timer); // Clean up the timer if the component is unmounted or cart visibility changes
    //   }
    // }, [cartVisible]); // Only run when cartVisible changes
  
    return (
      <section className="container mx-auto px-4 py-8">
        {/* Cart Sidebar */}
        {cartVisible && (
          <div className="fixed top-0 right-0 w-1/4 h-full bg-gray-900 bg-opacity-90 text-white z-50 pt-16"> {/* Add padding-top */}
            <CartItems cartItems={cartItems} /> {/* Pass cart items to CartItems */}
            <button
              onClick={() => setCartVisible(false)} // Close cart when clicked
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
                  src={product.img[0]}
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


  
  



// const ProductGrid = ({ title, products }) => {
//   const handleAddToCart = async (productId) => {
//     console.log(productId)
//     // Simulate adding the product to cart
//     const cartItem = {
//       productId,
//       quantity: 1,
//     };
    
//     // Example: Push the cartItem to an array (You might want to use state or a global context for real cart management)
//     let cartItems = []; // This would be part of your global state/context for cart items
//     cartItems.push(cartItem);

//     // Transform cart data for checkout
//     const transformedData = cartItems.map(item => ({
//       variant_id: item.productId,
//       quantity: item.quantity,
//     }));

//     console.log("Transformed cart data:", transformedData);

//     try {
//       const response = await fetch('http://localhost:5000/shiprocketapi', {
//         method: 'POST',
//         headers: {
//           "Content-Type": 'application/json',
//         },
//         body: JSON.stringify(transformedData),
//       });

//       const checkoutData = await response.json();
//       console.log("Checkout token:", checkoutData.token);

//       // Trigger HeadlessCheckout with the checkout token and fallback URL
//       window.HeadlessCheckout.addToCart(null, checkoutData.token, {
//         fallbackUrl: "https://your.fallback.com?product=123",
//       });
//     } catch (error) {
//       console.error('Error sending checkout request:', error);
//     }
//   };

//   const handleBuyNow = async (productId) => {
//     // Simulate adding the product to cart for buy now
//     await handleAddToCart(productId);
//     // Redirect to checkout or perform immediate purchase action here
//     console.log("Proceeding to checkout with productId:", productId);
//   };

//   return (
//     <section className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">{title}</h2>
//         <a href="/shop">
//           <button className="bg-pink-100 text-pink-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-200 transition-colors">
//             View All
//           </button>
//         </a>
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {products.map((product, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-1 relative"
//           >
//             <div className="relative">
//               <img
//                 src={product.img[0]}
//                 alt={product.name}
//                 className="w-full h-48 object-cover"
//               />
//               <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-75 text-white opacity-0 hover:opacity-100 transition-opacity">
//                 Shop Now
//               </button>
//             </div>
//             <div className="p-4">
//               <h3 className="font-medium mb-2">{product.name}</h3>
//               <div className="flex items-center justify-between mt-2">
//                 <span className="text-sm">₹{product.price}</span>
//                 <div className="flex items-center">
//                   <FaStar className="text-yellow-400 mr-1" />
//                   <span className="text-sm">{product.rating}</span>
//                 </div>
//               </div>

//               <div className="mt-4 flex space-x-4">
//                 <button
//                   onClick={() => handleAddToCart(product._id)} // Assuming product.id is the product's unique ID
//                   className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-600"
//                 >
//                   Add to Cart
//                 </button>
//                 <button
//                   onClick={() => handleBuyNow(product._id)} // Same here
//                   className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

  const NewArrivalsGrid = () => {
    const newArrivals = products.slice(0, 4); // Take the first 4 products for New Arrivals

    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">New Arrival</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Large gift box */}
          <div className="lg:col-span-6 relative group overflow-hidden rounded-lg">
            <img
              src={newArrivals[0]?.img[0]}
              alt={newArrivals[0]?.name}
              className="w-full h-[600px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-xl font-semibold">{newArrivals[0]?.name}</h3>
            </div>
          </div>

          {/* Right column layout */}
          <div className="lg:col-span-6 grid grid-rows-2 gap-4">
            {/* Top right - medium box */}
            <div className="relative group overflow-hidden rounded-lg">
              <img
                src={newArrivals[1]?.img[0]}
                alt={newArrivals[1]?.name}
                className="w-full h-[290px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-white text-lg font-semibold">{newArrivals[1]?.name}</h3>
              </div>
            </div>

            {/* Bottom right - two small boxes */}
            <div className="grid grid-cols-2 gap-4">
              {newArrivals.slice(2).map((item, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={item.img[0]}
                    alt={item.name}
                    className="w-full h-[290px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white text-sm font-semibold">{item.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const bestSellingProducts = products.slice(0, 4);
  const exploreProducts = products.slice(4, 8);
  const giftsForCouples = products.slice(8, 12);
  const stationary = products.slice(12, 16);
  const greetingCards = products.slice(16, 20);

  return (
    <div className="min-h-screen bg-white">
      <SEOComponent/>
      <ScrollProgress />
      <Navbar />
      
      <main className="mt-20">
        {/* Hero Carousel */}
        <div className="container mx-auto px-4 py-6">
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
                 style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {carouselSlides.map((slide, index) => (
                <div key={index} className="relative w-full h-full flex-shrink-0">
                  <img 
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 to-pink-400/80">
                    <div className="absolute inset-0 flex items-center p-8">
                      <div className="text-white">
                        <h1 className="text-4xl font-bold mb-2">{slide.title}</h1>
                        <p className="text-lg">{slide.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-pink-500' : 'bg-gray-300'}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Grids */}
        <ProductGrid title="Best Selling Products" products={bestSellingProducts} />
        <ProductGrid title="Explore Our Products" products={exploreProducts} />
        
        {/* New Arrivals Section with new grid layout */}
        <NewArrivalsGrid />
        
        <ProductGrid title="Gifts for Couples" products={giftsForCouples} />
        <ProductGrid title="Stationary" products={stationary} />
        <ProductGrid title="Greeting Cards" products={greetingCards} />

        {/* Footer Banner */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <h3 className="font-semibold">Free Delivery</h3>
                <p className="text-sm text-gray-600">On orders above ₹499</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-gray-600">Customer service</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;