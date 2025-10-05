import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SleepChart = ({ data = [], height = 300 }) => {
  // Generate sample sleep data for the last 7 days
  const generateSampleData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const deepSleep = [1.5, 2.0, 1.8, 1.2, 2.2, 2.5, 1.0];
    const lightSleep = [3.0, 2.8, 3.2, 3.5, 2.5, 2.0, 3.8];
    const remSleep = [1.2, 1.5, 1.0, 1.8, 1.3, 1.7, 0.8];

    return { days, deepSleep, lightSleep, remSleep };
  };

  const sampleData = generateSampleData();

  const chartData = {
    labels: sampleData.days,
    datasets: [
      {
        label: 'Deep Sleep',
        data: sampleData.deepSleep,
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
        borderRadius: 2,
      },
      {
        label: 'Light Sleep',
        data: sampleData.lightSleep,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 2,
      },
      {
        label: 'REM Sleep',
        data: sampleData.remSleep,
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
        borderRadius: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} hrs`;
          },
          footer: function(context) {
            const total = context.reduce((sum, item) => sum + item.parsed.y, 0);
            return `Total: ${total.toFixed(1)} hours`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Day',
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10
          }
        },
        stacked: true
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Sleep Duration (hrs)',
          font: {
            size: 12
          }
        },
        min: 0,
        max: 8,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 10
          }
        },
        stacked: true
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SleepChart;
