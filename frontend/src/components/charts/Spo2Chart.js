import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Spo2Chart = ({ data = [], height = 300 }) => {
  // Generate sample SpO2 data
  const generateSampleData = () => {
    const now = new Date();
    const labels = [];
    const values = [];

    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      labels.push(time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));

      // Generate realistic SpO2 data (95-100%)
      const baseSpO2 = 98;
      const variation = Math.sin(i * 0.3) * 2 + Math.random() * 1;
      values.push(Math.round((baseSpO2 + variation) * 10) / 10);
    }

    return { labels, values };
  };

  const sampleData = generateSampleData();

  const chartData = {
    labels: sampleData.labels,
    datasets: [{
      label: 'SpO₂ (%)',
      data: sampleData.values,
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(16, 185, 129)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
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
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `SpO₂: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
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
          },
          maxRotation: 45
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'SpO₂ (%)',
          font: {
            size: 12
          }
        },
        min: 90,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 10
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Spo2Chart;
