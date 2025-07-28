'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Chart,
  ChartOptions,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useEffect, useRef } from 'react';
import 'chartjs-adapter-date-fns';
import { ChartDataset } from 'chart.js';
import { Plugin } from 'chart.js';
// Register Chart.js components and plugins
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Tooltip,
  Legend,
  annotationPlugin,
  Title,
);
interface Iprops {
  xAxisData: string[];
  ydata: (string | undefined)[];
  title: string;
  maxVal: string | undefined;
  minVal: string | undefined;
  startDate: string;
  endDate: string;
  dateDiff: number;
  predictedValues: number[] | string[];
}
const WaterTempChart = ({
  xAxisData,
  ydata,
  title,
  maxVal,
  minVal,
  startDate,
  endDate,
  dateDiff,
  predictedValues,
}: Iprops) => {
  const chartRef = useRef<Chart<'line'> | null>(null);
  const getUnit = (diff: number) => {
    if (diff <= 1) return 'hour'; // Use hourly granularity for 1 day or less
    if (diff <= 7) return 'day'; // Use daily granularity for up to a week
    if (diff <= 30) return 'week'; // Use weekly granularity for up to a month
    if (diff <= 365) return 'month'; // Use monthly granularity for up to a year
    return 'year'; // Use yearly granularity for over a year
  };
  const data = {
    labels: xAxisData?.map((date) => new Date(date)),
    datasets: [
      {
        // yAxisID: "first",
        label: `${title} average`,
        data: ydata,
        backgroundColor: 'rgba(30, 144, 255, 0.2)', // Light blue fill
        borderColor: '#1E90FF',
        borderWidth: 2,
        pointBackgroundColor: '#1E90FF', // Fill circle with border color
        pointRadius: 5, // Increase radius
      },
      {
        // yAxisID: "second",
        label: `Predicted Values`,
        data: predictedValues,
        backgroundColor: 'rgba(255, 165, 0, 0.2)', // Light orange fill
        borderColor: '#FFA500',
        borderWidth: 2,
        pointBackgroundColor: '#FFA500', // Fill circle with border color
        pointRadius: 5, // Increase radius
      },
    ] as ChartDataset<'line'>[],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 100,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            if (tooltipItem.datasetIndex === 1) {
              return '';
            }
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
        filter: function (tooltipItem) {
          return tooltipItem.datasetIndex !== 1;
        },
      },

      title: {
        display: true,
        text: title,
        color: 'black',
        font: {
          size: 24, // Increase the font size for the title
          weight: 400, // Optional: Make the font bold
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        position: 'bottom',
        title: { display: true, text: 'Date' },
        grid: { display: false },
        time: {
          unit: getUnit(dateDiff),
          displayFormats: {
            hour: 'MMM d',
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy',
            year: 'yyyy',
          },
        },
        suggestedMax: endDate,
        suggestedMin: startDate,
      },
      y: {
        suggestedMax: maxVal && Number(maxVal) * 2,
        suggestedMin: 0,
        title: { display: true, text: title },
        grid: { display: true },
      },
      // y1: {
      //   position: "left",
      //   title: { display: true, text: "Predicted Values" },
      //   grid: { display: false },
      // },
    },
  };

  const backgroundPlugin: Plugin<'line'> = {
    id: 'backgroundColor',
    beforeDraw: (chart) => {
      const {
        ctx,
        chartArea: { left, right, top },
        scales: { y },
      } = chart;

      ctx.save();

      ctx.fillStyle = 'rgba(238, 62, 62, 0.3)'; // Light red
      ctx.fillRect(
        left,
        y.getPixelForValue(0),
        right - left,
        y.getPixelForValue(Number(minVal)) - y.getPixelForValue(0),
      );
      // Red background
      ctx.fillStyle = 'rgba(238, 62, 62, 0.3)'; // Light red
      ctx.fillRect(
        left,
        y.getPixelForValue(Number(maxVal)),
        right - left,
        top - y.getPixelForValue(Number(maxVal)),
      );
      // Green background
      ctx.fillStyle = 'rgba(144, 238, 144, 0.3)'; // Light green
      ctx.fillRect(
        left,
        y.getPixelForValue(Number(minVal)),
        right - left,
        y.getPixelForValue(Number(maxVal)) - y.getPixelForValue(Number(minVal)),
      );
      ctx.restore();
    },
  };
  const crosshairLine = (chart: Chart, mousemove: MouseEvent) => {
    if (!chart || !chart.chartArea) return;
    const {
      canvas,
      ctx,
      chartArea: { left, right, top, bottom },
    } = chart;
    chart.update('none');
    const coorX = mousemove.offsetX;
    const coorY = mousemove.offsetY;

    if (coorX >= left && coorX <= right && coorY >= top && coorY <= bottom) {
      canvas.style.cursor = 'default';
    } else {
      canvas.style.cursor = 'default';
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    ctx.setLineDash([3, 3]);
    if (coorY >= top && coorY <= bottom && coorX >= left && coorX <= right) {
      ctx.beginPath();
      ctx.moveTo(left, coorY);
      ctx.lineTo(right, coorY);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(coorX, top);
      ctx.lineTo(coorX, bottom);
      ctx.stroke();
      ctx.closePath();
      crosshairLable(chart, mousemove);
      ctx.restore();
    }
  };

  const crosshairLable = (chart: Chart, e: MouseEvent) => {
    const {
      ctx,
      chartArea: { left, right, top, bottom },
    } = chart;
    const { offsetX, offsetY } = e;
    chart.update('none');
    ctx.save();

    if (
      offsetX >= left &&
      offsetX <= right &&
      offsetY >= top &&
      offsetY <= bottom
    ) {
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#666';
      ctx.beginPath();
      ctx.moveTo(left, offsetY);
      ctx.lineTo(right, offsetY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(offsetX, top);
      ctx.lineTo(offsetX, bottom);
      ctx.stroke();
    }

    ctx.restore();
  };
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number | { tl: number; tr: number; br: number; bl: number },
  ) => {
    const r =
      typeof radius === 'number'
        ? { tl: radius, tr: radius, br: radius, bl: radius }
        : { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };

    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + width - r.tr, y);
    ctx.arcTo(x + width, y, x + width, y + r.tr, r.tr);
    ctx.lineTo(x + width, y + height - r.br);
    ctx.arcTo(x + width, y + height, x + width - r.br, y + height, r.br);
    ctx.lineTo(x + r.bl, y + height);
    ctx.arcTo(x, y + height, x, y + height - r.bl, r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.arcTo(x, y, x + r.tl, y, r.tl);
    ctx.closePath();
    ctx.fill();
  };
  const dottedLine: Plugin<'line'> = {
    id: 'dottedLine',
    beforeDatasetDraw(chart) {
      const {
        ctx,
        data,
        chartArea: { left, right, top, bottom },
        scales: { y },
      } = chart;

      // Calculate the average of the dataset
      const dataset = data.datasets[0].data as number[];
      const avg =
        dataset.reduce((sum, val) => sum + Number(val), 0) / dataset.length;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = 'rgba(0, 128, 0, 1)'; // Green color for the dotted line
      ctx.moveTo(left, y.getPixelForValue(avg));
      ctx.lineTo(right, y.getPixelForValue(avg));
      ctx.stroke();

      // Draw the rounded rectangle and label with "avg"
      ctx.fillStyle = 'rgba(0, 128, 0, 1)'; // Green background for the label
      drawRoundedRect(ctx, right, y.getPixelForValue(avg) - 10, 40, 25, 4);
      ctx.font = '13px sans-serif bold';
      ctx.fillStyle = 'white'; // White text color
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(
        'avg', // Label as "avg"
        right + 20,
        y.getPixelForValue(avg) + 3,
      );

      ctx.restore();
    },
  };
  const maxValPlugin = {
    id: 'maxValPlugin',
    beforeDatasetDraw(chart: Chart) {
      const {
        ctx,
        data,
        chartArea: { left, right },
        scales: { y },
      } = chart;

      // Calculate the average of the dataset
      const dataset = data?.datasets[0]?.data;
      const maxValue = Number(maxVal);

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = 'red';
      ctx.moveTo(left, y.getPixelForValue(maxValue));
      ctx.lineTo(right, y.getPixelForValue(maxValue));
      ctx.stroke();

      // Draw the rounded rectangle and label with "avg"
      ctx.fillStyle = 'red'; // Green background for the label
      drawRoundedRect(ctx, right, y.getPixelForValue(maxValue) - 10, 60, 25, 4);
      ctx.font = '13px sans-serif bold';
      ctx.fillStyle = 'white'; // White text color
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(
        'max value', // Label as "avg"
        right + 30,
        y.getPixelForValue(maxValue) + 5,
      );

      ctx.restore();
    },
  };

  const minValPlugin: Plugin<'line'> = {
    id: 'minValPlugin',
    beforeDatasetDraw(chart: Chart) {
      const {
        ctx,
        chartArea: { left, right },
        scales: { y },
      } = chart;

      // Calculate the average of the dataset
      const minValue = Number(minVal);

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = 'red';
      ctx.moveTo(left, y.getPixelForValue(minValue));
      ctx.lineTo(right, y.getPixelForValue(minValue));
      ctx.stroke();

      // Draw the rounded rectangle and label with "avg"
      ctx.fillStyle = 'red'; // Green background for the label
      drawRoundedRect(ctx, right, y.getPixelForValue(minValue) - 10, 60, 25, 4);
      ctx.font = '13px sans-serif bold';
      ctx.fillStyle = 'white'; // White text color
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(
        'min value', // Label as "avg"
        right + 30,
        y.getPixelForValue(minValue) + 5,
      );

      ctx.restore();
    },
  };
  //custom tooltip plugin block
  const customTooltip: Plugin<'line'> = {
    id: 'customTooltip',
    afterDraw(chart: Chart) {
      const {
        ctx,
        chartArea: { left, right, top, bottom },
        scales: { x, y },
      } = chart;

      chart.canvas.addEventListener('mousemove', (e) => tooltipPosition(e));

      const tooltipPosition = (mousemove: MouseEvent) => {
        let xTooltip, yTooltip;
        const rightSide = right - mousemove.offsetX;

        xTooltip =
          rightSide <= 170 ? mousemove.offsetX - 170 : mousemove.offsetX + 20;
        yTooltip =
          mousemove.offsetY <= 90
            ? mousemove.offsetY + 20
            : mousemove.offsetY - 60;

        if (
          mousemove.offsetX >= left &&
          mousemove.offsetX <= right &&
          mousemove.offsetY >= top &&
          mousemove.offsetY <= bottom
        ) {
          ctx.save();

          // Tooltip box
          ctx.beginPath();
          ctx.fillStyle = 'rgba(173, 216, 230, 0.9)';
          ctx.strokeStyle = 'rgba(173, 216, 230, 0.9)';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 5;
          ctx.setLineDash([]);
          ctx.fillRect(xTooltip, yTooltip, 150, 60);
          ctx.strokeRect(xTooltip, yTooltip, 150, 60);
          ctx.closePath();
          ctx.restore();

          // Tooltip text
          ctx.font = '13px sans-serif';
          ctx.fillStyle = '#006d77'; // Teal color for text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const xValue: number | undefined = x.getValueForPixel(
            mousemove.offsetX,
          ); // X-axis value
          const yValue = y.getValueForPixel(mousemove.offsetY)?.toFixed(2); // Y-axis value
          const lineHeight = 20;
          ctx.fillText(
            `Date: ${new Date(xValue ?? new Date()).toLocaleDateString()}`,
            xTooltip + 75, // Center text horizontally
            yTooltip + 20, // Adjust vertical position
          );
          ctx.fillText(`Real Value: ${yValue}`, xTooltip + 75, yTooltip + 40);
          // ctx.fillText(
          //   `Predicted Value: ${yValue}`,
          //   xTooltip + 75,
          //   yTooltip + 60
          // );
          // ctx.fillText("Date       : 1/4/2025", xTooltip + 75, yTooltip + 20);
          // yTooltip + 20+= lineHeight;
          // ctx.fillText("Real Value: 31.90", xTooltip + 75,yTooltip + 20);
          // y += lineHeight;
          // ctx.fillText("Predicted Value: 31.90",xTooltip + 75, yTooltip + 20);

          ctx.restore();
        }
      };
    },
  };

  useEffect(() => {
    const chartInstance = chartRef.current;
    if (chartInstance) {
      const canvas = chartInstance.canvas;
      if (canvas) {
        const handleMouseMove = (e: MouseEvent) =>
          crosshairLine(chartInstance, e);
        canvas.addEventListener('mousemove', handleMouseMove);
        return () => {
          canvas.removeEventListener('mousemove', handleMouseMove);
          if (chartInstance) {
            chartInstance.destroy();
          }
        };
      }
    }
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center chart-container">
      <Line
        ref={chartRef}
        data={data}
        options={options}
        plugins={[
          dottedLine,
          customTooltip,
          backgroundPlugin,
          maxValPlugin,
          minValPlugin,
        ]}
      />
    </div>
  );
};

export default WaterTempChart;
