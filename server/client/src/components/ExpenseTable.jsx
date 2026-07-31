import React from 'react';
import { Pencil, Trash2, Receipt } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers.js';
import { CATEGORY_COLORS } from '../utils/constants.js';

// Renders the paginated list of expenses with edit/delete actions.
const ExpenseTable = ({ expenses, currency, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!expenses.length) {
    return <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No expenses found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {['Title', 'Category', 'Amount', 'Date', 'Payment', 'Receipt', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {expenses.map((exp) => (
            <tr key={exp._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{exp.title}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className="rounded-full px-2 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[exp.category] || '#6b7280' }}
                >
                  {exp.category}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-red-600">{formatCurrency(exp.amount, currency)}</td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(exp.date)}</td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{exp.paymentMethod}</td>
              <td className="px-4 py-3 text-sm">
                {exp.receipt?.url ? (
                  <a href={exp.receipt.url} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                    <Receipt size={16} />
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(exp)} className="text-gray-500 hover:text-primary-600" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDelete(exp._id)} className="text-gray-500 hover:text-red-600" aria-label="Delete">
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

export default ExpenseTable;
