/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EmailVerification = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const verifiedRef = useRef(false);

  useEffect(() => {
    // Avoid double-execution in StrictMode
    if (verifiedRef.current) return;
    verifiedRef.current = true;

    if (!token) {
      setStatus('failed');
      setErrorMessage('No verification token provided.');
      return;
    }

    const performVerification = async () => {
      try {
        const result = await verifyEmail(token);
        setStatus('success');
        toast.success(result.message || 'Email verified successfully!');
      } catch (error) {
        setStatus('failed');
        setErrorMessage(error.message || 'Verification link is invalid or has expired.');
        toast.error(error.message || 'Email verification failed.');
      }
    };

    performVerification();
  }, [token, verifyEmail]);

  return (
    <div id="verification_container" className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center transition-all duration-300">
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="flex justify-center text-indigo-600 dark:text-indigo-400">
              <Loader2 className="h-16 w-16 animate-spin" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Verifying Your Email
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we confirm your email verification...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="flex justify-center text-emerald-500">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Email Verified!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thank you for verifying your email address. Your account is now fully activated.
            </p>
            <div>
              <button
                id="goto_login_from_verify"
                onClick={() => navigate('/login')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all cursor-pointer"
              >
                <span>Continue to Login</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-6">
            <div className="flex justify-center text-red-500">
              <XCircle className="h-16 w-16" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Verification Failed
            </h2>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {errorMessage}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Try to log in to request a new verification email, or double-check the URL link from your mailbox.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all cursor-pointer"
              >
                Go to Login
              </Link>
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
