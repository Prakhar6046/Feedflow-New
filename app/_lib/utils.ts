import toast from 'react-hot-toast';
import {
  FarmGroup,
  FarmGroupUnit,
  Production,
} from '../_typeModels/production';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import { OrganisationModelResponse } from '../_typeModels/growthModel';
import { ProductionUnit } from '../_typeModels/Farm';
export const readableDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });
};

export const productionIntensity = [
  'Intensive',
  'Extensive',
  'Semi-Intensive',
  'Recreational',
];
export const units = ['Hatchery', 'Grow-out', 'Nursery', 'Breeding', 'None'];
export const feedingPhase = [
  'Pre-Starter',
  'Grower',
  'Breeder',
  'Maintenance',
  'Starter',
  'Finisher',
  'None',
];
export const lifeStage = [
  'Fry',
  'Juvenile',
  'Breeder',
  'Adult',
  'Fingerling',
  'Grower',
  'Maintenance',
  'None',
];
export const species = ['Tilapia'];
export const nutritionalPurpose = [
  'Primary Feed Source',
  'Supplementary Feeding',
];
export const nutritionalClass = ['Complete & Balanced', 'Complementary'];
export const ProductFormatCode = [
  'Mash',
  'Compress Pellets',
  'Crumbles',
  'Extruded Pellets',
  'Other',
];
export const Status = [
  'Current',
  'Harvested',
  'Not Allowed',
  'Removed',
  'Transferred',
  'Sold',
];
export const nutritionalGuarantee = ['Minimum', 'Maximum', 'Typical'];

export function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
}
export function getDayMonthDifference(targetDate: any) {
  const currentDate: any = new Date();
  const target: any = new Date(targetDate);

  // Calculate the total difference in time
  const diffTime = target - currentDate;

  // Convert the difference to days
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let months = target.getMonth() - currentDate.getMonth();
  let days = target.getDate() - currentDate.getDate();

  // Adjust for the year difference
  const yearDiff = target.getFullYear() - currentDate.getFullYear();
  months += yearDiff * 12;

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }

  return `${totalDays}/${months}`;
}

export const productionMangeFields = [
  'Stock',
  'Transfer',
  'Harvest',
  'Mortalities',
  'Sample',
];
export const waterQualityFields = ['Sample'];

export const formattedDate = (date: string) => {
  const convertedDate = new Date(date);
  return convertedDate.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'UTC',
  });
};

export const sanitizeIsoString = (isoString: string): string => {
  if (isoString.includes('+') && isoString.endsWith('Z')) {
    return isoString.slice(0, -1);
  }
  return isoString;
};

export const convertDate = (isoString: string): string => {
  try {
    const sanitizedString = sanitizeIsoString(isoString);
    const date = new Date(sanitizedString);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date');
    }

    // Format the date manually
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    return 'Invalid Date';
  }
};
export const removeLocalItem = (itemName: string) => {
  localStorage.removeItem(itemName);
};

export const setLocalItem = (itemName: string, data: any) => {
  localStorage.setItem(itemName, JSON.stringify(data));
};
export const getLocalItem = (itemName: string) => {
  const data = localStorage.getItem(itemName);
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing localStorage item:', error);
    return null;
  }
};

export const Years = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const months = [
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' },
];
export const getCurrentMonth = () => {
  const currentMonth = new Date().getMonth();
  return Years[currentMonth];
};
export const ProductionSortTables = (
  groupedData: FarmGroup[],
  order: string,
  property: string,
  selectedView: string | undefined,
  localData?: boolean,
) => {
  let orderType: number;
  if (localData) {
    orderType = order === 'asc' ? -1 : 1;
  } else {
    orderType = order === 'asc' ? 1 : -1;
  }
  if (groupedData) {
    if (selectedView === 'fish') {
      const sortedData = [...groupedData].sort(
        (production1: FarmGroup, production2: FarmGroup) => {
          if (property === 'Farm') {
            if (production1.farm < production2.farm) return -1 * orderType;
            if (production1.farm > production2.farm) return 1 * orderType;
          } else if (property === 'unit') {
            if (
              production1.units[0].productionUnit.name <
              production2.units[0].productionUnit.name
            )
              return -1 * orderType;
            if (
              production1.units[0].productionUnit.name >
              production2.units[0].productionUnit.name
            )
              return 1 * orderType;
          } else if (property === 'unit') {
            if (
              production1.units[0].productionUnit.name <
              production2.units[0].productionUnit.name
            )
              return -1 * orderType;
            if (
              production1.units[0].productionUnit.name >
              production2.units[0].productionUnit.name
            )
              return 1 * orderType;
          } else if (property === 'Fish') {
            if (production1.units[0].fishCount < production2.units[0].fishCount)
              return -1 * orderType;

            if (production1.units[0].fishCount > production2.units[0].fishCount)
              return 1 * orderType;
          } else if (property === 'Biomass') {
            if (production1.units[0].biomass < production2.units[0].biomass)
              return -1 * orderType;

            if (production1.units[0].biomass > production2.units[0].biomass)
              return 1 * orderType;
          } else if (property === 'Mean weight') {
            if (
              production1.units[0].meanWeight < production2.units[0].meanWeight
            )
              return -1 * orderType;

            if (
              production1.units[0].meanWeight > production2.units[0].meanWeight
            )
              return 1 * orderType;
          } else if (property === 'Mean length') {
            if (
              production1.units[0].meanLength < production2.units[0].meanLength
            )
              return -1 * orderType;

            if (
              production1.units[0].meanLength > production2.units[0].meanLength
            )
              return 1 * orderType;
          } else if (property === 'Stocking Density') {
            if (
              production1.units[0].stockingDensityKG <
              production2.units[0].stockingDensityKG
            )
              return -1 * orderType;

            if (
              production1.units[0].stockingDensityKG >
              production2.units[0].stockingDensityKG
            )
              return 1 * orderType;
          } else if (property === 'Stocking density') {
            if (
              production1.units[0].stockingDensityNM <
              production2.units[0].stockingDensityNM
            )
              return -1 * orderType;

            if (
              production1.units[0].stockingDensityNM >
              production2.units[0].stockingDensityNM
            )
              return 1 * orderType;
          } else if (property === 'Stocking level') {
            if (
              production1.units[0].stockingLevel <
              production2.units[0].stockingLevel
            )
              return -1 * orderType;

            if (
              production1.units[0].stockingLevel >
              production2.units[0].stockingLevel
            )
              return 1 * orderType;
          }
          return 0;
        },
      );
      return sortedData;
    } else if (selectedView === 'water') {
      const sortedData = [...groupedData].sort(
        (production1: FarmGroup, production2: FarmGroup) => {
          if (property === 'Farm') {
            if (production1.farm < production2.farm) return -1 * orderType;
            if (production1.farm > production2.farm) return 1 * orderType;
          } else if (property === 'unit') {
            if (
              production1.units[0].productionUnit.name <
              production2.units[0].productionUnit.name
            )
              return -1 * orderType;
            if (
              production1.units[0].productionUnit.name >
              production2.units[0].productionUnit.name
            )
              return 1 * orderType;
          } else if (property === 'watertemp') {
            if (
              Number(production1.units[0].waterTemp) <
              Number(production2.units[0].waterTemp)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].waterTemp) >
              Number(production2.units[0].waterTemp)
            )
              return 1 * orderType;
          } else if (property === 'Dissolved oxygen') {
            if (
              Number(production1.units[0].DO) < Number(production2.units[0].DO)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].DO) > Number(production2.units[0].DO)
            )
              return 1 * orderType;
          } else if (property === 'tss') {
            if (
              Number(production1.units[0].TSS) <
              Number(production2.units[0].TSS)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].TSS) >
              Number(production2.units[0].TSS)
            )
              return 1 * orderType;
          } else if (property === 'nh4') {
            if (
              Number(production1.units[0].NH4) <
              Number(production2.units[0].NH4)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].NH4) >
              Number(production2.units[0].NH4)
            )
              return 1 * orderType;
          } else if (property === 'no3') {
            if (
              Number(production1.units[0].NO3) <
              Number(production2.units[0].NO3)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].NO3) >
              Number(production2.units[0].NO3)
            )
              return 1 * orderType;
          } else if (property === 'no2') {
            if (
              Number(production1.units[0].NO2) <
              Number(production2.units[0].NO2)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].NO2) >
              Number(production2.units[0].NO2)
            )
              return 1 * orderType;
          } else if (property === 'ph') {
            if (
              Number(production1.units[0].ph) < Number(production2.units[0].ph)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].ph) > Number(production2.units[0].ph)
            )
              return 1 * orderType;
          } else if (property === 'visibility') {
            if (
              Number(production1.units[0].visibility) <
              Number(production2.units[0].visibility)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].visibility) >
              Number(production2.units[0].visibility)
            )
              return 1 * orderType;
          }
          return 0;
        },
      );
      return sortedData;
    }
  }
};
export const averagesDropdown = [
  'Lastest sample average',
  'Monthly average',
  'Yearly average',
  'All-time average',
  'Individual average',
];
export const deleteImage = async (
  payload: {
    id?: number | undefined;
    type?: string | undefined;
    image: string | undefined;
  },
  setProfilePic: (val: string) => void,
) => {
  const response = await fetch(`/api/profile-pic/delete`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    setProfilePic('');
    toast.dismiss();
    toast.success('Image deleted successfully');
  }
};
export const handleUpload = async (
  imagePath: FileList,
  profilePic: string | undefined,
  setProfilePic: (val: string) => void,
) => {
  const file = imagePath[0];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
  if (!allowedTypes.includes(file?.type)) {
    toast.dismiss();
    toast.error(
      'Invalid file type. Please upload an image in .jpg, .jpeg, .png or.svg format.',
    );
    return;
  }
  // Validate file size
  const maxSizeInMB = 2;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    toast.dismiss();
    toast.error(
      `File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`,
    );
    return;
  }

  const formData = new FormData();
  formData.append('image', imagePath[0]);
  const oldImageName = profilePic?.split('/').pop()?.split('.')[0];

  formData.append('oldImageName', oldImageName || '');

  const response = await fetch(`/api/profile-pic/upload/new`, {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const profileData = await response.json();
    setProfilePic(profileData?.data?.url);
    toast.dismiss();
    toast.success('Profile photo successfully uploaded');
  }
};
export const getChartPredictedValues = (
  productions: Production[],
  startDate: string,
  endDate: string,
) => {
  const predictionUnit: any =
    productions?.[0]?.productionUnit?.YearBasedPredicationProductionUnit?.[0];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.getMonth();
  const endMonth = end.getMonth();
  const monthMap: Record<number, string> = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
  };

  const selectedMonths = Object.keys(monthMap)
    .map(Number)
    .filter((month: number) => month >= startMonth && month <= endMonth)
    .map((month: number) => monthMap[month]);
  const filteredValues = predictionUnit?.map(([key, value]: any) => {
    const selectedData = selectedMonths
      .map((month) => value?.[month])
      .filter((val) => val !== undefined);
    return selectedData.length > 0 ? { key, values: selectedData } : null;
  });

  const result = filteredValues?.filter(Boolean);
  return result;
};

export const getFullYear = (inputDate: string) => {
  const cleanedString = inputDate.replace('Z', '');

  const date = new Date(cleanedString);

  if (isNaN(date.getTime())) {
    console.error('Invalid date format');
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
export const exportProductionTableToXlsx = async (
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  view: string | undefined,
  headersData: string[],
  data: any,
) => {
  e.preventDefault();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('data');
  const headers = headersData;
  worksheet.addRow(headers);
  if (!data) {
    return;
  }
  data.forEach((val: FarmGroup) => {
    const units =
      val.units
        ?.map((unit) => unit?.productionUnit?.name)
        .filter(Boolean)
        .join(', ') || '';

    const waterTemps =
      val.units
        ?.map((unit) => (unit?.waterTemp ? unit.waterTemp : null))
        .filter(Boolean)
        .join(', ') || '';

    const batchNumbers =
      val.units
        ?.map((unit) =>
          unit?.fishSupply?.batchNumber ? unit.fishSupply.batchNumber : null,
        )
        .filter(Boolean)
        .join(', ') || '';

    const DO =
      val.units
        ?.map((unit) => (unit?.DO ? unit.DO : null))
        .filter(Boolean)
        .join(', ') || '';

    const age =
      val.units
        ?.map((unit) => (unit?.fishSupply?.age ? unit.fishSupply.age : null))
        .filter(Boolean)
        .join(', ') || '';
    const fishCount =
      val.units
        ?.map((unit) => (unit.fishCount ? unit.fishCount : null))
        .filter(Boolean)
        .join(', ') || '';
    const TSS =
      val.units
        ?.map((unit) => (unit.TSS ? unit.TSS : null))
        .filter(Boolean)
        .join(', ') || '';
    const NH4 =
      val.units
        ?.map((unit) => (unit.NH4 ? unit.NH4 : null))
        .filter(Boolean)
        .join(', ') || '';
    const biomass =
      val.units
        ?.map((unit) => (unit.biomass ? unit.biomass : null))
        .filter(Boolean)
        .join(', ') || '';
    const NO3 =
      val.units
        ?.map((unit) => (unit.NO3 ? unit.NO3 : null))
        .filter(Boolean)
        .join(', ') || '';
    const meanWeight =
      val.units
        ?.map((unit) => (unit.meanWeight ? unit.meanWeight : null))
        .filter(Boolean)
        .join(', ') || '';
    const NO2 =
      val.units
        ?.map((unit) => (unit.NO2 ? unit.NO2 : null))
        .filter(Boolean)
        .join(', ') || '';
    const meanLength =
      val.units
        ?.map((unit) => (unit.meanLength ? unit.meanLength : null))
        .filter(Boolean)
        .join(', ') || '';
    const ph =
      val.units
        ?.map((unit) => (unit.NO2 ? unit.NO2 : null))
        .filter(Boolean)
        .join(', ') || '';
    const stockingDensityKG =
      val.units
        ?.map((unit) =>
          unit.stockingDensityKG
            ? Number(unit.stockingDensityKG || 0).toFixed(2)
            : null,
        )
        .filter(Boolean)
        .join(', ') || '';
    const visibility =
      val.units
        ?.map((unit) => (unit.visibility ? unit.visibility : null))
        .filter(Boolean)
        .join(', ') || '';
    const stockingDensityNM =
      val.units
        ?.map((unit) =>
          unit.stockingDensityNM
            ? Number(unit.stockingDensityNM || 0).toFixed(2)
            : null,
        )
        .filter(Boolean)
        .join(', ') || '';
    const stockingLevel =
      val.units
        ?.map((unit) => (unit.stockingLevel ? unit.stockingLevel : null))
        .filter(Boolean)
        .join(', ') || '';

    worksheet.addRow([
      val.farm ?? '',
      units,
      view === 'water' ? waterTemps : batchNumbers,
      view === 'water' ? DO : age,
      view === 'water' ? TSS : fishCount,
      view === 'water' ? NH4 : biomass,
      view === 'water' ? NO3 : meanWeight,
      view === 'water' ? NO2 : meanLength,
      view === 'water' ? ph : stockingDensityKG,
      view === 'water' ? visibility : stockingDensityNM,
      ...(view !== 'water' ? [stockingLevel] : []),
    ]);
  });

  worksheet.columns = [
    { width: 15 },
    { width: 30 },
    { width: 30 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      if (rowNumber === 1) {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' },
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const fileName = view === 'water' ? 'water_report' : 'fish_report';
  saveAs(blob, `${fileName}.xlsx`);
};
export const exportFeedPredictionToXlsx = async (
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  headerData: string[],
  data: any,
  fileName: string,
) => {
  e.preventDefault();
  if (!data?.length) {
    return;
  }
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('feedPrediction');
  const headers = headerData
    ? headerData
    : [
        'Date',
        'Days',
        'Water Temp',
        'Fish Weight (g)',
        'Number of Fish',
        'Biomass (kg)',
        'Stocking Density',
        'Stocking Density Kg/m3',
        'Feed Phase',
        'Feed Protein (%)',
        'Feed DE (MJ/kg)',
        'Feed Price ($)',
        'Growth (g)',
        'Est. FCR',
        'Partitioned FCR',
        'Feed Intake (g)',
      ];
  // Add headers to the sheet
  worksheet.addRow(headers);

  data.forEach((row: any) => {
    worksheet.addRow(Object.values(row));
  });
  // worksheet.columns = [
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  //   { width: 15 },
  // ];
  worksheet.columns = headers.map(() => ({ width: 15 }));
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      if (rowNumber === 1) {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' },
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${fileName}.xlsx`);
};
export const FeedPredictionHead = [
  'Date',
  'Days',
  'Water Temp',
  'Fish Weight (g)',
  'Number of Fish',
  'Biomass (kg)',
  'Stocking Density',
  'Stocking Density Kg/m3',
  'Feed Phase',
  'Feed Protein (%)',
  'Feed DE (MJ/kg)',
  'Feed Price ($)',
  'Growth (g)',
  'Est. FCR',
  'Partitioned FCR',
  'Feed Intake (g)',
];
export const CommonFeedPredictionHead = [
  'Date',
  'Temp(c)',
  'Number of Fish',
  'Fish Size(g)',
  'Growth(g)',
  'Feed Type',
  'Feed Size',
  'Est. FCR',
  'Feed Intake (g)',
  'Feeding Rate',
  'Mortality rate %/day',
];
function calculateTemparatureCoefficientLogarithmic(a, b, c, T) {
  const tempDiff = T - b;

  if (tempDiff <= 0) {
    return 0;
  }

  const logValue = Math.log(tempDiff);
  const result = a * logValue + c;
  return result;
}
function calculateTemparatureCoefficientPolynomial(a, b, c, d, e, T) {
  return (
    a * Math.pow(T, 0.125) +
    b * Math.pow(T, 0.25) +
    c * Math.pow(T, 0.5) +
    d * Math.pow(T, 1) +
    e
  );
}
function calculateTemparatureCoefficientQuadratic(a, b, c, T) {
  return a * T ** 2 + b * T + c;
}

function calculateDENeedLinear(a, b, IBW, c) {
  return a + b * Math.pow(IBW, c);
}

// function calculateDE(CP, ADC_CP, GE_CP, CF, ADC_CF, GE_CF, NFE, ADC_NFE, GE_NFE) {
//   return (CP * ADC_CP * GE_CP) +
//     (CF * ADC_CF * GE_CF) +
//     (NFE * ADC_NFE * GE_NFE);
// }

function calculateTheoreticalFeedConversionRatio(tDEN, DE, WF) {
  return tDEN / (DE / WF);
}

function calculatefeedIntakeFormula(IBW, TGC, T, tFCR) {
  const rootIBW = Math.pow(IBW, 1 / 3);
  const tgcComponent = TGC * T;
  const growthComponent = Math.pow(rootIBW + tgcComponent, 3) / IBW - 1;
  const feedingRate = Math.max(0, growthComponent * tFCR * 100);

  return feedingRate;
}

function calculateFishSizeUnified(
  currentWeight,
  TGC,
  temperature,
  timeIntervalDays,
) {
  const rootCurrent = Math.pow(currentWeight, 1 / 3);
  const increment = TGC * timeIntervalDays * temperature;
  return Math.pow(rootCurrent + increment, 3);
}

function computeTGCFromModel(model, temperature) {
  const a = model.tgcA;
  const b = model.tgcB;
  const c = model.tgcC;
  const d = model.tgcD;
  const e = model.tgcE;
  const coeff = (model.temperatureCoefficient as string) || '';
  if (coeff === 'Logarithmic' || coeff === 'logarithmic') {
    return calculateTemparatureCoefficientLogarithmic(a, b, c, temperature);
  }
  if (coeff === 'Polynomial' || coeff === 'polynomial') {
    return calculateTemparatureCoefficientPolynomial(
      a,
      b,
      c,
      d,
      e,
      temperature,
    );
  }
  if (coeff === 'Quadratic' || coeff === 'quadratic') {
    return calculateTemparatureCoefficientQuadratic(a, b, c, temperature);
  }
  return 0;
}
function getFeedTypeForFishSize(feedLinks: any[], fishSize: number): string {
  // First try feedLinks if available
  if (feedLinks && feedLinks.length > 0) {
    // Try to find an exact match
    const exactMatch = feedLinks.find(
      (link) => fishSize >= link.minFishSize && fishSize <= link.maxFishSize,
    );
    if (exactMatch) {
      return exactMatch?.feedStore?.productName || '-';
    }

    // If no exact match, find the next feed that can be used (where fishSize < minFishSize)
    const nextFeed = feedLinks
      .filter((link) => fishSize < link.minFishSize)
      .sort((a, b) => a.minFishSize - b.minFishSize)[0]; // Get the next smallest minFishSize
    
    if (nextFeed) {
      return nextFeed?.feedStore?.productName || '-';
    }

    // If no next feed, find the last/previous feed available (where fishSize > maxFishSize)
    const previousFeed = feedLinks
      .filter((link) => fishSize > link.maxFishSize)
      .sort((a, b) => b.maxFishSize - a.maxFishSize)[0]; // Get the largest maxFishSize
    
    if (previousFeed) {
      return previousFeed?.feedStore?.productName || '-';
    }
  }

  // If no feedLinks available or no match found, try using stored default feeds from localStorage
  try {
    const defaultFeeds = getLocalItem('defaultFeedsCache');
    if (defaultFeeds && Array.isArray(defaultFeeds)) {
      // Find feed where fishSize falls within the minFishSizeG to maxFishSizeG range
      const matchingFeed = defaultFeeds.find(
        (feed: any) => fishSize >= feed.minFishSizeG && fishSize <= feed.maxFishSizeG
      );
      
      if (matchingFeed) {
        return matchingFeed.productName || '-';
      }
    }
  } catch (e) {
    // Fail silently and return '-' if default feeds cache is not available
  }

  return '-';
}

function getFeedDataForFishSize(feedLinks: any[], fishSize: number): any {
  if (!feedLinks || feedLinks.length === 0) {
    return null;
  }

  // Try to find exact match
  const exactMatch = feedLinks.find(
    (link) => fishSize >= link.minFishSize && fishSize <= link.maxFishSize,
  );
  
  if (exactMatch?.feedStore) {
    return exactMatch.feedStore;
  }

  // Find next feed
  const nextFeed = feedLinks
    .filter((link) => fishSize < link.minFishSize)
    .sort((a, b) => a.minFishSize - b.minFishSize)[0];
  
  if (nextFeed?.feedStore) {
    return nextFeed.feedStore;
  }

  // Find previous feed
  const previousFeed = feedLinks
    .filter((link) => fishSize > link.maxFishSize)
    .sort((a, b) => b.maxFishSize - a.maxFishSize)[0];
  
  if (previousFeed?.feedStore) {
    return previousFeed.feedStore;
  }

  return null;
}

export function calculateFishGrowthTilapia(
  selectedGrowthModel: OrganisationModelResponse,
  fishWeight: number,
  temp: number,
  numberOfFishs: number,
  expectedWaste: number,
  period: number,
  startDate: string,
  timeInterval: number,
  selectedFarm?: FarmGroupUnit,
  wasteFactor?: number,
) {
  // Get feedLinks from farm/unit if available, otherwise use empty array
  const feedLinks =
    selectedFarm?.productionUnit.FeedProfileProductionUnit?.[0]?.feedProfile
      ?.feedLinks || [];
  if (selectedGrowthModel) {
    const IBW = fishWeight;
    const T = temp;
    let prevWeight = IBW;
    let prevNumberOfFish: number = numberOfFishs;
    let prevFishSize: number = IBW;
    let prevGrowth: number | string = 0;
    // Get nutritional values from feedStore, not from growth model
    // Default values if no feed data available
    const getFeedValues = (fishSize: number) => {
      const feedData = getFeedDataForFishSize(feedLinks, fishSize);
      return {
        de: feedData?.de || 13.47,
        feedProtein: feedData?.crudeProteinGPerKg || 400,
        feedPrice: feedData?.feedCost || 32,
        feedName: feedData?.productName || '-',
      };
    };
    
    let tgcA = selectedGrowthModel.models.tgcA;
    let tgcB = selectedGrowthModel.models.tgcB;
    let tgcC = selectedGrowthModel.models.tgcC;
    let tgcD = selectedGrowthModel.models.tgcD;
    let tgcE = selectedGrowthModel.models.tgcE;
    const newData = [];
    let TGC = 0;

    if (
      (selectedGrowthModel.models.temperatureCoefficient as string) ===
      'Logarithmic'
    ) {
      TGC = calculateTemparatureCoefficientLogarithmic(tgcA, tgcB, tgcC, T);
    } else if (
      (selectedGrowthModel.models.temperatureCoefficient as string) ===
      'Polynomial'
    ) {
      TGC = calculateTemparatureCoefficientPolynomial(
        tgcA,
        tgcB,
        tgcC,
        tgcD,
        tgcE,
        T,
      );
    } else if (
      (selectedGrowthModel.models.temperatureCoefficient as string) ===
      'Quadratic'
    ) {
      TGC = calculateTemparatureCoefficientQuadratic(tgcA, tgcB, tgcC, T);
    }
    // Get initial feed values
    const initialFeedValues = getFeedValues(IBW);
    let WF = wasteFactor; // Use passed waste factor
    
    let tDEN = calculateDENeedLinear(
      selectedGrowthModel.models.tFCRa,
      selectedGrowthModel.models.tFCRb,
      IBW,
      selectedGrowthModel.models.tFCRc,
    );

    let tFCR = calculateTheoreticalFeedConversionRatio(tDEN, initialFeedValues.de, WF);

    function calculateNoOfFish(
      initialSizeK4: number,
      growthRateL4: number,
      timeH5: number,
    ) {
      const growthMultiplier = growthRateL4 / 100 + 1;
      const growthComponent = Math.pow(growthMultiplier, timeH5) - 1;
      const fishSize = initialSizeK4 * (1 - growthComponent);
      return fishSize;
    }
    // Fish size will be computed via unified formula
    // function calculateFeedingRate(
    //   fishSize: number,
    //   temperature: number,
    //   DE: number,
    // ): any {
    //   const A = Math.pow(fishSize, 1 / 3);
    //   const B = -0.003206 + 0.001705 * Math.log(temperature - 11.25);
    //   const C = A + B * temperature;
    //   const D = Math.pow(C, 3) / fishSize - 1;

    //   const estFCR = (0.009 * fishSize + 12.45) / (DE / 1.03);

    //   const feedingRate = D * estFCR * 100;

    //   return feedingRate;
    // }

    function calculateFW(
      IBW: number,
      b: number,
      TGC: number,
      tValues: number[],
      dValues: number[],
    ) {
      if (tValues.length !== dValues.length) {
        throw new Error('tValues and dValues must have the same length');
      }

      // Compute summation of t * d
      const sum_td = tValues.reduce(
        (sum, t, index) => sum + t * dValues[index],
        0,
      );

      // Apply the formula
      return Math.pow(Math.pow(IBW, b) + (TGC / 100) * sum_td, 1 / b);
    }

    function calculateEstFCR(fishSize: number, feedValues: any): any {
      const numerator = (0.009 * fishSize + 12.45) * 1.03;
      const result = numerator / feedValues.de;
      const finalResult = Number(result.toFixed(2));
      return finalResult;
    }

    function calculateGrowth(newFishSize: number, prevFishSize: number) {
      return newFishSize - prevFishSize;
    }

    // Unified growth calculation: FBW - IBW (Final Body Weight - Initial Body Weight)
    function calculateGrowthUnified(FBW: number, IBW: number) {
      return FBW - IBW;
    }

    function calculateDate(date: string, day: number) {
      return dayjs(date, 'YYYY-MM-DD').add(day, 'day').format('DD-MM-YYYY');
    }

    const maxPeriod = Math.min(period, 365);
    for (let day = 1; day <= maxPeriod; day += 1) {
      const oldFishSize = prevFishSize;

      const FBW = calculateFW(prevWeight, 0.35, 0.16, [T], [7]);

      prevNumberOfFish =
        day !== 1
          ? calculateNoOfFish(prevNumberOfFish, 0.05, 7)
          : prevNumberOfFish;
      
      const currentFeedValues = getFeedValues(prevFishSize);
      const estfcr = calculateEstFCR(prevFishSize, currentFeedValues);
      // Use unified fish size formula with TGC from model and provided time interval
      const TGCForStep = computeTGCFromModel(selectedGrowthModel.models, T);
      const stepDays = timeInterval || 1;
      prevFishSize =
        day === 1
          ? prevFishSize
          : calculateFishSizeUnified(prevFishSize, TGCForStep, T, stepDays);

      // Use unified feeding rate formula
      let prevFeedingRate = parseFloat(
        String(calculatefeedIntakeFormula(IBW, TGCForStep, T, tFCR)),
      );
      let prevFeedIntake = ((prevFeedingRate * prevFishSize) / 100).toFixed(3);

      // Use unified growth formula: FBW - IBW
      const currentFBW = prevFishSize; // Current fish size is the FBW
      prevGrowth =
        day === 1
          ? calculateGrowthUnified(currentFBW, IBW).toFixed(3)
          : calculateGrowthUnified(currentFBW, IBW).toFixed(3);

      const newRow = {
        date: calculateDate(startDate, day),
        days: day,
        averageProjectedTemp: T,
        numberOfFish: Number(prevNumberOfFish.toFixed(2)),
        expectedWaste,
        fishSize: prevFishSize.toFixed(3),
        growth: prevGrowth,
        feedType: currentFeedValues.feedName,
        feedSize: prevWeight >= 50 ? '#3' : prevWeight >= 25 ? '#2' : '#1',
        feedProtein: currentFeedValues.feedProtein,
        feedDE: currentFeedValues.de,
        feedPrice: currentFeedValues.feedPrice,
        estimatedFCR: estfcr,
        feedIntake: prevFeedIntake,
        partitionedFCR: 0.0,
        feedingRate: prevFeedingRate.toFixed(2),
        feedCost: 49409,
      };
      // Store new data
      newData.push(newRow);
      prevFishSize = Number(prevFishSize.toFixed(3));
      prevGrowth = prevGrowth;
      prevWeight = FBW;
      prevFeedIntake = prevFeedIntake;
      prevFeedingRate = prevFeedingRate;
    }
    const dayGap = console.log(newData);

    return newData;
  }

  return [];
}
export function calculateFishGrowthRainBowTrout(
  selectedGrowthModel: OrganisationModelResponse,
  fishWeight: number,
  temp: number,
  numberOfFishs: any,
  expectedWaste: number,
  period: number,
  startDate: string,
  timeInterval: number,
  selectedFarm?: FarmGroupUnit,
  wasteFactor?: number,
) {
  console.log("selectedGrowthModel", selectedGrowthModel);
  // Resolve feed profile links for the selected production unit, if available
  const feedLinks =
    selectedFarm?.productionUnit.FeedProfileProductionUnit?.[0]?.feedProfile
      ?.feedLinks || [];
  const IBW = fishWeight;
  const T = temp;
  let prevWeight = IBW;
  let prevNumberOfFish = numberOfFishs;
  let prevFishSize: number = IBW;
  let prevGrowth: number | string = 0;
  
  // Get nutritional values from feedStore, not from growth model
  const getFeedValues = (fishSize: number) => {
    const feedData = getFeedDataForFishSize(feedLinks, fishSize);
    return {
      de: feedData?.de || 13.47,
      feedProtein: feedData?.crudeProteinGPerKg || 400,
      feedPrice: feedData?.feedCost || 32,
      feedName: feedData?.productName || '-',
    };
  };
  
  const newData = [];
  let WF = wasteFactor; // Use passed waste factor
  
  function calculateNoOfFish(
    initialSizeK4: number,
    growthRateL4: number,
    timeH5: number,
  ) {
    // Rainbow trout formula: K4*(1-(POWER(L4/100+1,H5)-1))
    const fishSize =
      initialSizeK4 * (2 - Math.pow(growthRateL4 / 100 + 1, timeH5));
    return fishSize;
  }

  // Fish size will be computed via unified formula

  // Use unified feeding rate formula
  const calcUnifiedFeedingRate = (
    IBW: number,
    TGC: number,
    T: number,
    tFCR: number,
  ) => calculatefeedIntakeFormula(IBW, TGC, T, tFCR);

  function calculateFW(
    IBW: number,
    b: number,
    TGC: number,
    tValues: number[],
    dValues: number[],
  ) {
    if (tValues.length !== dValues.length) {
      throw new Error('tValues and dValues must have the same length');
    }

    // Compute summation of t * d
    const sum_td = tValues.reduce(
      (sum, t, index) => sum + t * dValues[index],
      0,
    );

    // Apply the formula
    return Math.pow(Math.pow(IBW, b) + (TGC / 100) * sum_td, 1 / b);
  }

  function calculateEstFCR(fishSize: number, feedValues: any, e10: number): number {
    const numerator = 38.95 * Math.pow(fishSize, 0.01903) - 28.29;
    const denominator = feedValues.de / (1 + e10);
    const result = numerator / denominator;

    return Number(result.toFixed(2));
  }

  function calculateGrowth(newFishSize: number, prevFishSize: number) {
    return newFishSize - prevFishSize;
  }

  // Unified growth calculation: FBW - IBW (Final Body Weight - Initial Body Weight)
  function calculateGrowthUnified(FBW: number, IBW: number) {
    return FBW - IBW;
  }

  function calculateDate(date: string, day: number) {
    return dayjs(date, 'YYYY-MM-DD').add(day, 'day').format('DD-MM-YYYY');
  }
  // Loop through the days and calculate values
  for (let day = 1; day <= period; day += 1) {
    const oldFishSize = prevFishSize;

    const FBW = calculateFW(prevWeight, 0.35, 0.16, [T], [7]);

    prevNumberOfFish =
      day !== 1
        ? calculateNoOfFish(prevNumberOfFish, 0.05, 1)
        : prevNumberOfFish;
    
    const currentFeedValues = getFeedValues(prevFishSize);
    const estfcr = calculateEstFCR(prevFishSize, currentFeedValues, 0.03);
    // Use unified fish size formula
    const TGCForStep = computeTGCFromModel(selectedGrowthModel.models, T);
    const stepDays = timeInterval || 1;
    prevFishSize =
      day === 1
        ? prevFishSize
        : calculateFishSizeUnified(prevFishSize, TGCForStep, T, stepDays);

    // Compute TGC and tFCR similarly to Tilapia branch
    let TGC = 0;
    if (
      (selectedGrowthModel.models.temperatureCoefficient as string) ===
      'Logarithmic'
    ) {
      TGC = calculateTemparatureCoefficientLogarithmic(
        selectedGrowthModel.models.tgcA,
        selectedGrowthModel.models.tgcB,
        selectedGrowthModel.models.tgcC,
        T,
      );
    } else if (
      (selectedGrowthModel.models.temperatureCoefficient as string) ===
      'Polynomial'
    ) {
      TGC = calculateTemparatureCoefficientPolynomial(
        selectedGrowthModel.models.tgcA,
        selectedGrowthModel.models.tgcB,
        selectedGrowthModel.models.tgcC,
        selectedGrowthModel.models.tgcD,
        selectedGrowthModel.models.tgcE,
        T,
      );
    } else if (
      (selectedGrowthModel.models.temperatureCoefficient as string) ===
      'Quadratic'
    ) {
      TGC = calculateTemparatureCoefficientQuadratic(
        selectedGrowthModel.models.tgcA,
        selectedGrowthModel.models.tgcB,
        selectedGrowthModel.models.tgcC,
        T,
      );
    }
    const tDEN = calculateDENeedLinear(
      selectedGrowthModel.models.tFCRa,
      selectedGrowthModel.models.tFCRb,
      IBW,
      selectedGrowthModel.models.tFCRc,
    );
    const tFCR = calculateTheoreticalFeedConversionRatio(
      tDEN,
      currentFeedValues.de,
      WF,
    );
    let prevFeedingRate = parseFloat(
      String(calcUnifiedFeedingRate(IBW, TGC, T, tFCR)),
    );
    let prevFeedIntake = ((prevFeedingRate * prevFishSize) / 100).toFixed(3);

    const currentFBW = prevFishSize;
    prevGrowth =
      day === 1
        ? calculateGrowthUnified(currentFBW, IBW).toFixed(3)
        : calculateGrowthUnified(currentFBW, IBW).toFixed(3);

    const newRow = {
      date: calculateDate(startDate, day),
      days: day,
      averageProjectedTemp: T,
      numberOfFish: prevNumberOfFish.toFixed(2),
      expectedWaste,
      fishSize: prevFishSize.toFixed(3),
      growth: prevGrowth,
      // Use production-unit feed profile if available; otherwise '-' fallback
      feedType: currentFeedValues.feedName,
      feedSize: prevWeight >= 50 ? '#3' : prevWeight >= 25 ? '#2' : '#1',
      feedProtein: currentFeedValues.feedProtein,
      feedDE: currentFeedValues.de,
      feedPrice: currentFeedValues.feedPrice,
      estimatedFCR: estfcr,
      feedIntake: prevFeedIntake,
      partitionedFCR: 0.0,
      feedingRate: prevFeedingRate.toFixed(2),
      feedCost: 49409,
    };

    // Store new data
    newData.push(newRow);
    prevFishSize = Number(prevFishSize.toFixed(3));
    prevGrowth = prevGrowth;
    prevWeight = FBW;
    prevFeedIntake = prevFeedIntake;
    prevFeedingRate = prevFeedingRate;
  }
  return newData;
}

export function calculateFishGrowthAfricanCatfish(
  selectedGrowthModel: OrganisationModelResponse,
  fishWeight: number,
  temp: number,
  numberOfFishs: number,
  expectedWaste: number,
  period: number,
  startDate: string,
  timeInterval: number,
  selectedFarm?: FarmGroupUnit,
  wasteFactor?: number,
) {
  // Resolve feed profile links for the selected production unit, if available
  const feedLinks =
    selectedFarm?.productionUnit.FeedProfileProductionUnit?.[0]?.feedProfile
      ?.feedLinks || [];
  const IBW = fishWeight;
  const T = temp;
  let prevWeight = IBW;
  let prevNumberOfFish: number = numberOfFishs;
  let prevFishSize: any = IBW;
  let prevGrowth: number | string = 0;
  
  // Get nutritional values from feedStore, not from growth model
  const getFeedValues = (fishSize: number) => {
    const feedData = getFeedDataForFishSize(feedLinks, fishSize);
    return {
      de: feedData?.de || 13.47,
      feedProtein: feedData?.crudeProteinGPerKg || 400,
      feedPrice: feedData?.feedCost || 32,
      feedName: feedData?.productName || '-',
    };
  };
  
  const newData = [];
  let WF = wasteFactor; // Use passed waste factor
  
  function calculateNoOfFish(
    initialSizeK4: number,
    growthRateL4: number,
    timeH5: number,
  ): number {
    const powerComponent = Math.pow(growthRateL4 / 100 + 1, timeH5);
    const fishRemaining = initialSizeK4 * (1 - (powerComponent - 1));
    return fishRemaining;
  }

  // Fish size will be computed via unified formula

  // Use unified feeding rate formula
  const calcUnifiedFeedingRate = (
    IBW: number,
    TGC: number,
    T: number,
    tFCR: number,
  ) => calculatefeedIntakeFormula(IBW, TGC, T, tFCR);
  function calculateFW(
    IBW: number,
    b: number,
    TGC: number,
    tValues: number[],
    dValues: number[],
  ) {
    if (tValues.length !== dValues.length) {
      throw new Error('tValues and dValues must have the same length');
    }

    // Compute summation of t * d
    const sum_td = tValues.reduce(
      (sum, t, index) => sum + t * dValues[index],
      0,
    );

    // Apply the formula
    return Math.pow(Math.pow(IBW, b) + (TGC / 100) * sum_td, 1 / b);
  }

  function calculateEstFCR(fishSize: number, feedValues: any): number {
    const numerator = 9.794 * Math.pow(fishSize, 0.0726);
    const denominator = feedValues.de / 1.03;

    const result = numerator / denominator;

    return Number(result.toFixed(2));
  }

  function calculateGrowth(newFishSize: number, prevFishSize: number) {
    return newFishSize - prevFishSize;
  }

  function calculateGrowthUnified(FBW: number, IBW: number) {
    return FBW - IBW;
  }

  function calculateDate(date: string, day: number) {
    return dayjs(date, 'YYYY-MM-DD').add(day, 'day').format('DD-MM-YYYY');
  }

  for (let day = 1; day <= period; day += 1) {
    const oldFishSize = prevFishSize;

    const FBW = calculateFW(prevWeight, 0.35, 0.16, [T], [7]);

    prevNumberOfFish =
      day !== 1
        ? calculateNoOfFish(prevNumberOfFish, 0.05, 1)
        : prevNumberOfFish;
    
    const currentFeedValues = getFeedValues(prevFishSize);
    const estfcr = calculateEstFCR(prevFishSize, currentFeedValues);
    // Use unified fish size formula
    const TGCForStep = computeTGCFromModel(selectedGrowthModel.models, T);
    const stepDays = timeInterval || 1;
    prevFishSize =
      day === 1
        ? prevFishSize
        : calculateFishSizeUnified(prevFishSize, TGCForStep, T, stepDays);

    // Compute TGC and tFCR similarly to Tilapia branch
    let TGC = 0;
    if (
      (selectedGrowthModel.models.temperatureCoefficient as string) ===
      'Logarithmic'
    ) {
      TGC = calculateTemparatureCoefficientLogarithmic(
        selectedGrowthModel.models.tgcA,
        selectedGrowthModel.models.tgcB,
        selectedGrowthModel.models.tgcC,
        T,
      );
    } else if (
      (selectedGrowthModel.models.temperatureCoefficient as string) ===
      'Polynomial'
    ) {
      TGC = calculateTemparatureCoefficientPolynomial(
        selectedGrowthModel.models.tgcA,
        selectedGrowthModel.models.tgcB,
        selectedGrowthModel.models.tgcC,
        selectedGrowthModel.models.tgcD,
        selectedGrowthModel.models.tgcE,
        T,
      );
    } else if (
      (selectedGrowthModel.models.temperatureCoefficient as string) ===
      'Quadratic'
    ) {
      TGC = calculateTemparatureCoefficientQuadratic(
        selectedGrowthModel.models.tgcA,
        selectedGrowthModel.models.tgcB,
        selectedGrowthModel.models.tgcC,
        T,
      );
    }
    const tDEN = calculateDENeedLinear(
      selectedGrowthModel.models.tFCRa,
      selectedGrowthModel.models.tFCRb,
      IBW,
      selectedGrowthModel.models.tFCRc,
    );
    const tFCR = calculateTheoreticalFeedConversionRatio(
      tDEN,
      currentFeedValues.de,
      WF,
    );
    let prevFeedingRate = parseFloat(
      String(calcUnifiedFeedingRate(IBW, TGC, T, tFCR)),
    );

    let prevFeedIntake = ((prevFeedingRate * prevFishSize) / 100).toFixed(3);

    const currentFBW = prevFishSize;
    prevGrowth =
      day === 1
        ? calculateGrowthUnified(currentFBW, IBW).toFixed(3)
        : calculateGrowthUnified(currentFBW, IBW).toFixed(3);

    const newRow = {
      date: calculateDate(startDate, day),
      days: day,
      averageProjectedTemp: T,
      numberOfFish: Number(prevNumberOfFish.toFixed(2)),
      expectedWaste,
      fishSize: prevFishSize.toFixed(3),
      growth: prevGrowth,
      // Use production-unit feed profile if available; otherwise '-' fallback
      feedType: currentFeedValues.feedName,
      feedSize: prevWeight >= 50 ? '#3' : prevWeight >= 25 ? '#2' : '#1',
      feedProtein: currentFeedValues.feedProtein,
      feedDE: currentFeedValues.de,
      feedPrice: currentFeedValues.feedPrice,
      estimatedFCR: Number(estfcr),
      feedIntake: prevFeedIntake,
      partitionedFCR: 0.0,
      feedingRate: prevFeedingRate.toFixed(2),
      feedCost: 49409,
    };

    // Store new data
    newData.push(newRow);
    prevFishSize = Number(prevFishSize.toFixed(3));
    prevGrowth = prevGrowth;
    prevWeight = FBW;
    prevFeedIntake = prevFeedIntake;
    prevFeedingRate = prevFeedingRate;
  }
  return newData;
}
