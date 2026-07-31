import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../utils/helpers.js';

// Top-of-dashboard summary cards: balance, income, expense, savings.
const DashboardCards = ({ balance, totalIncome, totalExpense, savings, currency }) => {
  const cards = [
    { label: 'Current Balance', value: balance, icon: Wallet, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' },
    { label: 'Total Income', value: totalIncome, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Total Expense', value: totalExpense, icon: TrendingDown, color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
    { label: 'This Month Savings', value: savings, icon: PiggyBank, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(value, currency)}</p>
            </div>
            <div className={`rounded-full p-3 ${color}`}>
              <Icon size={22} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
