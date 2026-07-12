/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ChevronRight, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Clock, 
  Truck, 
  ArrowRight,
  Loader2,
  Inbox
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../api/axiosConfig';

export const Orders = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=orders');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch orders from API /getorders/:userid
  useEffect(() => {
    const fetchOrders = async () => {
      const activeUserId = user?.id || user?._id;
      if (!activeUserId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/getorders/${activeUserId}`);
        
        let fetchedOrders = [];
        if (Array.isArray(response.data)) {
          fetchedOrders = response.data;
        } else if (response.data && Array.isArray(response.data.orders)) {
          fetchedOrders = response.data.orders;
        } else if (response.data && typeof response.data === 'object') {
          // If response.data is an object containing list or data field
          fetchedOrders = response.data.data || response.data.list || [];
        }

        // Sort orders by newest first
        fetchedOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0).getTime();
          const dateB = new Date(b.createdAt || b.date || 0).getTime();
          return dateB - dateA;
        });

        setOrders(fetchedOrders);
      } catch (err) {
        console.warn('Could not load order history:', err);
        setError(err.message || 'Failed to retrieve order logs.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <span className="text-sm font-semibold text-gray-500 mt-2">Retrieving order histories...</span>
      </div>
    );
  }

  return (
    <div id="orders_page_wrapper" className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-semibold">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-900 dark:text-gray-300 font-bold">Order History</span>
        </div>

        {/* Title */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-5">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <span>Order History</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Review your digital invoices, secure dispatch parameters, and shipping milestones.
          </p>
        </div>

        {/* Error handling alert */}
        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Empty state when no orders found */}
        {orders.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-sm">
            <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6">
              <Inbox className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">No Orders Dispatched Yet</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
              When you fulfill selected items using our secure payment portal, your order summaries and shipping records will instantly populate this screen.
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                <span>Browse Store Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* List of orders */
          <div className="space-y-6">
            {orders.map((order, idx) => {
              const orderId = order._id || order.id || `order_${idx}`;
              const orderDate = new Date(order.createdAt || order.date || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              // Defensive calculation of items list
              const items = order.orderItems || order.items || [];
              const totalCost = order.totalPrice || order.amount || 0;

              // Extract customer shipping details defensively
              const shippingAdd = order.shippingAddress || {};
              const addressLine = order.cus_add1 || shippingAdd.address || 'Address on file';
              const addressLine2 = order.cus_add2 || '';
              const city = order.cus_city || shippingAdd.city || '';
              const state = order.cus_state || '';
              const postcode = order.cus_postcode || shippingAdd.postalCode || '';
              const phone = order.cus_phone || 'N/A';
              const name = order.cus_name || (typeof order.user === 'object' && order.user?.name) || user?.name || 'Customer';

              return (
                <div 
                  key={orderId} 
                  id={`order_card_${orderId}`}
                  className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-sm overflow-hidden"
                >
                  {/* Order Top Bar Info */}
                  <div className="bg-gray-50 dark:bg-gray-950 px-6 py-4 border-b border-gray-150 dark:border-gray-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-gray-400 block font-normal uppercase tracking-wider text-[10px]">Date Placed</span>
                        <span className="text-gray-900 dark:text-gray-300 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {orderDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-normal uppercase tracking-wider text-[10px]">Grand Total</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold mt-0.5 text-sm">
                          ${totalCost.toFixed(2)}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block font-normal uppercase tracking-wider text-[10px]">Order Reference</span>
                        <span className="text-gray-900 dark:text-white font-mono mt-0.5 select-all">
                          #{orderId}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0 self-start sm:self-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 uppercase tracking-wide">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Authorized & Paid</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Body Grid */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Products details list (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Ordered Products</h4>
                      <div className="divide-y divide-gray-100 dark:divide-gray-850 space-y-3">
                        {items.map((item, itemIdx) => {
                          const itemProduct = item.product || {};
                          const productName = item.name || itemProduct.name || 'Premium Curated Selection';
                          const itemImage = item.image || (itemProduct.images && itemProduct.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
                          const itemQty = item.quantity || 1;
                          const itemPrice = item.price || itemProduct.price || 0;

                          return (
                            <div key={itemIdx} className="flex items-center gap-4 pt-3 first:pt-0">
                              <div className="h-16 w-16 bg-gray-50 dark:bg-gray-950 rounded-xl overflow-hidden border border-gray-150 dark:border-gray-850 shrink-0">
                                <img 
                                  src={itemImage} 
                                  alt={productName} 
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h5 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm line-clamp-1">
                                  {productName}
                                </h5>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 font-semibold">
                                  <span>Quantity: {itemQty}</span>
                                  <span>•</span>
                                  <span>Price: ${itemPrice.toFixed(0)}</span>
                                </div>
                              </div>
                              <span className="text-sm font-black text-gray-950 dark:text-white">
                                ${(itemPrice * itemQty).toFixed(0)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order information & Address (5 cols) */}
                    <div className="lg:col-span-5 bg-gray-50/50 dark:bg-gray-950/20 rounded-2xl p-5 border border-gray-150 dark:border-gray-850/80 space-y-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Customer & Contact</h4>
                        <div className="text-xs space-y-1.5 text-gray-700 dark:text-gray-300 font-semibold">
                          <p className="text-sm font-black text-gray-900 dark:text-white">{name}</p>
                          <p className="flex items-center gap-1.5 text-gray-500">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span>{phone}</span>
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-150 dark:border-gray-850/80 pt-3">
                        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Shipping Destination</h4>
                        <div className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5 leading-relaxed font-semibold">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <p>{addressLine}</p>
                            {addressLine2 && <p>{addressLine2}</p>}
                            <p>{city}{state ? `, ${state}` : ''} {postcode}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-150 dark:border-gray-850/80 pt-3 flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Transit Logistics</span>
                        <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                          <Truck className="h-3.5 w-3.5" />
                          <span>Preparing Carrier Dispatch</span>
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
