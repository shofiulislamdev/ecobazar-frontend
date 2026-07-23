/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Package, 
  Tag 
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Loading } from '../components/Loading';
import { axiosInstance } from '../api/axiosConfig';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { PRESET_PRODUCTS } from '../data/products';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsingPreset, setIsUsingPreset] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // Prompt requested: GET /singleproduct/:id
        const response = await axiosInstance.get(`/singleproduct/${id}`);
        
        if (response.data) {
          setProduct(response.data);
          if (response.data.images && response.data.images.length > 0) {
            setActiveImage(response.data.images[0]);
          }
          setIsUsingPreset(false);
        } else {
          loadFallback();
        }
      } catch (error) {
        // Fallback gracefully so we don't crash
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      const found = PRESET_PRODUCTS.find((p) => p._id === id);
      if (found) {
        setProduct(found);
        setActiveImage(found.images?.[0] || '');
        setIsUsingPreset(true);
      } else {
        // If not in presets either, load p1 just to keep screen functional
        setProduct(PRESET_PRODUCTS[0]);
        setActiveImage(PRESET_PRODUCTS[0].images?.[0] || '');
        setIsUsingPreset(true);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock >= quantity) {
      addToCart(product, quantity);
      toast.success(`${quantity} x ${product.name} added to cart!`);
    } else {
      toast.warn('Not enough stock available.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-between">
        <Navbar />
        <Loading message="Sourcing dynamic item specifications..." />
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto py-16 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Not Found</h2>
          <p className="text-sm text-gray-500 mt-2">The requested items do not match our database references.</p>
          <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;

  return (
    <div id="product_detail_page" className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Back navigation */}
        <div className="mb-6">
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Curated Catalog</span>
          </Link>
        </div>

        {/* Dynamic Warning Alert */}
        {isUsingPreset && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 text-amber-800 dark:text-amber-400 text-xs">
            <p className="font-bold">Sandbox Asset View Mode</p>
            <p className="mt-0.5">This view has fetched fallback data because the product has not been populated on MongoDB. Once database integrations are configured, dynamic item profiles will resolve seamlessly.</p>
          </div>
        )}

        {/* Product details grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 p-6 md:p-10 shadow-sm">
          
          {/* Column 1: Image Gallery */}
          <div className="space-y-4">
            {/* Main Stage */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 relative">
              <img 
                src={activeImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'} 
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Tag className="h-3 w-3" />
                  <span>Promo Sale</span>
                </span>
              )}
            </div>

            {/* Thumbnails list */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 bg-gray-50 dark:bg-gray-950 transition-all cursor-pointer ${
                      activeImage === imgUrl 
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${product.name} thumbnail ${idx}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Specific product attributes & Checkout logic */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category Breadcrumb / Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">
                <span>{product.category}</span>
              </div>

              {/* Title & Ratings */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {product.ratings || 4.8}
                    </span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {product.numReviews || 124} customer reviews
                  </span>
                </div>
              </div>

              {/* Pricing section */}
              <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-150 dark:border-gray-850/80 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</span>
                  {hasDiscount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900 dark:text-white">
                        ${product.discountPrice}
                      </span>
                      <span className="text-sm text-gray-400 line-through font-semibold">
                        ${product.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Availability</span>
                  {product.stock > 3 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-ping"></span>
                      <span>In Stock ({product.stock})</span>
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <span>Only {product.stock} left!</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Details specs: SKU & Stock metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
                <div>
                  <span className="block text-gray-400 font-bold uppercase tracking-wider text-[10px]">SKU Number</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200 mt-1 block">
                    {product.sku || `SKU-MDN-PROD-${product._id.substring(0, 6).toUpperCase()}`}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-bold uppercase tracking-wider text-[10px]">Fulfillment</span>
                  <span className="text-gray-800 dark:text-gray-200 mt-1 block">
                    Fast Express Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Add button */}
            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              {product.stock > 0 ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Qty controller */}
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden h-12 bg-white dark:bg-gray-850">
                    <button
                      id="decrease_qty_btn"
                      onClick={handleDecreaseQty}
                      className="px-4 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 h-full transition-colors cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 font-bold text-sm text-gray-900 dark:text-white min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      id="increase_qty_btn"
                      onClick={handleIncreaseQty}
                      disabled={quantity >= product.stock}
                      className="px-4 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 h-full transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add action */}
                  <button
                    id="add_to_cart_detail_btn"
                    onClick={handleAddToCart}
                    className="flex-grow flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="h-4.5 w-4.5" />
                    <span>Add to Shopping Cart</span>
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 dark:bg-gray-850 dark:text-gray-600 font-bold h-12 px-8 rounded-xl"
                >
                  <Package className="h-4.5 w-4.5" />
                  <span>Out of Stock</span>
                </button>
              )}
            </div>

            {/* Quality Seals banner */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-950">
                <Truck className="h-5 w-5 text-indigo-500 mb-1" />
                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">Free Ship</span>
                <span className="text-[9px] text-gray-400">Above $100</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-950">
                <RefreshCw className="h-5 w-5 text-indigo-500 mb-1" />
                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">30-Day Return</span>
                <span className="text-[9px] text-gray-400">Easy Exchanges</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-950">
                <ShieldCheck className="h-5 w-5 text-indigo-500 mb-1" />
                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">Secure Pay</span>
                <span className="text-[9px] text-gray-400">PCI Encrypted</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
