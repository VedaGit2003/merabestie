import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, AlertCircle, Loader } from 'lucide-react';
import { debounce } from 'lodash';

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  const debouncedFetch = useCallback(
    debounce(async (input) => {
      if (!input.trim()) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('https://api.merabestie.com/get-product');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
          const validProducts = data.products.filter(product => 
            (product.name?.toLowerCase().includes(input.toLowerCase()) || 
             product.category?.toLowerCase().includes(input.toLowerCase()) ||
             product.description?.toLowerCase().includes(input.toLowerCase())) &&
            product.price && 
            product.img && 
            product._id &&
            product.visibility === "on" || true
          );
          
          setSearchResults(validProducts);
          setIsOpen(validProducts.length > 0);
        }
      } catch (error) {
        setError('Failed to fetch products. Please try again.');
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetch(inputValue);
    return () => debouncedFetch.cancel();
  }, [inputValue, debouncedFetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchResults([]);
    setIsOpen(false);
    setError(null);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setInputValue('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="search"
          role="searchbox"
          aria-label="Search products"
          placeholder="Search gifts for your loved ones..."
          className="w-full px-4 py-3 pl-10 pr-10 border-2 border-pink-200 rounded-full 
                     focus:outline-none focus:ring-2 focus:ring-pink-500 
                     transition-all duration-300 ease-in-out placeholder:text-gray-400"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 h-5 w-5" />
        {inputValue && (
          <button 
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-pink-400 hover:text-pink-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-pink-500 flex items-center justify-center space-x-2">
                <Loader className="h-5 w-5 animate-spin" />
                <span>Searching for products...</span>
              </div>
            ) 
            : (
              <ul className="divide-y divide-gray-100">
                {searchResults.map((result) => (
                  <li key={result._id} className="transition-colors hover:bg-gray-50">
                    <Link 
                      to={`/${result.productId}`}
                      onClick={handleResultClick}
                      className="flex items-center p-4 group"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={result.img[0] || result.img} 
                          alt={result.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate group-hover:text-pink-600 transition-colors">
                          {result.name}
                        </h3>
                        <p className="text-pink-600 font-medium mt-1">
                          ${typeof result.price === 'number' ? result.price.toFixed(2) : result.price}
                        </p>
                        <span className="text-xs text-gray-500 capitalize mt-1 block">
                          {result.category}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
