import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CATEGORY_COLORS } from '../../utils/constants.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Pie chart showing expense distribution by category.
const ExpensePieChart = ({ data }) => {
  if (!data?.length) {
    return <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No expense data yet.</p>;
  }

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map((d) => CATEGORY_COLORS[d.category] || '#6b7280'),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  return <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: true }} />;
};

export default ExpensePieChart;
