'use client';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
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
  Tooltip
);

interface IProps {
  xAxisData: (string | undefined)[];
  yData: (string | undefined)[];
  graphTitle: string;
  disableAnimation?: boolean;
}


const FishGrowthChart = forwardRef((props: IProps, ref) => {
  const { xAxisData, yData, graphTitle, disableAnimation } = props;
  const chartRef = useRef<any>(null);

  // Expose `update` to parent via ref
  useImperativeHandle(ref, () => ({
    update: () => chartRef.current?.chartInstance?.update(),
  }));

  const data = {
    labels: xAxisData || [],
    datasets: [
      {
        label: 'Fish Weight (g)',
        data: yData || [],
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
    animation: disableAnimation ? { duration: 0 } : { duration: 800 },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#999' } },
      y: { grid: { color: 'rgba(200,200,200,0.3)' }, ticks: { color: '#999' } },
    },
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true, intersect: false, mode: 'nearest' },
      title: {
        display: true,
        text: `Fish Growth ${graphTitle}`,
        color: 'black',
        font: { size: 24, weight: 'bold' },
      },
    },
    hover: { mode: 'nearest', intersect: false },
  };

  return (
    <div style={{ height: '700px', width: '100%' }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
});

export default FishGrowthChart;
