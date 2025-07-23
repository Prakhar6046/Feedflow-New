'use client';
import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
);
interface IProps {
  xAxisData: (string | undefined)[];
  yData: (string | undefined)[];
  graphTitle: string;
}
const FishGrowthChart = ({ xAxisData, yData, graphTitle }: IProps) => {
  const chartRef = useRef(null);

  const data = {
    labels: xAxisData || [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
    ],
    datasets: [
      {
        label: 'Fish Weight (g)',
        data: yData || [40, 35, 10, 38, 42, 80, 50],
        borderColor: 'rgba(18, 138, 134, 0.7)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(18, 138, 134, 1)',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#999' },
      },
      y: {
        grid: { color: 'rgba(200, 200, 200, 0.3)' },
        ticks: { color: '#999' },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
        intersect: false,
        mode: 'nearest',
      },
      title: {
        display: true,
        text: `Fish Growth ${graphTitle}`,
        color: 'black',
        font: {
          size: 24,
          weight: 'bold',
        },
      },
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  };

  return (
    <div style={{ height: '700px', width: '100%' }} className="mb-5">
      <Line ref={chartRef} data={data} options={options} className="pb-5" />
    </div>
  );
};

export default FishGrowthChart;
