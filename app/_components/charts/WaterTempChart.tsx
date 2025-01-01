"use client";
import { Line } from "react-chartjs-2";
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
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { useEffect, useRef } from "react";
import "chartjs-adapter-date-fns";
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
  Title
);
interface Iprops {
  xAxisData: string[];
  ydata: (String | undefined)[];
  title: string;
  maxVal: any;
}
const WaterTempChart = ({ xAxisData, ydata, title, maxVal }: Iprops) => {
  const chartRef = useRef<Chart | any>(null);
  let waterDropletImage = useRef<HTMLImageElement | null>(null);
  const data = {
    labels: xAxisData?.map((date) => new Date(date)),
    datasets: [
      {
        label: "Batch average",
        data: ydata || [1, 2, 34, 55],
        borderColor: "rgba(83, 199, 83, 0.3)",
        backgroundColor: "green",
        pointRadius: 5,

        pointStyle: () => {
          return waterDropletImage.current || "circle"; // Use the image or fallback
        },
        pointHoverRadius: 7,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
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
        color: "black",
        font: {
          size: 24, // Increase the font size for the title
          weight: 400, // Optional: Make the font bold
        },
      },
    },
    scales: {
      x: {
        type: "time", // Set scale type to "time" for date handling
        position: "bottom",
        title: { display: true, text: "Date" },
        grid: { display: false },
        time: {
          unit: "hour", // Choose unit for better granularity (e.g., 'hour', 'day')
          displayFormats: {
            hour: "MMM d, yyyy, h:mm a", // Display the year along with the date and time
          },
        },
      },
      y: {
        suggestedMax: maxVal && Number(maxVal) * 2,
        suggestedMin: 0,
        title: { display: true, text: title },
        grid: { display: true },
      },
    },
  };
  const customImagePlugin = {
    id: "customImagePoints",
    afterDraw(chart: Chart) {
      const { ctx } = chart;

      // Check if the image has been loaded and is available
      if (waterDropletImage.current) {
        const img = waterDropletImage.current;

        // Only draw the image if it's fully loaded
        if (img.complete) {
          chart.data.datasets[0].data.forEach((_, index) => {
            const meta = chart.getDatasetMeta(0);
            const x = meta.data[index].x;
            const y = meta.data[index].y;

            // Draw the image at the appropriate position
            ctx.drawImage(
              img,
              x - 10, // Adjust position
              y - 10,
              20, // Width
              20 // Height
            );
          });
        } else {
          console.warn("Image not loaded yet");
        }
      }
    },
  };
  const backgroundPlugin = {
    id: "backgroundColor",
    beforeDraw: (chart: any) => {
      const {
        ctx,
        chartArea: { left, right, top },
        scales: { y },
      } = chart;

      ctx.save();
      // Green background
      ctx.fillStyle = "rgba(144, 238, 144, 0.3)"; // Light green
      ctx.fillRect(
        left,
        y.getPixelForValue(0),
        right - left,
        y.getPixelForValue(Number(maxVal)) - y.getPixelForValue(0)
      );
      // Red background
      ctx.fillStyle = "rgba(238, 62, 62, 0.3)"; // Light red
      ctx.fillRect(
        left,
        y.getPixelForValue(Number(maxVal)),
        right - left,
        top - y.getPixelForValue(Number(maxVal))
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
    chart.update("none");
    const coorX = mousemove.offsetX;
    const coorY = mousemove.offsetY;

    if (coorX >= left && coorX <= right && coorY >= top && coorY <= bottom) {
      canvas.style.cursor = "default";
    } else {
      canvas.style.cursor = "default";
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#666";
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

  const crosshairLable = (chart: any, mousemove: MouseEvent) => {
    const {
      ctx,
      chartArea: { left, right, top, bottom, width, height },
      scales: { x, y },
    } = chart;
    const coorX = mousemove.offsetX;
    const coorY = mousemove.offsetY;
    const textWidth =
      ctx.measureText(new Date(x.getValueForPixel(coorX)).toLocaleString())
        .width + 10;
    ctx.font = "13px sans-serif bold";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.beginPath();
    ctx.fillStyle = "rgba(51,51,51,255)";
    drawRoundedRect(ctx, right, coorY - 14, 40, 25, 4);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fillText(y.getValueForPixel(coorY).toFixed(2), right + 20, coorY);
    ctx.beginPath();
    ctx.fillStyle = "rgba(51,51,51,255)";
    ctx.fillRect(coorX - textWidth / 2, bottom, textWidth, 20);
    ctx.closePath();
    ctx.fillStyle = "white";
    const nearestValue = x.getValueForPixel(coorX);
    if (nearestValue !== undefined) {
      ctx.fillText(
        new Date(x.getValueForPixel(coorX)).toLocaleString(),
        coorX,
        bottom + 10
      );
    }
    ctx.restore();
  };
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: any
  ) => {
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      const defaultRadius: any = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (let side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.arcTo(x + width, y, x + width, y + radius.tr, radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.arcTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height,
      radius.br
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius.bl, radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.arcTo(x, y, x + radius.tl, y, radius.tl);
    ctx.closePath();
    ctx.fill();
  };
  const dottedLine = {
    id: "dottedLine",
    beforeDatasetDraw(chart: any) {
      const {
        ctx,
        data,
        chartArea: { left, right, top, bottom },
        scales: { y },
      } = chart;

      // Calculate the average of the dataset
      const dataset = data?.datasets[0]?.data;
      const avg =
        dataset?.reduce(
          (sum: string, value: string) => Number(sum) + Number(value),
          0
        ) / dataset?.length;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "rgba(0, 128, 0, 1)"; // Green color for the dotted line
      ctx.moveTo(left, y.getPixelForValue(avg));
      ctx.lineTo(right, y.getPixelForValue(avg));
      ctx.stroke();

      // Draw the rounded rectangle and label with "avg"
      ctx.fillStyle = "rgba(0, 128, 0, 1)"; // Green background for the label
      drawRoundedRect(ctx, right, y.getPixelForValue(avg) - 10, 40, 25, 4);
      ctx.font = "13px sans-serif bold";
      ctx.fillStyle = "white"; // White text color
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        "avg", // Label as "avg"
        right + 20,
        y.getPixelForValue(avg) + 3
      );

      ctx.restore();
    },
  };
  const maxValPlugin = {
    id: "maxValPlugin",
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
      ctx.strokeStyle = "red";
      ctx.moveTo(left, y.getPixelForValue(maxValue));
      ctx.lineTo(right, y.getPixelForValue(maxValue));
      ctx.stroke();

      // Draw the rounded rectangle and label with "avg"
      ctx.fillStyle = "red"; // Green background for the label
      drawRoundedRect(ctx, right, y.getPixelForValue(maxValue) - 10, 60, 25, 4);
      ctx.font = "13px sans-serif bold";
      ctx.fillStyle = "white"; // White text color
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        "max value", // Label as "avg"
        right + 30,
        y.getPixelForValue(maxValue) + 5
      );

      ctx.restore();
    },
  };
  //custom tooltip plugin block
  const customTooltip = {
    id: "customTooltip",
    afterDraw(chart: Chart) {
      const {
        ctx,
        chartArea: { left, right, top, bottom },
        scales: { x, y },
      } = chart;

      chart.canvas.addEventListener("mousemove", (e) => tooltipPosition(e));

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
          ctx.fillStyle = "rgba(173, 216, 230, 0.9)";
          ctx.strokeStyle = "rgba(173, 216, 230, 0.9)";
          ctx.lineJoin = "round";
          ctx.lineWidth = 5;
          ctx.setLineDash([]);
          ctx.fillRect(xTooltip, yTooltip, 150, 60);
          ctx.strokeRect(xTooltip, yTooltip, 150, 60);
          ctx.closePath();
          ctx.restore();

          // Tooltip text
          ctx.font = "13px sans-serif";
          ctx.fillStyle = "#006d77"; // Teal color for text
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const xValue: number | any = x.getValueForPixel(mousemove.offsetX); // X-axis value
          const yValue = y.getValueForPixel(mousemove.offsetY)?.toFixed(2); // Y-axis value

          ctx.fillText(
            `Date: ${new Date(xValue).toLocaleDateString()}`,
            xTooltip + 75, // Center text horizontally
            yTooltip + 20 // Adjust vertical position
          );
          ctx.fillText(`Value: ${yValue}`, xTooltip + 75, yTooltip + 40);

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
        canvas.addEventListener("mousemove", handleMouseMove);
        return () => {
          canvas.removeEventListener("mousemove", handleMouseMove);
          if (chartInstance) {
            chartInstance.destroy();
          }
        };
      }
    }
  }, []);
  useEffect(() => {
    // Create the image and set its source
    const img = new Image();
    img.src = "/static/img/water-drop.svg"; // Replace with the actual image path

    // Handle successful load
    img.onload = () => {
      waterDropletImage.current = img;
      if (chartRef.current) {
        chartRef.current.update(); // Update the chart when the image is loaded
      }
    };

    // Handle error during load
    img.onerror = () => {
      console.error("Failed to load image:", img.src);
      waterDropletImage.current = null; // Set to null if the image failed to load
    };
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
          customImagePlugin,
          maxValPlugin,
        ]}
      />
    </div>
  );
};

export default WaterTempChart;
