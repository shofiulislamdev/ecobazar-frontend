/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [syncLoading, setSyncLoading] = useState(false);

  const userId = user ? (user.id || user._id) : null;

  // Helper: map backend cart items to CartItem format defensively
  const mapBackendItems = useCallback((items) => {
    return items.map((item) => {
      if (item.product && typeof item.product === 'object' && (item.product._id || item.product.id)) {
        return {
          _id: item._id || item.id,
          product: {
            ...item.product,
            _id: item.product._id || item.product.id,
          },
          quantity: item.quantity || 1,
        };
      }
      // If product details are flattened inside the item itself
      const prodId = typeof item.product === 'string' ? item.product : (item.productId || item.product?._id || 'p_fallback');
      return {
        _id: item._id || item.id,
        product: {
          _id: prodId,
          name: item.name || item.productName || 'Curated Product',
          price: item.price || item.productPrice || 0,
          discountPrice: item.discountPrice || item.productDiscountPrice || undefined,
          description: item.description || item.productDescription || '',
          images: item.images || [item.image || item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
          category: item.category || item.productCategory || 'electronics',
          stock: item.stock || item.productStock || 50,
          sku: item.sku || item.productSku || undefined,
          createdAt: item.createdAt || new Date().toISOString(),
        },
        quantity: item.quantity || 1,
      };
    });
  }, []);

  // Fetch Cart from Backend
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !userId) return;
    try {
      setSyncLoading(true);
      const response = await axiosInstance.get(`/cart/${userId}`);
      let items = [];
      if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data && Array.isArray(response.data.items)) {
        items = response.data.items;
      } else if (response.data && response.data.cart && Array.isArray(response.data.cart.items)) {
        items = response.data.cart.items;
      }

      const formatted = mapBackendItems(items);
      setCartItems(formatted);
    } catch (error) {
      console.warn('Could not sync cart from database:', error);
    } finally {
      setSyncLoading(false);
    }
  }, [isAuthenticated, userId, mapBackendItems]);

  // Synchronize local guest cart items to backend on login
  const syncGuestCartToBackend = useCallback(async (guestItems, targetUserId) => {
    try {
      setSyncLoading(true);
      for (const item of guestItems) {
        await axiosInstance.post('/cart/create', {
          productId: item.product._id,
          quantity: item.quantity,
          userId: targetUserId,
        });
      }
      // Clear localStorage once synchronized
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.warn('Guest cart synchronization failed:', error);
    } finally {
      setSyncLoading(false);
    }
  }, []);

  // Initialize and load cart
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    let localItems = [];

    if (storedCart) {
      try {
        localItems = JSON.parse(storedCart);
      } catch (err) {
        localStorage.removeItem('cartItems');
      }
    }

    if (isAuthenticated && userId) {
      if (localItems.length > 0) {
        // Logged in with pending guest items: sync them first
        const runSync = async () => {
          await syncGuestCartToBackend(localItems, userId);
          await fetchCart();
        };
        runSync();
      } else {
        fetchCart();
      }
    } else {
      // Offline guest experience
      setCartItems(localItems);
    }
  }, [isAuthenticated, userId, fetchCart, syncGuestCartToBackend]);

  // Save guest cart to localStorage when offline
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Add Product to Cart
  const addToCart = async (product, quantity = 1) => {
    // 1. Optimistic/local state update
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product._id === product._id);
      if (existingItem) {
        const newQty = Math.min(existingItem.quantity + quantity, product.stock);
        return prevItems.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
    });

    // 2. Synchronize with Backend
    if (isAuthenticated && userId) {
      try {
        await axiosInstance.post('/cart/create', {
          productId: product._id,
          quantity,
          userId,
        });
        await fetchCart(); // Get refreshed items and backend IDs
      } catch (error) {
        console.error('Failed to sync added product to server cart:', error);
      }
    }
  };

  // Remove Item completely
  const removeFromCart = async (productId) => {
    const itemToRemove = cartItems.find((item) => item.product._id === productId);
    
    // Optimistic local state update
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));

    // Backend sync
    if (isAuthenticated && itemToRemove) {
      try {
        const cartItemId = itemToRemove._id || itemToRemove.product._id;
        await axiosInstance.delete(`/cart/${cartItemId}`);
        await fetchCart();
      } catch (error) {
        console.error('Failed to delete item from server cart:', error);
      }
    }
  };

  // Update specific quantity
  const updateQuantity = async (productId, quantity) => {
    const targetItem = cartItems.find((item) => item.product._id === productId);
    if (!targetItem) return;

    const clampedQty = Math.max(1, Math.min(quantity, targetItem.product.stock));

    // Optimistic local state update
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity: clampedQty } : item
      )
    );

    // Backend sync
    if (isAuthenticated && userId) {
      try {
        const cartItemId = targetItem._id || targetItem.product._id;
        await axiosInstance.post(`/cart/update/${cartItemId}/${userId}`, {
          quantity: clampedQty,
        });
        await fetchCart();
      } catch (error) {
        console.error('Failed to update product quantity on server:', error);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    const currentItems = [...cartItems];
    setCartItems([]);
    localStorage.removeItem('cartItems');

    if (isAuthenticated && currentItems.length > 0) {
      try {
        // Call DELETE endpoint in parallel for all items to clean DB
        const deletePromises = currentItems.map((item) => {
          const cartItemId = item._id || item.product._id;
          return axiosInstance.delete(`/cart/${cartItemId}`);
        });
        await Promise.all(deletePromises);
        await fetchCart();
      } catch (error) {
        console.error('Failed to clear all items from server cart:', error);
      }
    }
  };

  // Calculated properties using discount prices when applicable
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice !== undefined && item.product.discountPrice < item.product.price
      ? item.product.discountPrice
      : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        totalItems,
        totalPrice,
        syncLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
