import React from 'react';
import { Outlet } from 'react-router-dom';
import { Wallet } from 'lucide-react';

// Centered card layout shared by the Login and Register pages.
const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="rounded-full bg-primary-600 p-2 text-white">
            <Wallet size={22} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">ExpenseTracker Pro</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
