/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.warn('This product is out of stock.');
    }
  };

  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;

  return (
    <div
      id={`product_card_${product._id}`}
      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-150 dark:border-gray-850/80 shadow-sm hover:shadow-xl hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all duration-300 flex flex-col justify-between h-full"
    >
      <Link to={`/products/${product._id}`} className="block flex-grow flex flex-col justify-between">
        {/* Image Frame */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-950">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge Indicators */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.stock <= 3 && product.stock > 0 && (
              <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider self-start">
                Low Stock ({product.stock})
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider self-start">
                Sold Out
              </span>
            )}
            {hasDiscount && (
              <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider self-start flex items-center gap-0.5">
                <Tag className="h-2.5 w-2.5" />
                <span>Save ${(product.price - (product.discountPrice || 0)).toFixed(0)}</span>
              </span>
            )}
          </div>
          <span className="absolute top-3 right-3 bg-white/95 dark:bg-gray-950/95 text-gray-800 dark:text-gray-200 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Details Area */}
        <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
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

          <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col">
              {hasDiscount ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-gray-900 dark:text-white">
                    ${product.discountPrice}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 line-through">
                    ${product.price}
                  </span>
                </div>
              ) : (
                <span className="text-base font-black text-gray-900 dark:text-white">
                  ${product.price}
                </span>
              )}
            </div>

            <button
              id={`add_to_cart_btn_${product._id}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white dark:bg-indigo-950/40 dark:hover:bg-indigo-600 dark:text-indigo-300 p-2 rounded-xl text-xs font-bold transition-all disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
