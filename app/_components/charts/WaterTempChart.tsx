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
  ydata: string[];
  title: string;
}
const WaterTempChart = ({ xAxisData, ydata, title }: Iprops) => {
  console.log(xAxisData);
  const chartRef = useRef(null);
  const waterDropletImage = useRef<HTMLImageElement | null>(null);
  const data = {
    labels: xAxisData.map((date) => new Date(date)),
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
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
          weight: "bold", // Optional: Make the font bold
        },
      },
      // annotation: {
      //   annotations: {
      //     maxLine: {
      //       type: "line",
      //       yMin: 50, // Max value line
      //       yMax: 50,
      //       borderColor: "red",
      //       borderWidth: 2,
      //       label: {
      //         content: "spec max",
      //         enabled: true,
      //         position: "center", // Try changing to "start" or "center"
      //         backgroundColor: "rgba(255, 255, 255, 0.9)", // Light background
      //         borderColor: "red",
      //         borderWidth: 1,
      //         borderRadius: 4, // Rounded corners
      //         padding: 6,
      //         color: "red", // Text color
      //         font: {
      //           size: 12, // Font size for the label
      //           weight: "bold",
      //         },
      //       },
      //     },
      //   },
      // },
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
            hour: "MMM d, h:mm a", // Customize the display format
          },
        },
      },
      y: {
        title: { display: true, text: title },
        grid: { display: true },
      },
    },
  };
  const customImagePlugin = {
    id: "customImagePoints",
    afterDraw(chart) {
      const { ctx } = chart;
      if (waterDropletImage.complete) {
        chart.data.datasets[0].data.forEach((point, index) => {
          const meta = chart.getDatasetMeta(0);
          const x = meta.data[index].x;
          const y = meta.data[index].y;

          ctx.drawImage(
            waterDropletImage,
            x - 10, // Adjust position
            y - 10,
            20, // Width
            20 // Height
          );
        });
      } else {
        console.warn("Image not loaded yet");
      }
    },
  };
  const backgroundPlugin = {
    id: "backgroundColor",
    beforeDraw: (chart: any) => {
      const {
        ctx,
        chartArea: { top, bottom, left, right },
        scales: { y },
      } = chart;

      ctx.save();
      // Green background
      ctx.fillStyle = "rgba(144, 238, 144, 0.3)"; // Light green
      ctx.fillRect(
        left,
        y.getPixelForValue(0),
        right - left,
        y.getPixelForValue(60) - y.getPixelForValue(0)
      );
      // Red background
      ctx.fillStyle = "rgba(255, 99, 132, 0.3)"; // Light red
      ctx.fillRect(
        left,
        y.getPixelForValue(60),
        right - left,
        y.getPixelForValue(140) - y.getPixelForValue(60)
      );
      ctx.restore();
    },
  };
  const crosshairLine = (chart, mousemove) => {
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

  const crosshairLable = (chart, mousemove) => {
    const {
      canvas,
      ctx,
      data,
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
    // const xValue=xAxisData?.
    const nearestValue = x.getValueForPixel(coorX);
    if (nearestValue !== undefined) {
      ctx.fillText(nearestValue, coorX, bottom + 10);
    } else {
      console.warn("No value found for the given pixel");
    }
    ctx.restore();
  };
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
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
    beforeDatasetDraw(chart, arg, options) {
      const {
        ctx,
        data,
        chartArea: { left, right, top, bottom },
        scales: { y },
      } = chart;

      // Calculate the average of the dataset
      const dataset = data?.datasets[0]?.data;
      const avg =
        dataset?.reduce((sum, value) => Number(sum) + Number(value), 0) /
        dataset?.length;

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
    beforeDatasetDraw(chart, arg, options) {
      const {
        ctx,
        data,
        chartArea: { left, right },
        scales: { y },
      } = chart;

      // Calculate the average of the dataset
      const dataset = data?.datasets[0]?.data;
      const maxVal = 60;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "red";
      ctx.moveTo(left, y.getPixelForValue(maxVal));
      ctx.lineTo(right, y.getPixelForValue(maxVal));
      ctx.stroke();

      // Draw the rounded rectangle and label with "avg"
      ctx.fillStyle = "red"; // Green background for the label
      drawRoundedRect(ctx, right, y.getPixelForValue(maxVal) - 10, 60, 25, 4);
      ctx.font = "13px sans-serif bold";
      ctx.fillStyle = "white"; // White text color
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        "max value", // Label as "avg"
        right + 30,
        y.getPixelForValue(maxVal) + 5
      );

      ctx.restore();
    },
  };
  //custom tooltip plugin block
  const customTooltip = {
    id: "customTooltip",
    afterDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        chartArea: { left, right, top, bottom, width, height },
        scales: { x, y },
      } = chart;
      ctx.save();
      chart.canvas.addEventListener("mousemove", (e) => {
        tooltipPosition(e);
      });
      const tooltipPosition = (mousemove) => {
        let xTooltip;
        let yTooltip;
        const rightSide = right - mousemove.offsetX;
        if (rightSide <= 170) {
          xTooltip = mousemove.offsetX - 170;
        } else {
          xTooltip = mousemove.offsetX + 20;
        }
        if (mousemove.offsetY <= 90) {
          yTooltip = mousemove.offsetY + 20;
        } else {
          yTooltip = mousemove.offsetY - 90;
        }
        if (
          mousemove.offsetX >= left &&
          mousemove.offsetX <= right &&
          mousemove.offsetY >= top &&
          mousemove.offsetY <= bottom
        ) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(102,102,102,0.2)";
          ctx.strokeStyle = "rgba(102,102,102,0.2)";
          ctx.lineJoin = "round";
          ctx.lineWidth = 5;
          ctx.setLineDash([]);
          ctx.font = "13px sans-serif bold";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillRect(xTooltip, yTooltip, 100, 50);
          ctx.strokeRect(xTooltip, yTooltip, 100, 50);
          ctx.font = "13px sans-serif bold";
          ctx.fillStyle = "white";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          const mouseX = mousemove.offsetX;
          const mouseY = mousemove.offsetY;
          const xValue = x.getValueForPixel(mouseX); // Get X-axis value
          const yValue = y.getValueForPixel(mouseY);
          ctx.fillText(
            `${xValue} ${yValue.toFixed(2)}`,
            xTooltip + 50,
            yTooltip + 10
          );
          ctx.closePath();
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
        const handleMouseMove = (e) => crosshairLine(chartInstance, e);
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
    <div
      style={{ width: "900px", height: "500px" }}
      className="d-flex justify-content-center align-items-center"
    >
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
