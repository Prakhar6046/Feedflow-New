'use clinet';
import {
  calculateFishGrowthAfricanCatfish,
  calculateFishGrowthRainBowTrout,
  calculateFishGrowthTilapia,
  CommonFeedPredictionHead,
  exportFeedPredictionToXlsx,
  getLocalItem,
} from '@/app/_lib/utils';
import { FarmGroup } from '@/app/_typeModels/production';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Controller, useForm } from 'react-hook-form';
import FishGrowthChart from '../charts/FishGrowthChart';
import FishGrowthTable from '../table/FishGrowthTable';
import { FishFeedingData } from './AdHoc';
import Loader from '../Loader';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { FeedPredictionData } from './FeedUsageOutputs';
import { OrganisationModelResponse } from '@/app/_typeModels/growthModel';
import { getCookie } from 'cookies-next';
import Cookies from 'js-cookie';
import { SingleUser } from '@/app/_typeModels/User';
import toast from 'react-hot-toast';
// import MenuItem from "@mui/material/MenuItem";
import PrintPreviewDialog from '../PrintPreviewDialog';

export interface FarmsFishGrowth {
  farm: string;
  unit: string;
  farmId: string;
  unitId: number;
  fishGrowthData: FishFeedingData[];
}
export const timeIntervalOptions = [
  { id: 1, label: 'Daily', value: 1 },
  { id: 2, label: 'Weekly', value: 7 },
  { id: 3, label: 'Bi-Weekly', value: 14 },
  { id: 4, label: 'Monthly', value: 30 },
];
export const tempSelectionOptions = [
  { label: 'Use Farm Profile', value: 'default' },
  {
    label: 'Specify',
    value: 'new',
  },
];
function FeedingPlanOutput() {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('Print Preview');
  const growthTableRef = useRef<HTMLDivElement | null>(null);
  const feedTableRef = useRef<HTMLDivElement | null>(null);

  const [farmOption, setFarmOptions] = useState<
    {
      id: string;
      option: string;
    }[]
  >([]);
  const [unitOption, setUnitOptions] = useState<
    {
      id: number;
      option: string;
    }[]
  >([]);
  const [startDate, setStartDate] = useState<string | null>(
    dayjs().toISOString(),
  );
  const [endDate, setEndDate] = useState<string | null>(dayjs().toISOString());
  const [flatData, setFlatData] = useState<FarmsFishGrowth[]>([]);
  const [formData, setFomData] = useState<any>();
  const { control, setValue, watch, register } = useForm();
  const [growthModelData, setGrowthModelData] = useState<
    OrganisationModelResponse[]
  >([]);
  const token = getCookie('auth-token');
  const [organisationId, setOrganisationId] = useState<number>(0);
  // Selected dropdown values (declared early so hooks below can use them)
  const selectedFarm = watch('farms');
  const selectedUnit = watch('units');

  const handleComprehensivePreview = async () => {
    if (!flatData.length) return;

    const selectedFarmData = flatData
      ?.filter(
        (val) => val.farmId == watch('farms') && val.unitId == watch('units'),
      )[0];

    if (!selectedFarmData) return;

    // Generate chart image
    const formatedData = selectedFarmData.fishGrowthData.map((val) => ({
      date: val.date,
      fishSize: val.fishSize,
      farmName: selectedFarmData.farm,
      unitName: selectedFarmData.unit,
    }));

    // Create a temporary container for chart
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '1200px';
    tempDiv.style.height = '700px';
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    const chartRef = React.createRef<any>();
    root.render(
      <FishGrowthChart
        ref={chartRef}
        xAxisData={formatedData.map((v) => v.date)}
        yData={formatedData.map((v) => v.fishSize)}
        graphTitle={`Farm: ${selectedFarmData.farm} Unit: ${selectedFarmData.unit}`}
        disableAnimation={true}
      />,
    );

    await new Promise((resolve) => requestAnimationFrame(resolve));
    chartRef.current?.update();
    await new Promise((resolve) => setTimeout(resolve, 50));

    const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    root.unmount();
    document.body.removeChild(tempDiv);

    // Generate supplier table HTML
    const uniqueFeedTypes = Array.from(
      new Set(selectedFarmData?.fishGrowthData?.map((item) => item.feedType)),
    );
    const intakeByFeedType: Record<string, number> = {};

    selectedFarmData?.fishGrowthData?.forEach((item) => {
      const intake = parseFloat(item.feedIntake as string);
      if (!intakeByFeedType[item.feedType]) {
        intakeByFeedType[item.feedType] = 0;
      }
      intakeByFeedType[item.feedType] += isNaN(intake) ? 0 : intake;
    });
    const totalIntake: number = Object.values(intakeByFeedType).reduce(
      (a: number, b: number) => a + b,
      0,
    );
    const totalBags: string = (totalIntake / 20).toFixed(2);

    // Get real input data from formData
    const timeIntervalLabel = timeIntervalOptions.find(
      (opt) => opt.value === formData?.timeInterval,
    )?.label || 'Daily';
    const diffInDays = dayjs(formData?.endDate).diff(
      dayjs(formData?.startDate),
      'days',
    ) + 1;
    const adjustmentFactor = formData?.adjustmentFactor || '0.05';
    const mortalityRate = formData?.mortalityRate || '0.05';
    const wasteFactor = formData?.wasteFactor || '3';
    const fishWeight = formData?.fishWeight || '0';
    const generatedBy = watch('generatedBy') || 'System';
    const generatedOn = dayjs().format('DD/MM/YYYY');

    // Build comprehensive HTML
    const previewHtmlContent = `
    <div style="padding:20px; font-family: Arial, sans-serif; max-width: 1200px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <div>
          <h2 style="color:#06A19B; margin: 0;">Feeding Summary</h2>
          <p style="margin: 5px 0; color: #666;">Farm: ${selectedFarmData.farm} | Unit: ${selectedFarmData.unit}</p>
        </div>
        <div style="text-align: right;">
          <div style="background: #06A19B; color: white; padding: 8px 16px; border-radius: 4px; display: inline-block;">
            Download
          </div>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">Production Report ${selectedFarmData.unit} Fish Far</p>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color:#06A19B; margin-bottom: 15px; font-weight: bold; background: #06A19B; color: white; padding: 8px 12px; border-radius: 4px; display: inline-block;">Inputs:</h3>
        <div style=" grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div><strong style='width:150px'>Start Date:</strong> ${dayjs(formData?.startDate).format('DD/MM/YYYY')}</div>
          <div><strong style='width:150px'>End Date:</strong> ${dayjs(formData?.endDate).format('DD/MM/YYYY')}</div>
          <div><strong style='width:150px'>Days:</strong> ${diffInDays}</div>
          <div><strong style='width:150px'>Farm(s):</strong> ${selectedFarmData.farm}</div>
          <div><strong style='width:150px'>Unit(s):</strong> ${selectedFarmData.unit}</div>
          <div><strong style='width:150px'>Period:</strong> <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${diffInDays} days</span></div>
          <div><strong style='width:150px'>Time interval:</strong> <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${timeIntervalLabel}</span></div>
          <div><strong style='width:150px'>Fish Weight:</strong> <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${fishWeight} g</span></div>
          <div><strong style='width:150px'>Adjustment Factor:</strong> <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${adjustmentFactor}%</span></div>
          <div><strong style='width:150px'>Mortality Rate:</strong> <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${mortalityRate}%</span></div>
          <div><strong style='width:150px'>Waste Factor:</strong> <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${wasteFactor}%</span></div>
          <div><strong style='width:150px'>Generated By:</strong> ${generatedBy}</div>
          <div><strong style='width:150px'>Generated On:</strong> ${generatedOn}</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color:#06A19B; margin-bottom: 15px; font-weight: bold; background: #06A19B; color: white; padding: 8px 12px; border-radius: 4px; display: inline-block;">Supplier Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
             <tr style="background: #06A19B; color: white;">
              <th style="padding: 12px; text-align: left; border: none; font-weight: bold;">Supplier</th>
              <th style="padding: 12px; text-align: left; border: none; font-weight: bold;">Feed type</th>
              <th style="padding: 12px; text-align: left; border: none; font-weight: bold;">Requirement</th>
            </tr>
          </thead>
          <tbody>
            ${uniqueFeedTypes.map((feed) => {
      const feedKg = intakeByFeedType[feed]?.toFixed(2) || 0;
      const feedBags = (intakeByFeedType[feed] / 20)?.toFixed(2) || 0;
      const suppliers = getSupplierName(feed);
      return `
                <tr>
                  <td style="padding: 12px; border: none; background: #f8f9fa;">${suppliers || 'N/A'}</td>
                  <td style="padding: 12px; border: none; background: #f8f9fa;">${feed}</td>
                  <td style="padding: 12px; border: none; background: #f8f9fa;">${feedBags} Bags (${feedKg} kg)</td>
                </tr>
              `;
    }).join('')}
            <tr style="background: #06A19B; color: white;">
              <td style="padding: 12px; border: none;"></td>
              <td style="padding: 12px; border: none;"><strong>Total:</strong></td>
              <td style="padding: 12px; border: none;"><strong>${totalBags} Bags (${totalIntake.toFixed(2)} kg)</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color:#06A19B; margin-bottom: 15px; font-weight: bold; background: #06A19B; color: white; padding: 8px 12px; border-radius: 4px; display: inline-block;">Fish Growth Chart</h3>
        <img src="${imgData}" style="max-width:100%; border:1px solid #ccc; border-radius:8px;"/>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color:#06A19B; margin-bottom: 15px; font-weight: bold; background: #06A19B; color: white; padding: 8px 12px; border-radius: 4px; display: inline-block;">Feeding Plan Details</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #06A19B; color: white;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Date</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Temp(°C)</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Number of Fish</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Fish Size(g)</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Growth(g)</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Feed Type</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Feed Size</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Est. FCR</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Feed Intake (g)</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Feeding Rate</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Monthly rate %/day</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Waste Factor %</th>
              </tr>
            </thead>
            <tbody>
              ${selectedFarmData.fishGrowthData.map((row) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.date}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.averageProjectedTemp || '25'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.numberOfFish || '2000'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.fishSize || '0'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.growth || '0'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.feedType || '-'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.feedSize || '-'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.estimatedFCR || '2.54'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.feedIntake || '0'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.feedingRate || '59.54'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.mortalityRate}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">${row.wasteFactor}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

    setPreviewTitle('Feeding Summary Report Preview');
    setPreviewHtml(previewHtmlContent);
    setPreviewOpen(true);
  };

  const handleComprehensivePDF = async () => {
    if (!flatData.length) return;

    const selectedFarmData = flatData
      ?.filter(
        (val) => val.farmId == watch('farms') && val.unitId == watch('units'),
      )[0];

    if (!selectedFarmData) return;

    // Generate chart image
    const formatedData = selectedFarmData.fishGrowthData.map((val) => ({
      date: val.date,
      fishSize: val.fishSize,
      farmName: selectedFarmData.farm,
      unitName: selectedFarmData.unit,
    }));

    // Create a temporary container for chart
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '1200px';
    tempDiv.style.height = '700px';
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    const chartRef = React.createRef<any>();
    root.render(
      <FishGrowthChart
        ref={chartRef}
        xAxisData={formatedData.map((v) => v.date)}
        yData={formatedData.map((v) => v.fishSize)}
        graphTitle={`Farm: ${selectedFarmData.farm} Unit: ${selectedFarmData.unit}`}
        disableAnimation={true}
      />,
    );

    await new Promise((resolve) => requestAnimationFrame(resolve));
    chartRef.current?.update();
    await new Promise((resolve) => setTimeout(resolve, 50));

    const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    root.unmount();
    document.body.removeChild(tempDiv);

    // Generate supplier table data
    const uniqueFeedTypes = Array.from(
      new Set(selectedFarmData?.fishGrowthData?.map((item) => item.feedType)),
    );
    const intakeByFeedType: Record<string, number> = {};

    selectedFarmData?.fishGrowthData?.forEach((item) => {
      const intake = parseFloat(item.feedIntake as string);
      if (!intakeByFeedType[item.feedType]) {
        intakeByFeedType[item.feedType] = 0;
      }
      intakeByFeedType[item.feedType] += isNaN(intake) ? 0 : intake;
    });
    const totalIntake: number = Object.values(intakeByFeedType).reduce(
      (a: number, b: number) => a + b,
      0,
    );
    const totalBags: string = (totalIntake / 20).toFixed(2);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Header
    pdf.setFillColor(6, 161, 155);
    pdf.rect(0, 0, pageWidth, 20, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Feeding Summary', 15, 12);

    // Farm info
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Farm: ${selectedFarmData.farm} | Unit: ${selectedFarmData.unit}`, 15, 30);

    // Inputs section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(6, 161, 155);
    pdf.text('Inputs:', 15, 45);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    // Get real input data from formData
    const timeIntervalLabel = timeIntervalOptions.find(
      (opt) => opt.value === formData?.timeInterval,
    )?.label || 'Daily';
    const diffInDays = dayjs(formData?.endDate).diff(
      dayjs(formData?.startDate),
      'days',
    ) + 1;
    const adjustmentFactor = formData?.adjustmentFactor || '0.05';
    const mortalityRate = formData?.mortalityRate || '0.05';
    const wasteFactor = formData?.wasteFactor || '3';
    const fishWeight = formData?.fishWeight || '0';
    const generatedBy = watch('generatedBy') || 'System';
    const generatedOn = dayjs().format('DD/MM/YYYY');

    // Create a grid layout for inputs similar to preview
    const inputData = [
      { label: 'Start Date:', value: dayjs(formData?.startDate).format('DD/MM/YYYY') },
      { label: 'End Date:', value: dayjs(formData?.endDate).format('DD/MM/YYYY') },
      { label: 'Days:', value: diffInDays.toString() },
      { label: 'Farm(s):', value: selectedFarmData.farm },
      { label: 'Unit(s):', value: selectedFarmData.unit },
      { label: 'Period:', value: `${diffInDays} days` },
      { label: 'Time interval:', value: timeIntervalLabel },
      { label: 'Fish Weight:', value: `${fishWeight} g` },
      { label: 'Adjustment Factor:', value: `${adjustmentFactor}%` },
      { label: 'Mortality Rate:', value: `${mortalityRate}%` },
      { label: 'Waste Factor:', value: `${wasteFactor}%` },
      { label: 'Generated By:', value: generatedBy },
      { label: 'Generated On:', value: generatedOn },
    ];

    let yPos = 55;
    inputData.forEach((item, index) => {
      if (index % 2 === 0 && index > 0) {
        yPos += 8;
      }
      const xPos = index % 2 === 0 ? 15 : 100;
      pdf.text(`${item.label} ${item.value}`, xPos, yPos);
    });

    // Supplier table
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(6, 161, 155);
    pdf.text('Supplier Summary:', 15, 120);

    // Add supplier table with green header
    const supplierTableY = 130;
    pdf.setFillColor(6, 161, 155);
    pdf.rect(15, supplierTableY, 180, 8, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Supplier', 17, supplierTableY + 5);
    pdf.text('Feed type', 70, supplierTableY + 5);
    pdf.text('Requirement', 120, supplierTableY + 5);

    // Add supplier data
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    let tableRowY = supplierTableY + 12;

    uniqueFeedTypes.forEach((feed) => {
      const feedKg = intakeByFeedType[feed]?.toFixed(2) || 0;
      const feedBags = (intakeByFeedType[feed] / 20)?.toFixed(2) || 0;
      const suppliers = getSupplierName(feed);

      pdf.text(suppliers || 'N/A', 17, tableRowY);
      pdf.text(feed, 70, tableRowY);
      pdf.text(`${feedBags} Bags (${feedKg} kg)`, 120, tableRowY);
      tableRowY += 6;
    });

    // Add total row
    pdf.setFillColor(6, 161, 155);
    pdf.rect(15, tableRowY, 180, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Total:', 70, tableRowY + 5);
    pdf.text(`${totalBags} Bags (${totalIntake.toFixed(2)} kg)`, 120, tableRowY + 5);

    // Add chart image
    const imgWidth = 150;
    const imgHeight = 100;
    const chartY = tableRowY + 15;
    
    // Check if chart fits, if not add new page
    if (chartY + imgHeight > pageHeight - 20) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 15, 15, imgWidth, imgHeight);
    } else {
      pdf.addImage(imgData, 'PNG', 15, chartY, imgWidth, imgHeight);
    }

    // Add new page for feeding plan table
    pdf.addPage();

    // Feeding plan table header
    pdf.setFillColor(6, 161, 155);
    pdf.rect(0, 0, pageWidth, 20, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Feeding Plan Details', 15, 12);

    // Table data - show all data without pagination
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');

    let yPosition = 30;
    const tableData = selectedFarmData.fishGrowthData; // Show all data, no pagination

    tableData.forEach((row, index) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.text(`${row.date}`, 15, yPosition);
      pdf.text(`${row.averageProjectedTemp || '25'}`, 35, yPosition);
      pdf.text(`${row.numberOfFish || '2000'}`, 50, yPosition);
      pdf.text(`${row.fishSize || '0'}`, 70, yPosition);
      pdf.text(`${row.growth || '0'}`, 85, yPosition);
      pdf.text(`${row.feedType || '-'}`, 100, yPosition);
      pdf.text(`${row.feedSize || '-'}`, 115, yPosition);
      pdf.text(`${row.estimatedFCR || '2.54'}`, 130, yPosition);
      pdf.text(`${row.feedIntake || '0'}`, 145, yPosition);
      pdf.text(`${row.feedingRate || '59.54'}`, 160, yPosition);
      pdf.text(`${row.mortalityRate}`, 175, yPosition);

      yPosition += 5;
    });

    // Save PDF
    pdf.save(`Feeding_Summary_${selectedFarmData.farm}_${selectedFarmData.unit}.pdf`);
  };

  const handleGraphPreview = async () => {
    if (!flatData.length) return;

    const formatedData = flatData
      ?.filter(
        (val) => val.farmId == watch('farms') && val.unitId == watch('units'),
      )
      .flatMap((growth) =>
        growth.fishGrowthData.map((val) => ({
          date: val.date,
          fishSize: val.fishSize,
          farmName: growth.farm,
          unitName: growth.unit,
        })),
      );

    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '1200px';
    tempDiv.style.height = '700px';
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    const chartRef = React.createRef<any>();
    root.render(
      <FishGrowthChart
        ref={chartRef}
        xAxisData={formatedData.map((v) => v.date)}
        yData={formatedData.map((v) => v.fishSize)}
        graphTitle={`Farm: ${formatedData[0]?.farmName} Unit: ${formatedData[0]?.unitName}`}
        disableAnimation={true}
      />,
    );

    await new Promise((resolve) => requestAnimationFrame(resolve));
    chartRef.current?.update();
    await new Promise((resolve) => setTimeout(resolve, 50));

    const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    root.unmount();
    document.body.removeChild(tempDiv);

    // Build HTML with embedded chart image
    const previewHtmlContent = `
    <div style="padding:20px; font-family: Arial, sans-serif;">
      <h3 style="color:#06A19B;">Feeding Plan Graph</h3>
      <p><strong>Farm:</strong> ${formatedData[0]?.farmName} | <strong>Unit:</strong> ${formatedData[0]?.unitName}</p>
      <img src="${imgData}" style="max-width:100%; border:1px solid #ccc; border-radius:8px;"/>
    </div>
  `;

    setPreviewTitle('Feeding Plan Graph Preview');
    setPreviewHtml(previewHtmlContent);
    setPreviewOpen(true);
  };
  const generateTablePreviewHtml = (node: HTMLElement, title = 'Preview') => {
    if (!node) return '';

    // Basic CSS for table preview
    const styles = `
    body {
      font-family: "Roboto", sans-serif;
      margin: 0;
      padding: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #06a19b;
      color: #fff;
      font-weight: 600;
      font-size: 16px;
      padding: 8px 12px;
      text-align: left;
    }
    td {
      background: #F5F6F8;
      color: #555555;
      font-weight: 500;
      font-size: 20px;
      padding: 8px 12px;
    }
    .total-row td {
      background: #06a19b !important;
      color: #fff !important;
      font-weight: 600;
    }
    .feed-cell, .supplier-cell {
      border-radius: 8px;
      padding: 8px 12px;
      margin: 8px 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
    }
  `;
    const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>${styles}</style>
      </head>
      <body>
        ${node.outerHTML}
      </body>
    </html>
  `;

    return html;
  };

  const handleGrowthTablePreview = () => {
    if (!flatData.length) return;

    const formatedData = flatData
      ?.filter(
        (val) => val.farmId == watch('farms') && val.unitId == watch('units'),
      )
      .flatMap((growth) =>
        growth.fishGrowthData.map((val) => ({
          date: val.date,
          fishSize: val.fishSize,
          averageProjectedTemp: val.averageProjectedTemp,
          numberOfFish: val.numberOfFish,
          growth: val.growth,
          feedType: val.feedType,
          feedSize: val.feedSize,
          estimatedFCR: val.estimatedFCR,
          feedIntake: val.feedIntake,
          feedingRate: val.feedingRate,
          mortalityRate: val.mortalityRate,
          wasteFactor: val.wasteFactor,
        })),
      );

    const previewHtmlContent = `
      <div style="padding:20px; font-family: Arial, sans-serif;">
        <h3 style="color:#06A19B;">Feeding Plan - Full Table</h3>
        <table style="width:100%; border-collapse:collapse; font-size:12px; color:#333;">
          <thead>
            <tr>
              ${CommonFeedPredictionHead.map((h) => `<th style=\"border:1px solid #ccc; padding:8px 12px; background:#06A19B; text-align:left;\">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${formatedData
        .map(
          (row) => `
                <tr>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.date}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.averageProjectedTemp}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.numberOfFish}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.fishSize}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.growth}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.feedType}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.feedSize}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.estimatedFCR}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.feedIntake}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.feedingRate}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.mortalityRate}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${row.wasteFactor}</td>
                </tr>
              `,
        )
        .join('')}
          </tbody>
        </table>
      </div>
    `;

    setPreviewTitle('Feeding Plan - Full Table Preview');
    setPreviewHtml(previewHtmlContent);
    setPreviewOpen(true);
  };

  const createxlsxFile = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (!flatData.length) {
      return;
    }
    const formatedData = flatData
      ?.filter(
        (val) => val.farmId == watch('farms') && val.unitId == watch('units'),
      )
      .flatMap((growth) =>
        growth.fishGrowthData.map((val) => ({
          date: val.date,
          teamp: val.averageProjectedTemp,
          noOfFish: val.numberOfFish,
          fishSize: val.fishSize,
          growth: val.growth,
          feedType: val.feedType,
          feedSize: val.feedSize,
          estimatedFCR: val.estimatedFCR,
          feedIntake: val.feedIntake,
          feedingRate: val.feedingRate,
          mortalityRate: val.mortalityRate,
          wasteFactor: val.wasteFactor,
        })),
      );
    exportFeedPredictionToXlsx(
      e,
      CommonFeedPredictionHead,
      formatedData,
      'feeding_plan_Data',
    );
  };
  const CreateFeedPredictionPDF = async (
    type: 'table' | 'graph' | 'feedTable',
  ) => {
    if (!flatData.length) {
      return;
    }
    const formatedData = flatData
      ?.filter(
        (val) => val.farmId == watch('farms') && val.unitId == watch('units'),
      )
      .flatMap((growth) =>
        growth.fishGrowthData.map((val) => ({
          date: val.date,
          teamp: val.averageProjectedTemp,
          noOfFish: val.numberOfFish,
          fishSize: val.fishSize,
          growth: val.growth,
          feedType: val.feedType,
          feedSize: val.feedSize,
          estimatedFCR: val.estimatedFCR,
          feedIntake: val.feedIntake,
          feedingRate: val.feedingRate,
          mortalityRate: val.mortalityRate,
          wasteFactor: val.wasteFactor,
          farmName: growth.farm,
          unitName: growth.unit,
          numberOfFish: val.numberOfFish,
          averageProjectedTemp: val.averageProjectedTemp,
        })),
      );

    setLoading(true);
    const chunkArray = <T,>(arr: T[], chunkSize: number): T[][] => {
      const results: T[][] = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        results.push(arr.slice(i, i + chunkSize));
      }
      return results;
    };
    const pdf = new jsPDF({ orientation: 'landscape' });
    const chunks = chunkArray(formatedData, 20);

    for (let i = 0; i < (type === 'table' ? chunks.length : 1); i++) {
      const tempContainer = document.createElement('div');
      document.body.appendChild(tempContainer);
      const chartDiv = document.createElement('div');
      tempContainer.appendChild(chartDiv);
      const root = createRoot(chartDiv);

      const currentChunk = chunks[i];

      root.render(
        <div
          style={{
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            fontFamily: 'Arial, sans-serif',
            margin: 'auto',
          }}
        >
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: 'rgb(6,161,155)',
              boxShadow: '0 0 3px rgb(6, 161, 155)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <img src="/static/img/logo-bigone.jpg" alt="Logo" width={200} />
            <div>
              <h6
                style={{
                  marginBottom: '4px',
                  fontSize: '16px',
                  color: 'white',
                }}
              >
                Feeding Plan Report
              </h6>
            </div>
          </div>

          {type === 'table' ? (
            <div
              style={{
                width: '100%',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  width: '100%',
                  margin: '20px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12px',
                    color: '#333',
                    marginTop: '16px',
                  }}
                >
                  <thead>
                    <tr>
                      {CommonFeedPredictionHead?.map(
                        (head: string, idx: number) => (
                          <th
                            key={idx}
                            style={{
                              border: '1px solid #ccc',
                              padding: '8px 12px',
                              textAlign: 'left',
                              borderTopLeftRadius:
                                idx === CommonFeedPredictionHead.length - 1
                                  ? '8px'
                                  : '0px',
                              background: '#efefef',
                            }}
                          >
                            {head}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChunk?.map((row, index: number) => (
                      <tr key={index}>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.date}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.averageProjectedTemp}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.numberOfFish}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.fishSize}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.growth}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.feedType}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.feedSize}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.estimatedFCR}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.feedIntake}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.feedingRate}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.mortalityRate}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.wasteFactor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : type === 'graph' ? (
            <div style={{ width: '100%', padding: '20px' }}>
              <FishGrowthChart
                xAxisData={formatedData?.map((value) => value?.date) || []}
                yData={formatedData?.map((value) => value?.fishSize) || []}
                graphTitle={`Farm: ${formatedData[0].farmName} Unit: ${formatedData[0].unitName}`}
              />
            </div>
          ) : (
            <div style={{ width: '100%', padding: '20px' }}>
              <Paper
                sx={{
                  overflow: 'hidden',
                  borderRadius: '14px',
                  boxShadow: '0px 0px 16px 5px #0000001A',
                }}
              >
                {flatData
                  .filter(
                    (val) =>
                      val.farmId === watch('farms') &&
                      val.unitId === watch('units'),
                  )
                  .map((growth, index) => {
                    const uniqueFeedTypes = Array.from(
                      new Set(
                        growth?.fishGrowthData?.map((item) => item.feedType),
                      ),
                    ).filter(Boolean);
                    const intakeByFeedType: Record<string, number> = {};

                    growth?.fishGrowthData?.forEach((item) => {
                      const intake = parseFloat(item.feedIntake as string);
                      if (!intakeByFeedType[item.feedType]) {
                        intakeByFeedType[item.feedType] = 0;
                      }
                      intakeByFeedType[item.feedType] += isNaN(intake)
                        ? 0
                        : intake;
                    });
                    const totalIntake: number = Object.values(
                      intakeByFeedType,
                    ).reduce((a: number, b: number) => a + b, 0);
                    const totalBags: string = (totalIntake / 20).toFixed(2);

                    return (
                      <TableContainer component={Paper} key={index}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  borderBottom: 0,
                                  color: '#fff',
                                  background: '#06a19b',
                                  fontSize: {
                                    md: 16,
                                    xs: 14,
                                  },
                                  fontWeight: 600,
                                }}
                              >
                                Supplier
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom: 0,
                                  color: '#fff',
                                  background: '#06a19b',
                                  fontSize: {
                                    md: 16,
                                    xs: 14,
                                  },
                                  fontWeight: 600,
                                }}
                              >
                                Feed
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom: 0,
                                  color: '#fff',
                                  background: '#06a19b',
                                  pr: 0,
                                  fontSize: {
                                    md: 16,
                                    xs: 14,
                                  },
                                  fontWeight: 600,
                                }}
                              >
                                <Typography variant="body2">
                                  {growth.farm}
                                </Typography>
                                <Divider
                                  sx={{
                                    borderWidth: 2,
                                    borderColor: '#fff',
                                    my: 1,
                                  }}
                                />
                                <Typography variant="body2">{`${growth.farm}-${growth.unit}`}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {uniqueFeedTypes.map((feed, idx) => {
                              const feedKg =
                                intakeByFeedType[feed]?.toFixed(2) || 0;
                              const feedBags =
                                (intakeByFeedType[feed] / 20)?.toFixed(2) || 0;
                              return (
                                <TableRow
                                  key={idx}
                                  sx={{ backgroundColor: '#fff' }}
                                >
                                  <TableCell
                                    sx={{
                                      borderBottomWidth: 0,
                                      color: '#555555',
                                      backgroundColor: '#fff',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {getSupplierName(feed)}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      // borderBottomColor: "#F5F6F8",
                                      borderBottomWidth: 0,
                                      color: '#555555',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                      p: 0,
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                        backgroundColor: '#F5F6F8',
                                        borderTopLeftRadius: '8px',
                                        borderBottomLeftRadius: '8px',
                                        padding: '8px 12px',
                                        margin: '8px 0',
                                        textWrap: 'nowrap',
                                      }}
                                    >
                                      {feed}
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      // borderBottomColor: "#F5F6F8",
                                      borderBottomWidth: 0,
                                      color: '#555555',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                      p: 0,
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                        backgroundColor: '#F5F6F8',
                                        padding: '8px 12px',
                                        margin: '8px 0',
                                        textWrap: 'nowrap',
                                      }}
                                    >
                                      {`${feedKg} Kg (${feedBags} Bags)`}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            })}

                            <TableRow sx={{ backgroundColor: '#fff' }}>
                              <TableCell
                                sx={{
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                }}
                              ></TableCell>

                              <TableCell
                                sx={{
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  p: 0,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    padding: '16px 12px',
                                    // margin: "8px 0",
                                    textWrap: 'nowrap',
                                    background: '#06a19b',
                                    color: '#fff',
                                  }}
                                >
                                  Total:
                                </Typography>
                              </TableCell>

                              <TableCell
                                sx={{
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  p: 0,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    padding: '16px 12px',
                                    // margin: "8px 0",
                                    textWrap: 'nowrap',
                                    background: '#06a19b',
                                    color: '#fff',
                                  }}
                                >
                                  {`${totalIntake.toFixed(
                                    2,
                                  )} Kg (${totalBags} Bags)`}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    );
                  })}
              </Paper>
            </div>
          )}
        </div>,
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      const canvas = await html2canvas(chartDiv);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      root.unmount();
      tempContainer.remove();
    }

    pdf.save(`feeding_plan_${type}.pdf`);
    setLoading(false);
  };

  // Fetch organisationId
  useEffect(() => {
    const loggedUser = Cookies.get('logged-user');
    if (loggedUser) {
      try {
        const user: SingleUser = JSON.parse(loggedUser);
        setOrganisationId(user.organisationId);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch growth models for organisation
  useEffect(() => {
    if (!organisationId) return;
    const fetchModels = async () => {
      try {
        const res = await fetch(
          `/api/growth-model?organisationId=${organisationId}`,
        );
        if (!res.ok) throw new Error('Failed to fetch growth models');
        const data = await res.json();
        setGrowthModelData(data.data || []);
      } catch (error) {
        console.error('Error fetching growth model data:', error);
      }
    };
    fetchModels();
  }, [organisationId]);

  // Resolve feedLinks for the currently selected farm + unit (unit-level first, farm-level fallback)
  const currentFeedLinks = useMemo(() => {
    try {
      if (!formData || !selectedFarm || !selectedUnit) return [] as any[];
      const farm = (formData.productionData || []).find(
        (f: any) => String(f.farm.id) === String(selectedFarm),
      );
      const unit = farm?.units?.find(
        (u: any) => String(u.id) === String(selectedUnit),
      );
      const unitLinks =
        unit?.productionUnit?.FeedProfileProductionUnit?.[0]?.feedProfile
          ?.feedLinks || [];
      const farmLinks = farm?.farm?.FeedProfile?.[0]?.feedLinks || [];
      return [...unitLinks, ...farmLinks];
    } catch (e) {
      return [] as any[];
    }
  }, [formData, selectedFarm, selectedUnit]);

  // Helper: get supplier name by feed product name using current feedLinks
  const getSupplierName = (feedProductName: string): string => {
    const link = (currentFeedLinks || []).find(
      (l: any) => l?.feedStore?.productName === feedProductName,
    );
    return link?.feedSupply?.name || '—';
  };

  // Helper: select growth model per farm and unit
  const selectGrowthModelForUnit = (
    farm: any,
    unit: any,
  ): OrganisationModelResponse | null => {
    try {
      // Resolve speciesId prioritising unit-level history
      const unitHistoryArr =
        unit?.fishManageHistory || unit?.FishManageHistory || [];
      const unitHistory =
        Array.isArray(unitHistoryArr) && unitHistoryArr.length > 0
          ? unitHistoryArr[0]
          : null;
      let speciesId =
        unitHistory?.speciesId ||
        unitHistory?.fishSupplyData?.speciesId ||
        unitHistory?.fishSupplyData?.speciesID ||
        null;

      if (!speciesId) {
        // Fallback: search farm-level history by productionUnitId
        const farmHistory = (farm?.FishManageHistory || []).find(
          (h: any) =>
            String(h.productionUnitId) === String(unit?.productionUnit?.id),
        );
        speciesId =
          farmHistory?.speciesId ||
          farmHistory?.fishSupplyData?.speciesId ||
          farmHistory?.fishSupplyData?.speciesID ||
          null;
      }

      // Resolve productionSystemId from farm.productionUnits by productionUnit.id
      const prodUnit = (farm?.productionUnits || []).find(
        (pu: any) => String(pu.id) === String(unit?.productionUnit?.id),
      );
      const productionSystemId = prodUnit?.productionSystemId || null;
      if (!speciesId) {
        // If no species found, use any default model as fallback
        const anyDefault = growthModelData.find((gm) => gm.isDefault);
        if (anyDefault) {
          return anyDefault;
        }
        return null;
      }

      // Step 1: Find exact matches by species AND production system
      const exactMatches = growthModelData.filter((gm) => {
        const sameSpecies = gm.models.specieId === speciesId;
        const sameProductionSystem = productionSystemId
          ? gm.models.productionSystemId === productionSystemId
          : true;
        return sameSpecies && sameProductionSystem;
      });
      if (exactMatches.length === 1) {
        return exactMatches[0];
      }

      if (exactMatches.length > 1) {
        const farmScoped = exactMatches.find(
          (gm) =>
            Array.isArray(gm.selectedFarms) &&
            gm.selectedFarms.some((sf: any) => sf.farmId === farm?.id),
        );
        if (farmScoped) {
          return farmScoped;
        }
        return exactMatches[0];
      }

      // Step 2: If no exact matches → try species-only matches first, then default
      const speciesMatches = growthModelData.filter(
        (gm) => gm.models.specieId === speciesId,
      );
      if (speciesMatches.length === 1) {
        return speciesMatches[0];
      }

      if (speciesMatches.length > 1) {
        const farmScoped = speciesMatches.find(
          (gm) =>
            Array.isArray(gm.selectedFarms) &&
            gm.selectedFarms.some((sf: any) => sf.farmId === farm?.id),
        );
        if (farmScoped) {
          return farmScoped;
        }

        const speciesDefault = speciesMatches.find((gm) => gm.isDefault);
        if (speciesDefault) {
          return speciesDefault;
        }

        return speciesMatches[0];
      }

      // Step 3: If no species matches at all → use any default model
      const anyDefault = growthModelData.find((gm) => gm.isDefault);
      if (anyDefault) {
        return anyDefault;
      }
      return null;
    } catch (e) {
      console.error('Error selecting model for unit', e);
      return null;
    }
  };

  useEffect(() => {
    const selectedFarm: string = watch('farms');

    if (!selectedFarm && farmOption?.length > 0) {
      const defaultFarmId = farmOption[0].id;
      setValue('farms', defaultFarmId);
      return;
    }

    if (selectedFarm) {
      const getProductionUnits = (
        selectedFarm: string,
        detailedFarms: FarmGroup[],
      ) => {
        const matchedFarm = detailedFarms.find(
          (farm) => farm.units[0].farm.id == selectedFarm,
        );
        return {
          productionUnits: matchedFarm?.units || [],
        };
      };

      const result = getProductionUnits(selectedFarm, formData?.productionData);

      const customUnits = result.productionUnits.map((unit) => ({
        id: unit.id,
        option: unit?.productionUnit?.name,
      }));
      setUnitOptions(customUnits);
    }
  }, [watch('farms'), farmOption]);
  useEffect(() => {
    if (unitOption?.length) {
      setValue('units', unitOption[0]?.id);
    }
  }, [unitOption]);
  useEffect(() => {
    const data: FeedPredictionData | null = getLocalItem('feedPredictionData');
    if (data) {
      const customFarms = data?.productionData?.map((farm: FarmGroup) => {
        return {
          option: farm.farm?.name ?? '',
          id: farm.units[0].farm.id ?? '',
        };
      });
      setStartDate(data?.startDate);
      setEndDate(data?.endDate);
      setFarmOptions(customFarms);
      setValue('adjustmentFactor', data.adjustmentFactor);
      setValue('mortalityRate', data.mortalityRate);
      setValue('wasteFactor', data.wasteFactor);
      setFomData(data);
    }
  }, []);

  useEffect(() => {
    if (!formData || !growthModelData.length || !selectedFarm || !selectedUnit)
      return;

    const selectedFlatData = formData.productionData.flatMap(
      (farm: FarmGroup) => {
        // Find the matched unit first
        const matchedUnit = farm.units.find(
          (unit) => unit.id === selectedUnit && farm.farm.id === selectedFarm,
        );

        if (!matchedUnit) return [];
        // const matchedProductionUnit = farm.farm.productionUnits.find(
        //   (pu) => pu.id === matchedUnit.productionUnit.id,
        // );
        // if (!matchedProductionUnit) return [];
        const gm = selectGrowthModelForUnit(matchedUnit.farm, matchedUnit);
        const formattedDate = dayjs(formData.startDate).format('YYYY-MM-DD');
        const diffInDays = dayjs(formData.endDate).diff(
          dayjs(formData.startDate),
          'day',
        );

        const mortalityRate = Number(formData.mortalityRate ?? 0.05);
        const wasteFactor = Number(formData.wasteFactor ?? 3);
        const calculatedData =
          formData.species === 'Rainbow Trout'
            ? calculateFishGrowthRainBowTrout(
              gm,
              Number(formData.fishWeight ?? 0),
              formData.tempSelection === 'default'
                ? Number(matchedUnit.waterTemp ?? 25)
                : Number(formData.temp ?? 25),
              Number(matchedUnit.fishCount ?? 0),
              Number(formData.adjustmentFactor),
              Number(diffInDays),
              formattedDate,
              formData.timeInterval ?? 1,
              matchedUnit,
              wasteFactor,
            )
            : formData.species === 'African Catfish'
              ? calculateFishGrowthAfricanCatfish(
                gm,
                Number(formData.fishWeight ?? 0),
                formData.tempSelection === 'default'
                  ? Number(matchedUnit.waterTemp ?? 25)
                  : Number(formData.temp ?? 25),
                Number(matchedUnit.fishCount ?? 0),
                Number(formData.adjustmentFactor),
                Number(diffInDays),
                formattedDate,
                formData.timeInterval ?? 1,
                matchedUnit,
                wasteFactor,
              )
              : calculateFishGrowthTilapia(
                gm,
                Number(formData.fishWeight ?? 0),
                formData.tempSelection === 'default'
                  ? Number(matchedUnit.waterTemp ?? 25)
                  : Number(formData.temp ?? 25),
                Number(matchedUnit.fishCount ?? 0),
                Number(formData.adjustmentFactor),
                Number(diffInDays),
                formattedDate,
                formData.timeInterval ?? 1,
                matchedUnit,
                wasteFactor,
              );

        // Add mortality rate and waste factor to each row
        const fishGrowthDataWithMortality = calculatedData.map((row) => ({
          ...row,
          mortalityRate: mortalityRate,
          wasteFactor: wasteFactor,
        }));

        return {
          farm: farm.farm.name,
          farmId: matchedUnit?.farm?.id ?? '',
          unitId: matchedUnit.id,
          unit: matchedUnit.productionUnit.name,
          fishGrowthData: fishGrowthDataWithMortality,
        };
      },
    );

    setFlatData(selectedFlatData);
  }, [selectedFarm, selectedUnit, formData, growthModelData]);

  useEffect(() => {
    if (loading) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [loading]);

  if (loading) {
    return (
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        <Loader />
      </Box>
    );
  }
  return (
    <Stack>
      <PrintPreviewDialog
        open={previewOpen}
        title={previewTitle}
        html={previewHtml}
        onClose={() => setPreviewOpen(false)}
      />
      {/* <Box>
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: "#06A19B",
            fontWeight: 600,
            padding: "6px 16px",
            width: "fit-content",
            textTransform: "capitalize",
            borderRadius: "8px",
            mr: 2,
          }}
        >
          Save
        </Button>

        <Button
          type="submit"
          variant="contained"
          sx={{
            background: "#fff",
            color: "#06A19B",
            fontWeight: 600,
            padding: "6px 16px",
            width: "fit-content",
            textTransform: "capitalize",
            borderRadius: "8px",
            border: "1px solid #06A19B",
          }}
        >
          Add dropdown here
        </Button>
      </Box> */}

      <Box mb={5}>
        <Grid container spacing={2} mt={1}>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className="form-input selected" focused>
              <InputLabel
                id="demo-simple-select-label-1 "
                className="custom-input"
              >
                Farms
              </InputLabel>
              <Controller
                name="farms"
                control={control}
                defaultValue={farmOption[0]?.id ?? ''}
                render={({ field }) => (
                  <Select {...field} label="Farm *" value={field.value ?? ''}>
                    {farmOption.map((option) => (
                      <MenuItem value={option.id} key={option.id}>
                        {option.option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className="form-input selected" focused>
              <InputLabel
                id="demo-simple-select-label"
                className="custom-input"
              >
                Units
              </InputLabel>
              <Controller
                name="units"
                control={control}
                defaultValue={unitOption[0]?.id ?? ''}
                render={({ field }) => (
                  <Select {...field} label="Units *" value={field.value ?? ''}>
                    {unitOption.map((option) => (
                      <MenuItem value={option.id} key={option.id}>
                        {option.option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <TextField
              label="Generated By"
              type="text"
              {...register("generatedBy")}
              className="form-input"
              focused
              sx={{
                width: '100%',
              }}
            />
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className={`form-input`} focused>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Generated On"
                  className="date-picker form-input"
                  value={dayjs()} // sets today's date
                  disabled
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={3}>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className={`form-input`} focused>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  className="date-picker form-input"
                  disabled
                  value={dayjs(startDate)}
                  onChange={(value) => {
                    const isoDate = value?.toISOString();
                    if (isoDate) setStartDate(isoDate);
                  }}
                  maxDate={dayjs(endDate)}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className={`form-input`} focused>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={dayjs(endDate)}
                  disabled
                  onChange={(value) => {
                    const isoDate = value?.toISOString();
                    if (isoDate) setEndDate(isoDate);
                  }}
                  sx={{
                    marginTop: '0',
                    borderRadius: '6px',
                  }}
                  className="date-picker form-input"
                  minDate={dayjs(startDate)}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <Box position={'relative'} width={'100%'}>
              <TextField
                label="Adjustment Factor *"
                disabled
                type="text"
                {...register('adjustmentFactor', {
                  required: true,
                  // pattern: ValidationPatterns.numbersWithDot,
                })}
                className="form-input"
                focused
                sx={{
                  width: '100%',
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 13,
                  top: '30%',
                  backgroundColor: 'white',
                  paddingInline: '5px',
                }}
              >
                %
              </Typography>
            </Box>
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <Box position={'relative'} width={'100%'}>
              <TextField
                label="Mortality Rate *"
                disabled
                type="text"
                {...register('mortalityRate', {
                  required: true,
                })}
                className="form-input"
                focused
                sx={{
                  width: '100%',
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 13,
                  top: '30%',
                  backgroundColor: 'white',
                  paddingInline: '5px',
                }}
              >
                %
              </Typography>
            </Box>
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <Box position={'relative'} width={'100%'}>
              <TextField
                label="Waste Factor *"
                disabled
                type="text"
                {...register('wasteFactor', {
                  required: true,
                })}
                className="form-input"
                focused
                sx={{
                  width: '100%',
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 13,
                  top: '30%',
                  backgroundColor: 'white',
                  paddingInline: '5px',
                }}
              >
                %
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Top-right action bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Button
          type="button"
          variant="contained"
          onClick={handleComprehensivePreview}
          sx={{
            background: '#06A19B',
            color: '#fff',
            fontWeight: 600,
            padding: '8px 20px',
            width: 'fit-content',
            textTransform: 'capitalize',
            borderRadius: '8px',
            border: '1px solid #06A19B',
          }}
        >
          Preview Report
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={handleComprehensivePDF}
          sx={{
            background: '#fff',
            color: '#06A19B',
            fontWeight: 600,
            padding: '8px 20px',
            width: 'fit-content',
            textTransform: 'capitalize',
            borderRadius: '8px',
            border: '1px solid #06A19B',
          }}
        >
          Download PDF
        </Button>
      </Box>

      {/* New Layout: Supplier Table at Top */}
      <Box sx={{ mb: 4 }}>
        <Paper
          sx={{
            overflow: 'hidden',
            borderRadius: '14px',
            boxShadow: '0px 0px 16px 5px #0000001A',
          }}
        >
          <Box ref={feedTableRef}>
            {flatData
              .filter(
                (val) =>
                  val.farmId === watch('farms') &&
                  val.unitId === watch('units'),
              )
              .map((growth, index) => {
                const uniqueFeedTypes = Array.from(
                  new Set(
                    growth?.fishGrowthData?.map((item) => item.feedType),
                  ),
                );
                const intakeByFeedType: Record<string, number> = {};

                growth?.fishGrowthData?.forEach((item) => {
                  const intake = parseFloat(item.feedIntake as string);
                  if (!intakeByFeedType[item.feedType]) {
                    intakeByFeedType[item.feedType] = 0;
                  }
                  intakeByFeedType[item.feedType] += isNaN(intake)
                    ? 0
                    : intake;
                });
                const totalIntake: number = Object.values(
                  intakeByFeedType,
                ).reduce((a: number, b: number) => a + b, 0);
                const totalBags: string = (totalIntake / 20).toFixed(2);

                return (
                  <TableContainer component={Paper} key={index}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: 0,
                              color: '#fff',
                              background: '#06a19b',
                              fontSize: {
                                md: 16,
                                xs: 14,
                              },
                              fontWeight: 600,
                            }}
                          >
                            Supplier
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: 0,
                              color: '#fff',
                              background: '#06a19b',
                              fontSize: {
                                md: 16,
                                xs: 14,
                              },
                              fontWeight: 600,
                            }}
                          >
                            Feed
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: 0,
                              color: '#fff',
                              background: '#06a19b',
                              pr: 0,
                              fontSize: {
                                md: 16,
                                xs: 14,
                              },
                              fontWeight: 600,
                            }}
                          >
                            <Typography variant="body2">
                              {growth.farm}
                            </Typography>
                            <Divider
                              sx={{
                                borderWidth: 2,
                                borderColor: '#fff',
                                my: 1,
                              }}
                            />
                            <Typography variant="body2">{`${growth.farm}-${growth.unit}`}</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {uniqueFeedTypes.map((feed, idx) => {
                          const feedKg =
                            intakeByFeedType[feed]?.toFixed(2) || 0;
                          const feedBags =
                            (intakeByFeedType[feed] / 20)?.toFixed(2) || 0;
                          const suppliers = getSupplierName(feed);
                          console.log('suppliers', suppliers);
                          return (
                            <TableRow key={idx}>
                              <TableCell
                                sx={{
                                  borderBottomWidth: 0,
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    backgroundColor: '#F5F6F8',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    margin: '8px 0',
                                  }}
                                >
                                  {suppliers || 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottomWidth: 0,
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  p: 0,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    backgroundColor: '#F5F6F8',
                                    borderTopLeftRadius: '8px',
                                    borderBottomLeftRadius: '8px',
                                    padding: '8px 12px',
                                    margin: '8px 0',
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {feed}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottomWidth: 0,
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  p: 0,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    backgroundColor: '#F5F6F8',
                                    padding: '8px 12px',
                                    margin: '8px 0',
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {`${feedKg} Kg (${feedBags} Bags)`}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}

                        <TableRow>
                          <TableCell
                            sx={{
                              color: '#555555',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                            }}
                          ></TableCell>

                          <TableCell
                            sx={{
                              color: '#555555',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              p: 0,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                padding: '16px 12px',
                                textWrap: 'nowrap',
                                background: '#06a19b',
                                color: '#fff',
                              }}
                            >
                              Total :
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: '#555555',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              p: 0,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                padding: '16px 12px',
                                textWrap: 'nowrap',
                                background: '#06a19b',
                                color: '#fff',
                              }}
                            >
                              {`${totalIntake.toFixed(
                                2,
                              )} Kg (${totalBags} Bags)`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              })}
          </Box>
        </Paper>
        <Box
          mt={3}
          sx={{
            display: 'flex',
            justifyContent: 'end',
            gap: 1.5,
          }}
        >
          <Button
            type="button"
            variant="contained"
            disabled
            sx={{
              background: '#06A19B',
              color: '#fff',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              border: '1px solid #06A19B',
            }}
          >
            Order Feed
          </Button>

          <Button
            type="button"
            variant="contained"
            onClick={() => CreateFeedPredictionPDF('feedTable')}
            sx={{
              background: '#fff',
              color: '#06A19B',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              border: '1px solid #06A19B',
            }}
          >
            Create PDF
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={() => {
              const node = feedTableRef.current;
              if (!node) return;

              const previewHtml = generateTablePreviewHtml(
                node,
                'Feed Requirement',
              );
              setPreviewHtml(previewHtml);
              setPreviewTitle('Feed Requirement');
              setPreviewOpen(true);
            }}
            sx={{
              background: '#06A19B',
              color: '#fff',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              border: '1px solid #06A19B',
            }}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* New Layout: Graph on Left, Feeding Plan Table on Right */}
      <Grid
        container
        spacing={4}
        justifyContent={'space-between'}
        alignItems={'start'}
        sx={{
          mb: '20px',
        }}
      >
        {/* Left Side - Graph */}
        <Grid item xs={6}>
          {flatData
            .filter(
              (val) =>
                val.farmId == watch('farms') && val.unitId == watch('units'),
            )
            .map((growth, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    width: '100%',
                  }}
                >
                  <Box>
                    <FishGrowthChart
                      xAxisData={
                        growth?.fishGrowthData?.map((value) => value?.date) ||
                        []
                      }
                      yData={
                        growth?.fishGrowthData?.map(
                          (value) => value?.fishSize,
                        ) || []
                      }
                      graphTitle={`Farm: ${growth.farm} Unit: ${growth.unit}`}
                    />
                  </Box>
                </Box>
              );
            })}
        </Grid>

        {/* Right Side - Feeding Plan Table */}
        <Grid item xs={6}>
          <Box ref={growthTableRef}>
            {flatData
              .filter(
                (val) =>
                  val.farmId == watch('farms') && val.unitId == watch('units'),
              )
              .map((growth, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                    }}
                  >
                    <FishGrowthTable data={growth.fishGrowthData} key={index} />
                  </Box>
                );
              })}
          </Box>
          <Box
            mt={3}
            sx={{
              display: 'flex',
              justifyContent: 'end',
              gap: 1.5,
            }}
          >
            <Button
              type="button"
              variant="contained"
              onClick={createxlsxFile}
              sx={{
                background: '#06A19B',
                color: '#fff',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
              }}
            >
              Create .Xlsx File
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => CreateFeedPredictionPDF('table')}
              sx={{
                background: '#fff',
                color: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
              }}
            >
              Create PDF
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={handleGrowthTablePreview}
              sx={{
                background: '#06A19B',
                color: '#fff',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
              }}
            >
              Print
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default FeedingPlanOutput;
