import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Simple pagination control used by Expenses and Income tables.
const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-gray-300 p-2 disabled:opacity-40 dark:border-gray-600"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Page {page} of {pages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="rounded-lg border border-gray-300 p-2 disabled:opacity-40 dark:border-gray-600"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
