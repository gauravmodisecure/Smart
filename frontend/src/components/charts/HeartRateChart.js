import React, { useEffect, useRef } from 'react';
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

const HeartRateChart = ({ data = [], height = 300 }) => {
  const chartRef = useRef(null);

  // Generate sample data if no real data is provided
  const generateSampleData = () => {
    const now = new Date();
    const labels = [];
    const values = [];

    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // Every minute for 30 minutes
      labels.push(time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));

      // Generate realistic heart rate data
      const baseRate = 72;
      const variation = Math.sin(i * 0.5) * 15 + Math.random() * 10;
      values.push(Math.round(baseRate + variation));
    }

    return { labels, values };
  };

  const chartData = data.length > 0
    ? {
        labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [{
          label: 'Heart Rate (BPM)',
          data: data.map(d => d.heartRate),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(239, 68, 68)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      }
    : (() => {
        const sampleData = generateSampleData();
        return {
          labels: sampleData.labels,
          datasets: [{
            label: 'Heart Rate (BPM)',
            data: sampleData.values,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgb(239, 68, 68)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
          }]
        };
      })();

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
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Heart Rate: ${context.parsed.y} BPM`;
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
          text: 'BPM',
          font: {
            size: 12
          }
        },
        min: 40,
        max: 120,
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
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default HeartRateChart;
