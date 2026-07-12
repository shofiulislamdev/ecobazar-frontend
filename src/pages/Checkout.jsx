/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ShoppingBag, 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Lock,
  Loader2
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../api/axiosConfig';
import { toast } from 'react-toastify';

export const Checkout = () => {
  const { cartItems, totalPrice, totalItems, clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const shippingThreshold = 100;
  const shippingCost = totalPrice >= shippingThreshold || totalPrice === 0 ? 0 : 15;
  const estimatedTax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingCost + estimatedTax;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cus_name: '',
      cus_email: '',
      cus_add1: '',
      cus_add2: '',
      cus_city: '',
      cus_state: '',
      cus_postcode: '',
      cus_phone: '',
    }
  });

  // Prefill form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue('cus_name', user.name || '');
      setValue('cus_email', user.email || '');
      if (user.phone) {
        setValue('cus_phone', user.phone);
      }
    }
  }, [isAuthenticated, user, setValue]);

  // Auth guard: wait for auth to load, then redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.warn('Please login to proceed to checkout.');
      navigate('/login?redirect=checkout');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Redirect if cart is empty and not already successful
  useEffect(() => {
    if (!authLoading && cartItems.length === 0 && !orderSuccess) {
      toast.info('Your cart is empty. Add products before checking out.');
      navigate('/products');
    }
  }, [cartItems, authLoading, orderSuccess, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const activeUserId = user?.id || user?._id;
      
      const payload = {
        cus_name: data.cus_name,
        cus_email: data.cus_email,
        cus_add1: data.cus_add1,
        cus_add2: data.cus_add2 || '',
        cus_city: data.cus_city,
        cus_state: data.cus_state,
        cus_postcode: data.cus_postcode,
        cus_phone: data.cus_phone,
        userId: activeUserId,
        userid: activeUserId,
        amount: grandTotal,
        totalPrice: grandTotal,
        itemsPrice: totalPrice,
        taxPrice: estimatedTax,
        shippingPrice: shippingCost,
        cartItems: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          image: item.product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
          price: item.product.discountPrice !== undefined && item.product.discountPrice < item.product.price 
            ? item.product.discountPrice 
            : item.product.price
        }))
      };

      // Call payment endpoint
      const response = await axiosInstance.post('/payment', payload);
      
      toast.success('Payment authorized and order placed successfully!');
      setCreatedOrder(response.data);
      setOrderSuccess(true);
      
      // Clear the local/synchronized cart
      await clearCart();
      
      // Auto redirect to orders after a brief delay
      setTimeout(() => {
        navigate('/orders');
      }, 4000);

    } catch (error) {
      console.error('Checkout/Payment failed:', error);
      toast.error(error.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <span className="text-sm font-semibold text-gray-500 mt-2">Loading checkout secure gateway...</span>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-16 flex-grow flex flex-col justify-center w-full">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 p-8 text-center shadow-xl space-y-6">
            <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle className="h-12 w-12 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Order Received Successfully!</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Thank you for your order, <strong className="text-gray-800 dark:text-gray-200">{user?.name}</strong>. Your payment has been authorized, and a confirmation email has been dispatched to <strong className="text-indigo-600">{user?.email}</strong>.
              </p>
            </div>

            {createdOrder && (createdOrder.orderId || createdOrder.order?._id || createdOrder._id) && (
              <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-150 dark:border-gray-850 text-xs text-left space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Reference:</span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    #{createdOrder.orderId || createdOrder.order?._id || createdOrder._id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Charged:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">${grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-emerald-600 font-bold uppercase">Paid / Confirmed</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-gray-850 space-y-3">
              <p className="text-xs text-gray-400">
                You will be redirected to your Order History in a few seconds...
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/orders"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all text-center"
                >
                  Go to Orders Now
                </Link>
                <Link
                  to="/"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750 dark:text-gray-200 py-3 px-4 rounded-xl text-xs font-bold transition-all text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div id="checkout_page_wrapper" className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-semibold">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/cart" className="hover:text-indigo-600 transition-colors">Cart</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-900 dark:text-gray-300 font-bold">Secure Checkout</span>
        </div>

        {/* Back Link */}
        <Link 
          to="/cart" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Shopping Cart</span>
        </Link>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form (7 Cols) */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="lg:col-span-7 space-y-6"
          >
            {/* Customer Information Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-850 p-6 shadow-sm space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-850 pb-4">
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Customer Information</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please provide accurate contact details for tracking and dispatch updates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="cus_name" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      id="cus_name"
                      type="text"
                      className={`block w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-850 dark:text-white dark:border-gray-750 ${
                        errors.cus_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                      }`}
                      placeholder="Jane Doe"
                      {...register('cus_name', { required: 'Full name is required' })}
                    />
                  </div>
                  {errors.cus_name && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.cus_name.message}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="cus_email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      id="cus_email"
                      type="email"
                      className={`block w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-850 dark:text-white dark:border-gray-750 ${
                        errors.cus_email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                      }`}
                      placeholder="jane@example.com"
                      {...register('cus_email', { 
                        required: 'Email address is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                  </div>
                  {errors.cus_email && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.cus_email.message}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="cus_phone" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      id="cus_phone"
                      type="tel"
                      className={`block w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-850 dark:text-white dark:border-gray-750 ${
                        errors.cus_phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                      }`}
                      placeholder="+1 (555) 000-0000"
                      {...register('cus_phone', { required: 'Phone number is required' })}
                    />
                  </div>
                  {errors.cus_phone && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.cus_phone.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Details Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-850 p-6 shadow-sm space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-850 pb-4">
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Delivery Address</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Specify your home or commercial delivery destination coordinates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                {/* Address Line 1 */}
                <div className="sm:col-span-6">
                  <label htmlFor="cus_add1" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Address Line 1
                  </label>
                  <input
                    id="cus_add1"
                    type="text"
                    className={`block w-full rounded-xl border py-2.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-850 dark:text-white dark:border-gray-750 ${
                      errors.cus_add1 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                    }`}
                    placeholder="123 Designer Street"
                    {...register('cus_add1', { required: 'Address Line 1 is required' })}
                  />
                  {errors.cus_add1 && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.cus_add1.message}</span>
                    </p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div className="sm:col-span-6">
                  <label htmlFor="cus_add2" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Address Line 2 <span className="text-gray-400 text-[10px] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="cus_add2"
                    type="text"
                    className="block w-full rounded-xl border py-2.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-850 dark:text-white border-gray-300 dark:border-gray-700"
                    placeholder="Suite 404, Penthouse"
                    {...register('cus_add2')}
                  />
                </div>

                {/* City */}
                <div className="sm:col-span-2">
                  <label htmlFor="cus_city" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    id="cus_city"
                    type="text"
                    className={`block w-full rounded-xl border py-2.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-850 dark:text-white dark:border-gray-750 ${
                      errors.cus_city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                    }`}
                    placeholder="San Francisco"
                    {...register('cus_city', { required: 'City is required' })}
                  />
                  {errors.cus_city && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.cus_city.message}</span>
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="sm:col-span-2">
                  <label htmlFor="cus_state" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    State
                  </label>
                  <input
                    id="cus_state"
                    type="text"
                    className={`block w-full rounded-xl border py-2.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-850 dark:text-white dark:border-gray-750 ${
                      errors.cus_state ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                    }`}
                    placeholder="California"
                    {...register('cus_state', { required: 'State is required' })}
                  />
                  {errors.cus_state && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.cus_state.message}</span>
                    </p>
                  )}
                </div>

                {/* Postcode */}
                <div className="sm:col-span-2">
                  <label htmlFor="cus_postcode" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Postcode / ZIP
                  </label>
                  <input
                    id="cus_postcode"
                    type="text"
                    className={`block w-full rounded-xl border py-2.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-850 dark:text-white dark:border-gray-750 ${
                      errors.cus_postcode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                    }`}
                    placeholder="94103"
                    {...register('cus_postcode', { required: 'Postcode is required' })}
                  />
                  {errors.cus_postcode && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.cus_postcode.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Simulated Payment Gateway Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-850 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Simulated Secure Payment Method</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                By completing this order, our system simulates a real, production-ready payment flow utilizing the secure <strong className="text-gray-900 dark:text-white">POST /payment</strong> endpoint. No actual currency will be debited.
              </p>
              <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300">
                <Lock className="h-4 w-4" />
                <span>End-to-end SSL/TLS encryptions active.</span>
              </div>
            </div>
          </form>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-850 p-6 shadow-sm space-y-6 sticky top-24">
              <h3 className="font-extrabold text-gray-900 dark:text-white tracking-tight border-b border-gray-100 dark:border-gray-850 pb-4 text-base flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Items Review</span>
              </h3>

              {/* Mini Cart Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-850 pr-2 space-y-3">
                {cartItems.map((item) => {
                  const product = item.product;
                  const price = product.discountPrice !== undefined && product.discountPrice < product.price
                    ? product.discountPrice
                    : product.price;

                  return (
                    <div key={product._id} className="flex items-center gap-3 pt-3 first:pt-0">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-950 overflow-hidden border border-gray-200/50 dark:border-gray-800 shrink-0">
                        <img 
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                          {product.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 block font-semibold">
                          Qty: {item.quantity} × ${price.toFixed(0)}
                        </span>
                      </div>
                      <span className="text-xs font-black text-gray-900 dark:text-white shrink-0">
                        ${(price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Breakdown Details */}
              <div className="space-y-3 text-xs border-t border-gray-100 dark:border-gray-850 pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Cart items ({totalItems})</span>
                  <span className="font-bold text-gray-900 dark:text-white">${totalPrice.toFixed(0)}</span>
                </div>
                
                <div className="flex justify-between text-gray-500">
                  <span>Standard Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">Free shipping</span>
                  ) : (
                    <span className="font-bold text-gray-900 dark:text-white">${shippingCost}</span>
                  )}
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">${estimatedTax.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-gray-150 dark:border-gray-850 flex justify-between items-center font-black text-sm text-gray-950 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-base text-indigo-600 dark:text-indigo-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Payment/Submit button */}
              <button
                id="submit_payment_btn"
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-350 dark:disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Authorize Payment of ${grandTotal.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
