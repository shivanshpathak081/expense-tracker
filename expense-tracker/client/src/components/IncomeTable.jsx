import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers.js';

// Renders the paginated list of income entries with edit/delete actions.
const IncomeTable = ({ incomes, currency, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!incomes.length) {
    return <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No income entries found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {['Source', 'Category', 'Amount', 'Date', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {incomes.map((inc) => (
            <tr key={inc._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{inc.source}</td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{inc.category}</td>
              <td className="px-4 py-3 text-sm font-semibold text-emerald-600">{formatCurrency(inc.amount, currency)}</td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(inc.date)}</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(inc)} className="text-gray-500 hover:text-primary-600" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDelete(inc._id)} className="text-gray-500 hover:text-red-600" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeTable;
