/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RefreshCcw, LayoutGrid, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Loading } from '../components/Loading';
import { ProductCard } from '../components/ProductCard';
import { axiosInstance } from '../api/axiosConfig';
import { PRESET_PRODUCTS } from '../data/products';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUsingPresets, setIsUsingPresets] = useState(false);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(500);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    // Keep category in state synced with URL parameter changes
    const urlCategory = searchParams.get('category') || 'all';
    setSelectedCategory(urlCategory);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // The requested API is GET /allproduct. Let's make that primary.
        let response;
        try {
          response = await axiosInstance.get('/allproduct');
        } catch (err) {
          // Fallback to general products if GET /allproduct is not available
          response = await axiosInstance.get('/products');
        }

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setProducts(response.data);
          setIsUsingPresets(false);
        } else {
          setProducts(PRESET_PRODUCTS);
          setIsUsingPresets(true);
        }
      } catch (error) {
        // Fallback gracefully on API errors to ensure a pristine user experience
        setProducts(PRESET_PRODUCTS);
        setIsUsingPresets(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setSearchTerm('');
    handleCategoryChange('all');
    setPriceRange(500);
    setSortBy('featured');
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      const activePrice = product.discountPrice !== undefined ? product.discountPrice : product.price;
      const matchesPrice = activePrice <= priceRange;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
      const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;

      if (sortBy === 'price-asc') {
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return (b.ratings || 0) - (a.ratings || 0);
      }
      // Featured/Default by date or unsorted
      return 0;
    });

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'home', name: 'Home Decor' },
  ];

  return (
    <div id="products_page_container" className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Header Title */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-5">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <span>Curated Product Catalog</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">
            Discover precision-designed equipment and accessories curated for modern lifestyles.
          </p>
        </div>

        {/* Filter / Search Bar Segment */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Side Filters Block (Desktop Only / Collapsible styled) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-150 dark:border-gray-850/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
                  <span>Filters</span>
                </h3>
                <button
                  id="reset_filters_btn"
                  onClick={resetFilters}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Category
                </label>
                <div className="flex flex-col gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      id={`sidebar_cat_${cat.id}`}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span>Max Price</span>
                  <span className="text-gray-700 dark:text-gray-200 text-sm font-black">
                    ${priceRange}
                  </span>
                </div>
                <input
                  id="price_range_slider"
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>$10</span>
                  <span>$500</span>
                </div>
              </div>

              {/* Sorting */}
              <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Sort By
                </label>
                <select
                  id="product_sort_selector"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog Search & Grid column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Input Bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                <Search className="h-5 w-5" />
              </span>
              <input
                id="catalog_search_input"
                type="text"
                placeholder="Search premium apparel, watches, chargers, sound..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full py-3.5 pl-11 pr-10 text-sm text-gray-900 placeholder-gray-400 bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
              />
              {searchTerm && (
                <button
                  id="clear_search_btn"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Sandbox alert when using presets */}
            {isUsingPresets && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/25 border border-amber-100 dark:border-amber-900/40 text-amber-800 dark:text-amber-400 text-xs">
                <p className="font-bold">Sandbox Presentation Mode Active</p>
                <p className="mt-1 leading-relaxed">
                  These high-fidelity pre-set products are loaded dynamically. Once your database is loaded with inventory via the <code>GET /allproduct</code> endpoint, they will instantly take priority.
                </p>
              </div>
            )}

            {loading ? (
              <Loading message="Assembling catalog grid..." />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-850">
                <div className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-bounce flex items-center justify-center">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">No items found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Try adjusting your keywords, price bracket, or category parameters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
