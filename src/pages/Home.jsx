/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Layers, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  CheckCircle,
  Plus,
  Compass,
  Laptop,
  Shirt,
  Watch,
  Home as HomeIcon
} from 'lucide-react';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Loading } from '../components/Loading';
import { axiosInstance } from '../api/axiosConfig';
import { useCart } from '../context/CartContext';
import { PRESET_PRODUCTS } from '../data/products';

export const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUsingPresets, setIsUsingPresets] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Call the user's completed API endpoint to fetch products
        const response = await axiosInstance.get('/products');
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setProducts(response.data);
          setIsUsingPresets(false);
        } else {
          // If response is empty, gracefully load presets to ensure production presentation
          setProducts(PRESET_PRODUCTS);
          setIsUsingPresets(true);
        }
      } catch (error) {
        // If server is not ready or fails, fallback to elegant presets silently
        setProducts(PRESET_PRODUCTS);
        setIsUsingPresets(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const categories = [
    { id: 'all', name: 'All Collections', icon: Compass },
    { id: 'electronics', name: 'Electronics', icon: Laptop },
    { id: 'apparel', name: 'Apparel', icon: Shirt },
    { id: 'accessories', name: 'Accessories', icon: Watch },
    { id: 'home', name: 'Home Decor', icon: HomeIcon },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div id="home_page_wrapper" className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section id="hero_section" className="relative bg-white dark:bg-gray-900 border-b border-gray-150/50 dark:border-gray-800 py-20 lg:py-28 overflow-hidden">
        {/* Subtle decorative mesh */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-sky-500/5 to-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Column 1: Copywriting */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold tracking-wide">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Summer Collection 2026 Live</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
                Modern Gear for the <br />
                <span className="text-indigo-600 dark:text-indigo-400">Digital Nomad</span>
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                A curated catalog of uncompromising premium electronics, aesthetic accessories, and performance apparel built with supreme modern craftsmanship.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#categories_showcase"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750 dark:text-gray-200 font-bold px-8 py-3.5 rounded-xl transition-all"
                >
                  <span>Categories</span>
                </a>
              </div>

              {/* Trust triggers */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-black text-gray-950 dark:text-white">10k+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Products Sold</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-950 dark:text-white">4.9★</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">User Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-950 dark:text-white">99%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Delivery Success</p>
                </div>
              </div>
            </div>

            {/* Column 2: Interactive Graphic or Hero Product Card */}
            <div className="relative mx-auto lg:ml-auto w-full max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-850 aspect-video lg:aspect-square flex items-center justify-center group">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop&q=80" 
                  alt="Summer Collection" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Featured Item</span>
                  <h3 className="text-lg md:text-xl font-extrabold text-white">Vanguard Aesthetic Lifestyle Range</h3>
                  <p className="text-xs text-gray-300 mt-1 mb-4 hidden sm:block">Engineered to look stunning, resist wear, and support your daily grind.</p>
                  <Link 
                    to="/products"
                    className="inline-flex items-center gap-1.5 text-xs text-white font-bold bg-white/20 hover:bg-white/30 px-3.5 py-2 rounded-lg backdrop-blur-md self-start transition-all"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section id="categories_showcase" className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                Shop by Collection
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Filter our premium collections tailored to modern workflows.
              </p>
            </div>
            {/* Interactive Category Chips */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`cat_chip_${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-150 dark:border-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <Loading message="Fetching curated catalog..." />
          ) : (
            <div>
              {/* Fallback Warning Notice - Shown only if we are using presets */}
              {isUsingPresets && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">Sandbox Preview Ready</h4>
                    <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-0.5 leading-relaxed">
                      Curated preview items loaded automatically. When MongoDB products are published via your Node.js backend (<code>GET /products</code>), they will dynamically override these items.
                    </p>
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-150/80 dark:border-gray-850">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">No products found</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">We couldn't find items in this specific category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div 
                      key={product._id} 
                      id={`product_card_${product._id}`}
                      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-150 dark:border-gray-850/85 shadow-sm hover:shadow-xl hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-950">
                        <img 
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'} 
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.stock <= 3 && product.stock > 0 && (
                          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Low Stock ({product.stock})
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="absolute top-3 left-3 bg-gray-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Sold Out
                          </span>
                        )}
                        <span className="absolute top-3 right-3 bg-white/90 dark:bg-gray-950/90 text-gray-900 dark:text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
                          {product.category}
                        </span>
                      </div>

                      {/* Details Area */}
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                              {product.ratings || 4.8}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({product.numReviews || 35})
                            </span>
                          </div>

                          <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {product.name}
                          </h3>

                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-lg font-black text-gray-950 dark:text-white">
                            ${product.price}
                          </span>
                          
                          <button
                            id={`add_to_cart_btn_${product._id}`}
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={product.stock === 0}
                            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white dark:bg-indigo-950/40 dark:hover:bg-indigo-600 dark:text-indigo-300 p-2.5 rounded-xl text-xs font-bold transition-all disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section id="promo_banner" className="py-12 bg-indigo-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
              <Flame className="h-4 w-4" />
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Take 20% Off Your First Premium Order
            </h2>
            <p className="text-indigo-100 text-sm max-w-xl">
              Use code <strong className="text-white font-black bg-white/10 px-2 py-0.5 rounded">NEW20</strong> at checkout. Free express dispatch and returns on all qualified nomad products.
            </p>
          </div>

          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-150 text-indigo-600 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all"
            >
              <span>Shop Exclusive Range</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
