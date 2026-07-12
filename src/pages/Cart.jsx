/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems, syncLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const shippingThreshold = 100;
  const shippingCost = totalPrice >= shippingThreshold || totalPrice === 0 ? 0 : 15;
  const estimatedTax = totalPrice * 0.08; // 8% sales tax
  const grandTotal = totalPrice + shippingCost + estimatedTax;

  const handleDecreaseQuantity = (productId, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    } else {
      removeFromCart(productId);
      toast.info('Item removed from cart');
    }
  };

  const handleIncreaseQuantity = (productId, currentQty, maxStock) => {
    if (currentQty < maxStock) {
      updateQuantity(productId, currentQty + 1);
    } else {
      toast.warn(`Only ${maxStock} units available in stock.`);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    
    if (!isAuthenticated) {
      toast.info('Please sign in or register to complete your checkout.');
      navigate('/login?redirect=checkout');
    } else {
      toast.success('Proceeding to checkout...');
      navigate('/checkout');
    }
  };

  return (
    <div id="cart_page_wrapper" className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-semibold">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-indigo-600 transition-colors">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-900 dark:text-gray-300 font-bold">Shopping Cart</span>
        </div>

        {/* Title */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              <span>Your Shopping Cart</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {totalItems === 0 
                ? 'Your curated selections will appear here.' 
                : `You have ${totalItems} premium ${totalItems === 1 ? 'item' : 'items'} in your cart.`}
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              id="clear_cart_btn"
              onClick={() => {
                clearCart();
                toast.success('Shopping cart cleared');
              }}
              className="text-xs font-bold text-red-600 hover:text-red-500 dark:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Sync Loader Overlay */}
        {syncLoading && (
          <div className="p-3 mb-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <span className="animate-spin h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
            <span>Synchronizing your digital cart with database secure layers...</span>
          </div>
        )}

        {/* Empty State Design */}
        {cartItems.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-sm">
            <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 animate-pulse" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Cart is Empty</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Explore our contemporary collection of professional electronics, performance clothing, and office upgrades to fill up your cart.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                Start Exploring
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750 dark:text-gray-200 px-8 py-3.5 rounded-xl text-sm font-bold transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-column Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Cart Items list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-150 dark:divide-gray-800">
                  {cartItems.map((item) => {
                    const product = item.product;
                    const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;
                    const singlePrice = hasDiscount ? product.discountPrice : product.price;
                    const itemSubtotal = singlePrice * item.quantity;

                    return (
                      <div 
                        key={product._id} 
                        id={`cart_item_${product._id}`}
                        className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-colors duration-150 hover:bg-gray-50/50 dark:hover:bg-gray-850/20"
                      >
                        {/* Image stage */}
                        <div className="h-24 w-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shrink-0 relative">
                          <img 
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'} 
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                          {hasDiscount && (
                            <span className="absolute top-1 left-1 bg-emerald-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                              Sale
                            </span>
                          )}
                        </div>

                        {/* Title details */}
                        <div className="flex-grow min-w-0 space-y-1">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                            {product.category}
                          </span>
                          <Link 
                            to={`/products/${product._id}`}
                            className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-sm sm:text-base transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {/* SKU if present */}
                            {product.sku && (
                              <span className="font-mono">
                                SKU: {product.sku}
                              </span>
                            )}
                            <span>|</span>
                            {/* Stock warning */}
                            {product.stock <= 3 ? (
                              <span className="text-red-500 font-bold">Only {product.stock} remaining</span>
                            ) : (
                              <span className="text-emerald-600 font-semibold">In Stock</span>
                            )}
                          </div>
                        </div>

                        {/* Quantity and Price controllers */}
                        <div className="flex sm:flex-row flex-col items-start sm:items-center justify-between sm:justify-end gap-5 w-full sm:w-auto shrink-0 border-t sm:border-0 pt-3 sm:pt-0 border-gray-150 dark:border-gray-850">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden h-9 bg-white dark:bg-gray-850">
                            <button
                              id={`decrease_qty_${product._id}`}
                              onClick={() => handleDecreaseQuantity(product._id, item.quantity)}
                              className="px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 h-full transition-all cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 font-bold text-xs text-gray-900 dark:text-white min-w-[28px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              id={`increase_qty_${product._id}`}
                              onClick={() => handleIncreaseQuantity(product._id, item.quantity, product.stock)}
                              disabled={item.quantity >= product.stock}
                              className="px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 h-full transition-all disabled:opacity-30 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Pricing display */}
                          <div className="text-left sm:text-right min-w-[90px]">
                            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                            <div className="flex items-baseline gap-1.5 sm:justify-end">
                              <span className="font-black text-gray-950 dark:text-white text-sm sm:text-base">
                                ${itemSubtotal.toFixed(0)}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 block font-semibold">
                              (${singlePrice.toFixed(0)} each)
                            </span>
                          </div>

                          {/* Trash action */}
                          <button
                            id={`remove_item_${product._id}`}
                            onClick={() => handleRemoveItem(product._id, product.name)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                            aria-label={`Remove ${product.name} from cart`}
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guarantees banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-850">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Reliable Transit</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Insured express delivery</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-850">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">30-Day Exchanges</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Easy risk-free process</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-850">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Secure Encrypted</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">PCI DSS security shields</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Order Summary details */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-850 p-6 shadow-sm space-y-6">
                <h3 className="font-extrabold text-gray-900 dark:text-white tracking-tight border-b border-gray-100 dark:border-gray-850 pb-4 text-base">
                  Order Summary
                </h3>

                {/* Subtotals list */}
                <div className="space-y-3.5 text-sm">
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-gray-900 dark:text-white">${totalPrice.toFixed(0)}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping fee</span>
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-xs">Free Shipping</span>
                    ) : (
                      <span className="font-bold text-gray-900 dark:text-white">${shippingCost}</span>
                    )}
                  </div>

                  {shippingCost > 0 && (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Add <strong>${(shippingThreshold - totalPrice).toFixed(0)}</strong> more to qualify for Free Shipping!</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Sales tax estimate (8%)</span>
                    <span className="font-bold text-gray-900 dark:text-white">${estimatedTax.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 border-t border-gray-150 dark:border-gray-800 flex items-center justify-between text-base font-black text-gray-950 dark:text-white">
                    <span>Grand Total</span>
                    <span className="text-lg text-indigo-600 dark:text-indigo-400">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promotional Code */}
                <div className="space-y-1.5 pt-4 border-t border-gray-150 dark:border-gray-800">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Applied Coupon</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter NEW20, etc..." 
                      defaultValue="NEW20"
                      disabled
                      className="flex-grow rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-500 font-bold focus:outline-none"
                    />
                    <button 
                      disabled
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg text-xs font-bold"
                    >
                      Applied
                    </button>
                  </div>
                </div>

                {/* Checkout trigger */}
                <button
                  id="checkout_proceed_btn"
                  onClick={handleCheckout}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Continue shopping link */}
                <div className="text-center">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>Continue Catalog Shopping</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
