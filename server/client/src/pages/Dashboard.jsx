import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Sparkles } from 'lucide-react';
import api from '../services/api.js';
import DashboardCards from '../components/DashboardCards.jsx';
import ExpensePieChart from '../components/Charts/ExpensePieChart.jsx';
import MonthlyBarChart from '../components/Charts/MonthlyBarChart.jsx';
import IncomeExpenseLineChart from '../components/Charts/IncomeExpenseLineChart.jsx';
import Loader from '../components/Common/Loader.jsx';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/helpers.js';
import { toast } from 'react-toastify';

// Main dashboard page: summary cards, charts, recent transactions and AI-style insights.
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setSummary(data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <DashboardCards
        balance={summary.balance}
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
        savings={summary.monthlySummary.savings}
        currency={user?.currency}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">Expense by Category</h3>
          <ExpensePieChart data={summary.expenseByCategory} />
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">Monthly Expense</h3>
          <MonthlyBarChart data={summary.monthlyTrend} />
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
        <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">Income vs Expense</h3>
        <IncomeExpenseLineChart expenseTrend={summary.monthlyTrend} incomeTrend={[]} />
      </div>

      <div className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 p-5 text-white shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <Sparkles size={18} /> AI Insights
        </h3>
        <ul className="space-y-1.5 text-sm">
          {summary.insights.map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span>•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
          <h3 className="mb-3 font-semibold text-gray-800 dark:text-white">Recent Expenses</h3>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {summary.recentTransactions.expenses.map((e) => (
              <li key={e._id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-700 dark:text-gray-300">{e.title}</span>
                <span className="font-medium text-red-600">{formatCurrency(e.amount, user?.currency)}</span>
              </li>
            ))}
            {!summary.recentTransactions.expenses.length && (
              <p className="py-4 text-center text-sm text-gray-500">No expenses yet.</p>
            )}
          </ul>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
          <h3 className="mb-3 font-semibold text-gray-800 dark:text-white">Recent Income</h3>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {summary.recentTransactions.incomes.map((i) => (
              <li key={i._id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-700 dark:text-gray-300">{i.source}</span>
                <span className="font-medium text-emerald-600">{formatCurrency(i.amount, user?.currency)}</span>
              </li>
            ))}
            {!summary.recentTransactions.incomes.length && (
              <p className="py-4 text-center text-sm text-gray-500">No income yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
