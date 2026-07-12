/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="main_footer" className="bg-gray-950 text-gray-300 transition-colors border-t border-gray-800">
      {/* Features Banner */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Free &amp; Fast Shipping</h4>
              <p className="text-xs text-gray-400">On all orders above $100</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-400">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Easy Exchanges</h4>
              <p className="text-xs text-gray-400">30-day money back guarantee</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">100% Secure Payments</h4>
              <p className="text-xs text-gray-400">PCI-DSS compliant gateways</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="text-indigo-400">E</span>Shop
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Discover a curated experience of premium electronics, lifestyle accessories, and apparel designed with contemporary aesthetics.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Links Column: Shop */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Shop Categories</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/products?category=electronics" className="hover:text-indigo-400 transition-colors">Electronics</Link></li>
            <li><Link to="/products?category=apparel" className="hover:text-indigo-400 transition-colors">Fashion &amp; Apparel</Link></li>
            <li><Link to="/products?category=accessories" className="hover:text-indigo-400 transition-colors">Accessories</Link></li>
            <li><Link to="/products?category=home" className="hover:text-indigo-400 transition-colors">Home &amp; Office</Link></li>
          </ul>
        </div>

        {/* Links Column: Company */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Support</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/faq" className="hover:text-indigo-400 transition-colors">FAQs &amp; Help</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-indigo-400 transition-colors">Shipping &amp; Returns</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Get In Touch</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <span>100 Innovation Way, Suite 400, San Francisco, CA 94107</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>+1 (800) 555-0199</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>support@eshop-platform.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} E-Shop Inc. All rights reserved. Built with senior frontend architecture specifications.</span>
          <div className="flex gap-4">
            <span className="hover:text-gray-400 transition-colors cursor-pointer">Security Scheme</span>
            <span className="hover:text-gray-400 transition-colors cursor-pointer">PCI Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
