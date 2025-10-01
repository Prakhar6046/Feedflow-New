'use client';
import {
  calculateFishGrowthAfricanCatfish,
  calculateFishGrowthRainBowTrout,
  calculateFishGrowthTilapia,
  CommonFeedPredictionHead,
  exportFeedPredictionToXlsx,
  FeedPredictionHead,
} from '@/app/_lib/utils';
import * as ValidationPatterns from '@/app/_lib/utils/validationPatterns';
import * as ValidationMessages from '@/app/_lib/utils/validationsMessage';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Loader from '../Loader';
import FishGrowthTable from '../table/FishGrowthTable';
import FishGrowthChart from '../charts/FishGrowthChart';
import PrintPreviewDialog from '../PrintPreviewDialog';
import {
  productionSystemOptions,
  speciesOptions,
  timeIntervalOptions,
} from './FeedingPlan';
import { Farm } from '@/app/_typeModels/Farm';
import { Species } from '../feedSupply/NewFeedLibarary';
import { productionSystem } from '../GrowthModel';
import { OrganisationModelResponse } from '@/app/_typeModels/growthModel';
import { getCookie } from 'cookies-next';
import { SingleUser } from '@/app/_typeModels/User';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
interface FormInputs {
  farm: string;
  unit: string;
  startDate: string;
  endDate: string;
  period: number;
  temp: number;
  fishWeight: number;
  numberOfFishs: number;
  adjustmentFactor: number;
  timeInterval: number;
  species: string;
  productionSystem: string;
}
type RawDataItem = {
  date: string;
  teamp: number;
  noOfFish: number;
  fishSize: string;
  growth: number | string;
  feedType: string;
  feedSize: string;
  estimatedFCR: number;
  feedIntake: string;
  feedingRate: string;
  numberOfFish: number;
  averageProjectedTemp: number;
};
export interface FishFeedingData {
  date: string;
  days: number;
  averageProjectedTemp: number;
  estimatedFCR: number;
  expectedWaste: number;
  feedCost: number;
  feedDE: number;
  feedIntake: string;
  feedPrice: number;
  feedProtein: number;
  feedSize: string;
  feedType: string;
  feedingRate: string;
  fishSize: string;
  growth: number | string;
  numberOfFish: number;
  partitionedFCR: number;
}
type Iprops = {
  data: FishFeedingData[];
  setData: (val: FishFeedingData[]) => void;
  farms: Farm[];
  speciesList: Species[];
};

function AdHoc({ data, setData }: Iprops) {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('Print Preview');
  const feedSummaryRef = useRef<HTMLDivElement | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      numberOfFishs: 7500,
      fishWeight: 2,
      adjustmentFactor: 0.05,
      startDate: dayjs().format('YYYY-MM-DD'),
      temp: 24,
      period: 5,
    },
    mode: 'onChange',
  });
  const token = getCookie('auth-token');
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const featuredspeciesList = speciesList.filter((item) => item.isFeatured);
  const [productionSystemList, setProductionSystemList] = useState<
    productionSystem[]
  >([]);
  const featuredproductionSystemList = productionSystemList.filter(
    (item) => item.isFeatured,
  );
  const [growthModelData, setGrowthModelData] = useState<
    OrganisationModelResponse[]
  >([]);

  const [organisationId, setOrganisationId] = useState<number>(0);

  const [selectedGrowthModel, setSelectedGrowthModel] =
    useState<OrganisationModelResponse | null>(null);

  const selectedSpecies = watch('species');
  const selectedProductionSystem = watch('productionSystem');

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speciesRes, productionRes] = await Promise.all([
          fetch('/api/species', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('/api/production-system', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!speciesRes.ok) throw new Error('Failed to fetch species');
        if (!productionRes.ok)
          throw new Error('Failed to fetch production system');

        const speciesData = await speciesRes.json();
        const productionData = await productionRes.json();

        setSpeciesList(speciesData);
        setProductionSystemList(productionData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);
  useEffect(() => {
    if (organisationId > 0) {
      const fetchModels = async () => {
        try {
          const res = await fetch(
            `/api/growth-model?organisationId=${organisationId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = await res.json();
          setGrowthModelData(data.data || []);
        } catch (error) {
          console.error('Error fetching growth model data:', error);
        }
      };

      fetchModels();
    }
  }, [organisationId, token]);
  useEffect(() => {
    if (!selectedSpecies || !selectedProductionSystem) {
      setSelectedGrowthModel(null);
      return;
    }

    const speciesObj = speciesList.find((s) => s.id === selectedSpecies);
    const prodObj = productionSystemList.find(
      (p) => p.id === selectedProductionSystem,
    );

    if (!speciesObj || !prodObj) {
      setSelectedGrowthModel(null);
      return;
    }

    // Exact matches by species and production system
    const filtered = growthModelData.filter(
      (gm) =>
        gm.models.specieId === speciesObj.id &&
        gm.models.productionSystemId === prodObj.id,
    );

    if (filtered.length === 1) {
      setSelectedGrowthModel(filtered[0]);
      return;
    }

    if (filtered.length > 1) {
      const existingModel = filtered.find((gm) => gm.useExistingModel);
      if (existingModel) {
        setSelectedGrowthModel(existingModel);
        return;
      }
      // Fallback to default for this species among all models
      const defaultModelAmongFiltered = filtered.find((gm) => gm.isDefault);
      if (defaultModelAmongFiltered) {
        setSelectedGrowthModel(defaultModelAmongFiltered);
        return;
      }
    }

    // No direct match: use species default regardless of production system
    const defaultModel = growthModelData.find(
      (gm) => gm.models.specieId === speciesObj.id && gm.isDefault,
    );
    if (defaultModel) {
      setSelectedGrowthModel(defaultModel);
      return;
    }

    setSelectedGrowthModel(null);
    toast.error(
      'No growth model available for the selected species and production system.',
    );
  }, [
    selectedSpecies,
    selectedProductionSystem,
    growthModelData,
    speciesList,
    productionSystemList,
  ]);

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const formattedDate = dayjs(data.startDate).format('YYYY-MM-DD');
    const diffInDays = dayjs(data.endDate).diff(dayjs(data.startDate), 'day');
    const speciesObj = speciesList.find((s) => s.id === data.species);
    const speciesName = speciesObj?.name || '';

    if (!selectedGrowthModel) {
      toast.error(
        'No growth model resolved for the selected species and production system.',
      );
      setData([]);
      return;
    }

    if (data) {
      if (speciesName === 'Rainbow Trout') {
        setData(
          calculateFishGrowthRainBowTrout(
            selectedGrowthModel,
            Number(data.fishWeight),
            Number(data.temp),
            Number(data.numberOfFishs),
            Number(data.adjustmentFactor),
            Number(diffInDays),
            formattedDate,
            data?.timeInterval,
          ),
        );
      } else if (speciesName === 'African Catfish') {
        setData(
          calculateFishGrowthAfricanCatfish(
            selectedGrowthModel,
            Number(data.fishWeight),
            Number(data.temp),
            Number(data.numberOfFishs),
            Number(data.adjustmentFactor),
            Number(diffInDays),
            formattedDate,
            data?.timeInterval,
          ),
        );
      } else {
        setData(
          calculateFishGrowthTilapia(
            selectedGrowthModel,
            Number(data.fishWeight),
            Number(data.temp),
            Number(data.numberOfFishs),
            Number(data.adjustmentFactor),
            Number(diffInDays),
            formattedDate,
            data?.timeInterval,
          ),
        );
      }
    }
  };
  const resetAdHocData = () => {
    reset();
    setData([]);
  };
  const CreateFeedPredictionPDF = async () => {
    if (!data.length) {
      return;
    }
    const formatedData: RawDataItem[] = data?.map((val) => {
      return {
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
        numberOfFish: val.numberOfFish,
        averageProjectedTemp: val.averageProjectedTemp,
      };
    });

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

    for (let i = 0; i < chunks.length; i++) {
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
                Feed Prediction Report
              </h6>
            </div>
          </div>
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
                              idx === FeedPredictionHead.length - 1
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

    pdf.save(`ad_hoc_data.pdf`);
    setLoading(false);
  };

  // Build full unpaginated table preview (no pagination chunking)
  const handleFullTablePreview = () => {
    if (!data.length) return;
    const formatedData: RawDataItem[] = data?.map((val) => ({
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
      numberOfFish: val.numberOfFish,
      averageProjectedTemp: val.averageProjectedTemp,
    }));

    const html = `
      <div style="padding:20px; font-family: Arial, sans-serif;">
        <h3 style="color:#06A19B;">Ad-hoc Prediction - Full Table</h3>
        <table style="width:100%; border-collapse:collapse; font-size:12px; color:#333;">
          <thead>
            <tr>
              ${CommonFeedPredictionHead.map((h) => `<th style=\"border:1px solid #ccc; padding:8px 12px; background:#efefef; text-align:left;\">${h}</th>`).join('')}
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
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
    setPreviewTitle('Ad-hoc Prediction - Full Table');
    setPreviewHtml(html);
    setPreviewOpen(true);
  };

  const handleGraphPreview = async () => {
    if (!data.length) return;
    const formatedData = data.map((v) => ({
      date: v.date,
      fishSize: v.fishSize,
    }));

    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    const root = createRoot(tempDiv);
    root.render(
      <FishGrowthChart
        xAxisData={formatedData.map((v) => v.date)}
        yData={formatedData.map((v) => v.fishSize)}
        graphTitle={`Ad-hoc Prediction`}
      />,
    );
    await new Promise((r) => setTimeout(r, 500));
    const canvas = await html2canvas(tempDiv);
    const imgData = canvas.toDataURL('image/png');
    root.unmount();
    document.body.removeChild(tempDiv);

    const html = `
      <div style="padding:20px; font-family: Arial, sans-serif;">
        <h3 style="color:#06A19B;">Ad-hoc Prediction Graph</h3>
        <img src="${imgData}" style="max-width:100%; border:1px solid #ccc; border-radius:8px;"/>
      </div>
    `;
    setPreviewTitle('Ad-hoc Graph Preview');
    setPreviewHtml(html);
    setPreviewOpen(true);
  };

  const createGraphPDF = async () => {
    if (!data.length) return;
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    const root = createRoot(tempDiv);
    root.render(
      <FishGrowthChart
        xAxisData={data.map((v) => v.date)}
        yData={data.map((v) => v.fishSize)}
        graphTitle={`Ad-hoc Prediction`}
      />,
    );
    await new Promise((r) => setTimeout(r, 600));
    const canvas = await html2canvas(tempDiv);
    const imgData = canvas.toDataURL('image/png');
    root.unmount();
    document.body.removeChild(tempDiv);
    const pdf = new jsPDF({ orientation: 'landscape' });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('ad_hoc_graph.pdf');
  };

  // Supplier/Feed summary preview and PDF (aggregated from ad-hoc data)
  const handleFeedSummaryPreview = () => {
    if (!data.length) return;
    const uniqueFeedTypes = Array.from(new Set(data.map((i) => i.feedType)));
    const intakeByFeedType: Record<string, number> = {};
    data.forEach((i) => {
      const v = parseFloat(String(i.feedIntake));
      intakeByFeedType[i.feedType] =
        (intakeByFeedType[i.feedType] || 0) + (isNaN(v) ? 0 : v);
    });
    const totalIntake = Object.values(intakeByFeedType).reduce(
      (a, b) => a + b,
      0,
    );
    const totalBags = (totalIntake / 20).toFixed(2);

    const html = `
      <div style="padding:20px; font-family: Arial, sans-serif;">
        <h3 style="color:#06A19B;">Ad-hoc Prediction - Feed Requirement</h3>
        <table style="width:100%; border-collapse:collapse; font-size:12px; color:#333;">
          <thead>
            <tr>
              <th style=\"border:1px solid #ccc; padding:8px 12px; background:#06a19b; color:#fff; text-align:left;\">Feed</th>
              <th style=\"border:1px solid #ccc; padding:8px 12px; background:#06a19b; color:#fff; text-align:left;\">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${uniqueFeedTypes
              .map((feed) => {
                const kg = (intakeByFeedType[feed] || 0).toFixed(2);
                const bags = ((intakeByFeedType[feed] || 0) / 20).toFixed(2);
                return `<tr>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${feed}</td>
                  <td style=\"border:1px solid #ccc; padding:8px 12px;\">${kg} Kg (${bags} Bags)</td>
                </tr>`;
              })
              .join('')}
            <tr>
              <td style=\"border:1px solid #ccc; padding:12px; font-weight:600; background:#06a19b; color:#fff;\">Total</td>
              <td style=\"border:1px solid #ccc; padding:12px; font-weight:600; background:#06a19b; color:#fff;\">${totalIntake.toFixed(2)} Kg (${totalBags} Bags)</td>
            </tr>
          </tbody>
        </table>
      </div>`;
    setPreviewTitle('Feed Requirement');
    setPreviewHtml(html);
    setPreviewOpen(true);
  };

  const createFeedSummaryPDF = async () => {
    if (!data.length) return;
    // Reuse the rendered DOM for accurate styles
    const node = feedSummaryRef.current;
    if (!node) return;
    const pdf = new jsPDF({ orientation: 'landscape' });
    const canvas = await html2canvas(node);
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('ad_hoc_feed_requirement.pdf');
  };
  const createxlsxFile = (
    e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement, MouseEvent>,
  ) => {
    if (!data.length) {
      return;
    }
    const formatedData = data?.map((val) => {
      return {
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
      };
    });
    exportFeedPredictionToXlsx(
      e,
      CommonFeedPredictionHead,
      formatedData,
      'ad_Hoc_Data',
    );
  };

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} mt={2} mb={5} alignItems={'start'}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <TextField
              label="Farm *"
              type="text"
              {...register('farm', {
                required: true,
              })}
              className="form-input"
              focused
              sx={{
                width: '100%',
              }}
            />
            {errors.farm && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {ValidationMessages.required}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <TextField
              label="Unit *"
              type="text"
              {...register('unit', {
                required: true,
              })}
              className="form-input"
              focused
              sx={{
                width: '100%',
              }}
            />
            {errors.unit && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {ValidationMessages.required}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">Speices *</InputLabel>
              <Controller
                name="species"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select {...field} label="Species *">
                    {featuredspeciesList && featuredspeciesList.length > 0 ? (
                      featuredspeciesList.map((sp) => (
                        <MenuItem key={sp.id} value={sp.id}>
                          {sp.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No species available</MenuItem>
                    )}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          {/* Production System Dropdown */}
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="production-system-label">
                Production System *
              </InputLabel>
              <Controller
                name="productionSystem"
                control={control}
                defaultValue={''}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="production-system-label"
                    label="Production System *"
                  >
                    {featuredproductionSystemList.map((option) => (
                      <MenuItem value={option.id} key={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.productionSystem && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {ValidationMessages.required}
              </Typography>
            )}
          </Grid>
          {/* Growth model selection is automatic; no UI dropdown needed */}
        </Grid>

        <Grid container spacing={3} mt={2} mb={5} alignItems={'start'}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="Start Date * "
                      className="form-input"
                      sx={{ width: '100%' }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          const formattedDate = date.format('YYYY-MM-DD');
                          field.onChange(formattedDate);
                          setValue('startDate', formattedDate);
                          setValue('endDate', '');
                        } else {
                          field.onChange(null);
                          setValue('startDate', '');
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      value={field.value ? dayjs(field.value) : null}
                      maxDate={dayjs(watch('endDate'))}
                    />

                    {error && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="End Date * "
                      className="form-input"
                      sx={{ width: '100%' }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          const formattedDate = date.format('YYYY-MM-DD');
                          field.onChange(formattedDate);
                          setValue('endDate', formattedDate);
                        } else {
                          field.onChange(null);
                          setValue('endDate', '');
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      minDate={dayjs(watch('startDate')).add(1, 'day')}
                      value={field.value ? dayjs(field.value) : null} // Ensure correct rendering
                    />

                    {error && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Period *"
                type="text"
                {...register("period")}
                value={dayjs(watch("endDate")).diff(
                  dayjs(watch("startDate")),
                  "day"
                )}
                disabled
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                days
              </Typography>
            </Box>
          </Grid> */}
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Time Interval *
              </InputLabel>
              <Controller
                name="timeInterval"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <Select {...field} label="Time Interval *">
                    {timeIntervalOptions.map((option) => (
                      <MenuItem value={option.value} key={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <TextField
                label="Average Temperature *"
                type="text"
                {...register('temp', {
                  required: true,
                  pattern: ValidationPatterns.numbersWithDot,
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
                °C
              </Typography>
            </Box>
            {errors.temp && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.temp.type === 'required'
                  ? ValidationMessages.required
                  : errors.temp.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Temp *"
                type="text"
                {...register("temp")}
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                °C
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "This field is required." }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="Start Date * "
                      className="form-input"
                      sx={{ width: "100%" }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          const formattedDate = date.format("YYYY-MM-DD");
                          field.onChange(formattedDate);
                          setValue("startDate", formattedDate);
                        } else {
                          field.onChange(null);
                          setValue("startDate", "");
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      value={field.value ? dayjs(field.value) : null} // Ensure correct rendering
                    />

                    {error && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Period *"
                type="text"
                {...register("period")}
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                days
              </Typography>
            </Box>
          </Grid> */}
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Time Interval *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Time Interval *"
              >
                {timeIntervalOptions.map((option) => {
                  return (
                    <MenuItem value={option.value} key={option.id}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid> */}
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Expected Waste Factory *"
                type="text"
                {...register("expectedWaste")}
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                %
              </Typography>
            </Box>
          </Grid> */}
        </Grid>

        <Grid container spacing={3} mt={2} mb={5} alignItems={'start'}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <TextField
                label="Average Fish Weight *"
                type="text"
                {...register('fishWeight', {
                  required: true,
                  pattern: ValidationPatterns.numbersWithDot,
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
                g
              </Typography>
            </Box>
            {errors.fishWeight && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.fishWeight.type === 'required'
                  ? ValidationMessages.required
                  : errors.fishWeight.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <TextField
                label="Total Number Of Fish *"
                type="text"
                {...register('numberOfFishs', {
                  required: true,
                  pattern: ValidationPatterns.numbersWithDot,
                })}
                className="form-input"
                focused
                sx={{
                  width: '100%',
                }}
              />
              {/* <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                days
              </Typography> */}
            </Box>
            {errors.numberOfFishs && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.numberOfFishs.type === 'required'
                  ? ValidationMessages.required
                  : errors.numberOfFishs.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={2} mb={5} alignItems={'start'}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <Box position={'relative'}>
                <TextField
                  label="Adjustment Factor *"
                  type="text"
                  {...register('adjustmentFactor', {
                    required: true,
                    pattern: ValidationPatterns.numbersWithDot,
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
            </Box>
            {errors.adjustmentFactor && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.adjustmentFactor.type === 'required'
                  ? ValidationMessages.required
                  : errors.adjustmentFactor.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: '#06A19B',
                  fontWeight: 600,
                  padding: '6px 16px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  mt: 1,
                }}
              >
                Generate
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
        >
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
              marginLeft: "auto",
              display: "block",
              my: 3,
            }}
          >
            Generate
          </Button>
        </Box> */}
      </form>
      {data?.length !== 0 && (
        <Box>
          {/* Table actions and table first */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              marginBottom: 3,
            }}
          >
            <Button
              id="basic-button"
              type="button"
              variant="contained"
              onClick={(e) => createxlsxFile(e)}
              sx={{
                background: '#06A19B',
                color: '#fff',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
              }}
            >
              Create .xlsx File
            </Button>

            <Button
              id="basic-button"
              type="button"
              variant="contained"
              onClick={CreateFeedPredictionPDF}
              sx={{
                background: '#fff',
                color: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              }}
            >
              Create PDF
            </Button>

            <Button
              id="basic-button"
              type="button"
              variant="contained"
              onClick={handleFullTablePreview}
              sx={{
                background: '#06A19B',
                color: '#fff',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
              }}
            >
              Print
            </Button>

            <Button
              id="basic-button"
              type="button"
              onClick={resetAdHocData}
              variant="contained"
              sx={{
                background: '#fff',
                color: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              }}
            >
              Reset
            </Button>
          </Box>
          <FishGrowthTable data={data} />
        </Box>
      )}

      {data?.length !== 0 && (
        <Box mt={3}>
          {/* Graph left, Supplier table right */}
          <Grid container spacing={2} alignItems={'stretch'} mb={6}>
            <Grid item xs={12} md={8}>
              <FishGrowthChart
                xAxisData={data?.map((v) => v.date) || []}
                yData={data?.map((v) => v.fishSize) || []}
                graphTitle={`Ad-hoc Prediction`}
              />
              <Box
                display={'flex'}
                gap={1.5}
                justifyContent={'flex-end'}
                mt={1.5}
              >
                <Button
                  type="button"
                  variant="contained"
                  onClick={createGraphPDF}
                  sx={{
                    background: '#06A19B',
                    color: '#fff',
                    fontWeight: 600,
                    padding: '6px 16px',
                    textTransform: 'capitalize',
                    borderRadius: '8px',
                  }}
                >
                  Create Pdf
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleGraphPreview}
                  sx={{
                    background: '#fff',
                    color: '#06A19B',
                    fontWeight: 600,
                    padding: '6px 16px',
                    textTransform: 'capitalize',
                    borderRadius: '8px',
                    border: '1px solid #06A19B',
                  }}
                >
                  Print
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <TableContainer
                component={Paper}
                ref={feedSummaryRef}
                sx={{
                  overflow: 'hidden',
                  borderRadius: '14px',
                  boxShadow: '0px 0px 16px 5px #0000001A'
                }}>
                <Table stickyHeader>
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
                      <TableCell sx={{ borderBottom: 0, color: '#fff', background: '#06a19b', fontWeight: 600 }}>Requirement</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from(new Set(data.map((i) => i.feedType))).map((feed) => {
                      const intake = data.filter((i) => i.feedType === feed).reduce((sum, i) => sum + (parseFloat(String(i.feedIntake)) || 0), 0);
                      const kg = intake.toFixed(2);
                      const bags = (intake / 20).toFixed(2);
                      return (
                        <TableRow key={feed}>
                          <TableCell
                            sx={{
                              borderBottomWidth: 0,
                              color: '#555555',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            SA Feeds
                          </TableCell>
                          <TableCell sx={{
                            borderBottomWidth: 0,
                            color: '#555555',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            p: 0,
                          }}>
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
                              {`${kg} Kg (${bags} Bags)`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {(() => {
                      const total = data.reduce(
                        (sum, i) =>
                          sum + (parseFloat(String(i.feedIntake)) || 0),
                        0,
                      );
                      const totalBags = (total / 20).toFixed(2);
                      return (
                        <TableRow>
                          <TableCell
                            sx={{
                              color: '#555555',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                            }}
                          ></TableCell>
                          <TableCell sx={{ background: '#06a19b', color: '#fff', fontWeight: 600 }}>Total</TableCell>
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
                              {`${total.toFixed(2)} Kg (${totalBags} Bags)`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })()}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                display={'flex'}
                gap={1.5}
                justifyContent={'flex-end'}
                mt={1.5}
              >
                <Button
                  type="button"
                  variant="contained"
                  onClick={createFeedSummaryPDF}
                  sx={{
                    background: '#06A19B',
                    color: '#fff',
                    fontWeight: 600,
                    padding: '6px 16px',
                    textTransform: 'capitalize',
                    borderRadius: '8px',
                  }}
                >
                  Create PDF
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleFeedSummaryPreview}
                  sx={{
                    background: '#fff',
                    color: '#06A19B',
                    fontWeight: 600,
                    padding: '6px 16px',
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
        </Box>
      )}

      {/* {data?.length !== 0 && (
        <div className="mb-5">
          <FishGrowthChart
            xAxisData={data?.map((value) => value?.date) || []}
            yData={data?.map((value) => value?.fishSize) || []}
          />
        </div>
      )} */}
    </Stack>
  );
}

export default AdHoc;
