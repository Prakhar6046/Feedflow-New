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
  startDate: string;
  endDate: string;
  dateDiff: number;
}
const FishChart = ({
  xAxisData,
  ydata,
  title,
  startDate,
  endDate,
  dateDiff,
}: Iprops) => {
  const chartRef = useRef<Chart<'line'> | any>(null);
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
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 2,
      },
    ],
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
        enabled: true,
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
        title: { display: true, text: title },
        grid: { display: true },
      },
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

  const crosshairLable = (chart: Chart, mousemove: MouseEvent): void => {
    if (!chart || !chart.chartArea) return;

    const {
      ctx,
      chartArea: { right, bottom },
      scales: { x, y },
    } = chart;

    const coorX = mousemove.offsetX;
    const coorY = mousemove.offsetY;

    const xValue = x.getValueForPixel(coorX);
    const yValue = y.getValueForPixel(coorY);

    if (xValue == null || yValue == null) return;

    ctx.save(); // always save before drawing

    ctx.font = '13px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const xLabel = new Date(xValue).toLocaleString();
    const textWidth = ctx.measureText(xLabel).width + 10;

    // Y crosshair label
    ctx.beginPath();
    ctx.fillStyle = 'rgba(51,51,51,255)';
    drawRoundedRect(ctx, right, coorY - 14, 40, 25, 4); // assumes drawRoundedRect is typed
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.fillText(yValue.toFixed(2), right + 20, coorY);

    // X crosshair label
    ctx.beginPath();
    ctx.fillStyle = 'rgba(51,51,51,255)';
    ctx.fillRect(coorX - textWidth / 2, bottom, textWidth, 20);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.fillText(xLabel, coorX, bottom + 10);

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
  const dottedLine = {
    id: 'dottedLine',
    beforeDatasetDraw(chart: any) {
      const {
        ctx,
        data,
        chartArea: { left, right },
        scales: { y },
      } = chart;

      // Calculate the average of the dataset
      const dataset = data?.datasets[0]?.data;
      const avg =
        dataset?.reduce(
          (sum: string, value: string) => Number(sum) + Number(value),
          0,
        ) / dataset?.length;

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

  //custom tooltip plugin block
  const customTooltip = {
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

          ctx.fillText(
            `Date: ${new Date(xValue ?? new Date()).toLocaleDateString()}`,
            xTooltip + 75, // Center text horizontally
            yTooltip + 20, // Adjust vertical position
          );
          ctx.fillText(` Value: ${yValue}`, xTooltip + 75, yTooltip + 40);

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
        plugins={[dottedLine, customTooltip]}
      />
    </div>
  );
};

export default FishChart;
