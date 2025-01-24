import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
    return (
        <nav className="w-full">
            {/* Main Navigation Bar */}
            <div className="bg-pink-100 flex items-center justify-between p-4">
                {/* Logo and Main Nav Items - Left Side */}
                <div className="flex items-center space-x-6">
                    <a href="/" className="text-blue-500 text-xl font-bold">dressmart</a>
                    <div className="hidden md:flex space-x-6">
                        <a href="/new" className="text-blue-500 hover:bg-pink-200 px-3 py-2 rounded-full">NEW</a>
                        <a href="/dresses" className="text-blue-500 hover:bg-pink-200 px-3 py-2 rounded-full">DRESSES</a>
                        <a href="/clothing" className="text-blue-500 hover:bg-pink-200 px-3 py-2 rounded-full">CLOTHING</a>
                        <a href="/accessories" className="text-blue-500 hover:bg-pink-200 px-3 py-2 rounded-full">ACCESSORIES</a>
                        <a href="/sale" className="text-blue-500 hover:bg-pink-200 px-3 py-2 rounded-full">SALE</a>
                    </div>
                </div>

                {/* Action Items - Right Side */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <button className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                        <i className="fas fa-comments text-sm md:text-base"></i>
                    </button>
                    <button className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                        <i className="fas fa-camera text-sm md:text-base"></i>
                    </button>
                    <button className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                        <i className="fas fa-trash text-sm md:text-base"></i>
                    </button>
                    <button className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                        <i className="fas fa-bell text-sm md:text-base"></i>
                    </button>
                    <span className="text-gray-700 text-sm md:text-base hidden sm:inline">Hello, Admin</span>
                    
                    {/* Search, Login, and Cart */}
                    <div className="flex items-center space-x-4 ml-4">
                        <button className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                            <i className="fas fa-search text-sm md:text-base"></i>
                        </button>
                        <a href="/login" className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                            <i className="fas fa-user text-sm md:text-base"></i>
                        </a>
                        <a href="/cart" className="text-blue-500 p-2 hover:bg-pink-200 rounded-full">
                            <i className="fas fa-shopping-cart text-sm md:text-base"></i>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

