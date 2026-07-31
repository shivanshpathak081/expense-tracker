import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

// 404 page shown for any unmatched route.
const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center dark:bg-gray-900">
    <Compass size={48} className="text-primary-500" />
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
    <p className="text-gray-600 dark:text-gray-400">The page you're looking for doesn't exist.</p>
    <Link to="/dashboard" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
