import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { MONTH_NAMES } from '../../utils/constants.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Bar chart showing total expenses per month over the trailing period.
const MonthlyBarChart = ({ data }) => {
  if (!data?.length) {
    return <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No monthly data yet.</p>;
  }

  const chartData = {
    labels: data.map((d) => `${MONTH_NAMES[d.month - 1]} ${d.year}`),
    datasets: [
      {
        label: 'Expenses',
        data: data.map((d) => d.total),
        backgroundColor: '#6366f1',
        borderRadius: 6,
      },
    ],
  };

  return (
    <Bar
      data={chartData}
      options={{
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
        maintainAspectRatio: true,
      }}
    />
  );
};

export default MonthlyBarChart;
