import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { MONTH_NAMES } from '../../utils/constants.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Line chart comparing income vs expense trend across recent months.
const IncomeExpenseLineChart = ({ expenseTrend = [], incomeTrend = [] }) => {
  const months = Array.from(new Set([...expenseTrend, ...incomeTrend].map((d) => `${d.year}-${d.month}`))).sort();

  if (!months.length) {
    return <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No trend data yet.</p>;
  }

  const findTotal = (arr, key) => {
    const [year, month] = key.split('-').map(Number);
    return arr.find((d) => d.year === year && d.month === month)?.total || 0;
  };

  const chartData = {
    labels: months.map((m) => {
      const [year, month] = m.split('-').map(Number);
      return `${MONTH_NAMES[month - 1]} ${year}`;
    }),
    datasets: [
      {
        label: 'Income',
        data: months.map((m) => findTotal(incomeTrend, m)),
        borderColor: '#10b981',
        backgroundColor: '#10b98133',
        tension: 0.3,
      },
      {
        label: 'Expense',
        data: months.map((m) => findTotal(expenseTrend, m)),
        borderColor: '#ef4444',
        backgroundColor: '#ef444433',
        tension: 0.3,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{ plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } }, maintainAspectRatio: true }}
    />
  );
};

export default IncomeExpenseLineChart;
