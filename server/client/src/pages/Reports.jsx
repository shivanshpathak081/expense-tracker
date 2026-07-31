import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api.js';
import Loader from '../components/Common/Loader.jsx';
import Button from '../components/Common/Button.jsx';
import MonthlyBarChart from '../components/Charts/MonthlyBarChart.jsx';
import ExpensePieChart from '../components/Charts/ExpensePieChart.jsx';
import { formatCurrency, getErrorMessage } from '../utils/helpers.js';

// Reports page: monthly/category breakdown plus CSV export (client-side generated).
const Reports = () => {
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

  const downloadCSV = () => {
    if (!summary) return;
    const rows = [
      ['Category', 'Total Spent'],
      ...summary.expenseByCategory.map((c) => [c.category, c.total]),
    ];
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expense-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader fullScreen />;
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <Button onClick={downloadCSV}>
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">Category Breakdown</h3>
          <ExpensePieChart data={summary.expenseByCategory} />
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">Monthly Trend</h3>
          <MonthlyBarChart data={summary.monthlyTrend} />
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
        <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">Category Totals</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <th className="py-2">Category</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {summary.expenseByCategory.map((c) => (
              <tr key={c.category} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 text-gray-700 dark:text-gray-300">{c.category}</td>
                <td className="py-2 font-medium text-gray-900 dark:text-white">{formatCurrency(c.total, user?.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400">
        Note: this report exports as CSV (opens in Excel/Sheets). PDF export can be added with a library like jsPDF if needed.
      </p>
    </div>
  );
};

export default Reports;
