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
import {
  calculatefeedingRate as calculateTilapiaFeedingRate,
  calculateNumberOfFish as calculateTilapiaNumberOfFish,
  calculatefishSize as calculateTilapiaFishSize,
  calculateGrowth as calculateTilapiaGrowth,
} from './utils/tilapiaSpeciesFormula';
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
  // Parse the target date using dayjs to handle MM/DD/YYYY format correctly
  const target = dayjs(targetDate, 'MM/DD/YYYY');
  const currentDate = dayjs();

  // Validate that the date is valid
  if (!target.isValid()) {
    // Try parsing as ISO string or other formats
    const fallbackDate = dayjs(targetDate);
    if (!fallbackDate.isValid()) {
      return '0/0'; // Return default if date is invalid
    }
    return calculateAgeDifference(fallbackDate, currentDate);
  }

  return calculateAgeDifference(target, currentDate);
}

function calculateAgeDifference(target: dayjs.Dayjs, current: dayjs.Dayjs) {
  // Calculate the total difference in time (currentDate - targetDate for age)
  const diffTime = current.valueOf() - target.valueOf();

  // Convert the difference to days
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate months difference
  let months = current.month() - target.month();
  let days = current.date() - target.date();

  // Adjust for the year difference
  const yearDiff = current.year() - target.year();
  months += yearDiff * 12;

  // Adjust if days are negative (e.g., if current day is less than target day)
  if (days < 0) {
    months -= 1;
    // Get the number of days in the previous month
    const prevMonth = current.subtract(1, 'month');
    days += prevMonth.daysInMonth();
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

// function calculateDENeedLinear(a, b, IBW, c) {
//   console.log('a', a);
//   console.log('b', b);
//   console.log('IBW', IBW);
//   console.log('c', c);
//   const result = a + b * Math.pow(IBW, c);
//   console.log('result', result);
//   return a + b * Math.pow(IBW, c);
// }
function calculateDENeedLinear(a: number, b: number, T: number, c: number): number {
  // Compute T^c using Math.pow()
  const powered = Math.pow(T, c);

  // Calculate result
  const result = a + b * powered;

  return result;
}

// function calculateDE(CP, ADC_CP, GE_CP, CF, ADC_CF, GE_CF, NFE, ADC_NFE, GE_NFE) {
//   return (CP * ADC_CP * GE_CP) +
//     (CF * ADC_CF * GE_CF) +
//     (NFE * ADC_NFE * GE_NFE);
// }

function calculateTheoreticalFeedConversionRatio(tDEN, DE, WF) {
  if (DE === undefined || DE === null || DE === 0) {
    console.error('[calculateTheoreticalFeedConversionRatio] ERROR: DE is invalid:', DE);
    return NaN;
  }
  if (WF === undefined || WF === null || WF === 0) {
    console.error('[calculateTheoreticalFeedConversionRatio] ERROR: WF is invalid:', WF);
    return NaN;
  }
  const denominator = DE / WF;
  if (denominator === 0 || isNaN(denominator)) {
    console.error('[calculateTheoreticalFeedConversionRatio] ERROR: Denominator is invalid:', { DE, WF, denominator });
    return NaN;
  }
  const result = tDEN / denominator;
  if (isNaN(result)) {
    console.error('[calculateTheoreticalFeedConversionRatio] ERROR: Result is NaN', { tDEN, DE, WF, denominator });
  }
  return result;
}

function calculatefeedIntakeFormula(IBW, TGC, T, tFCR) {
  if (IBW === undefined || IBW === null || IBW === 0 || isNaN(IBW)) {
    console.error('[calculatefeedIntakeFormula] ERROR: IBW is invalid:', IBW);
    return NaN;
  }
  if (TGC === undefined || TGC === null || isNaN(TGC)) {
    console.error('[calculatefeedIntakeFormula] ERROR: TGC is invalid:', TGC);
    return NaN;
  }
  if (tFCR === undefined || tFCR === null || isNaN(tFCR)) {
    console.error('[calculatefeedIntakeFormula] ERROR: tFCR is invalid:', tFCR);
    return NaN;
  }
  const rootIBW = Math.pow(IBW, 1 / 3);
  const tgcComponent = TGC * T;
  const growthComponent = Math.pow(rootIBW + tgcComponent, 3) / IBW - 1;
  const feedingRate = Math.max(0, growthComponent * tFCR * 100);
  if (isNaN(feedingRate)) {
    console.error('[calculatefeedIntakeFormula] ERROR: Result is NaN', { rootIBW, tgcComponent, growthComponent, tFCR });
  }
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

// Helper function to get feed data from default feeds (for Ad-hoc mode)
function getFeedDataFromDefaultFeeds(defaultFeeds: any[], fishSize: number, supplierId?: string): any {
  if (!defaultFeeds || defaultFeeds.length === 0) {
    return null;
  }

  // Filter by supplier if provided
  let relevantFeeds = defaultFeeds;
  if (supplierId) {
    relevantFeeds = defaultFeeds.filter((feed: any) => {
      const suppliers = feed.ProductSupplier || [];
      return suppliers.some((id: any) => String(id) === String(supplierId));
    });
  }

  // Try to find exact match
  const exactMatch = relevantFeeds.find(
    (feed) => fishSize >= feed.minFishSizeG && fishSize <= feed.maxFishSizeG
  );

  if (exactMatch) {
    return exactMatch;
  }

  // Find next feed (for fish smaller than min size)
  const nextFeed = relevantFeeds
    .filter((feed) => fishSize < feed.minFishSizeG)
    .sort((a, b) => a.minFishSizeG - b.minFishSizeG)[0];

  if (nextFeed) {
    return nextFeed;
  }

  // Find previous feed (for fish larger than max size)
  const previousFeed = relevantFeeds
    .filter((feed) => fishSize > feed.maxFishSizeG)
    .sort((a, b) => b.maxFishSizeG - a.maxFishSizeG)[0];

  if (previousFeed) {
    return previousFeed;
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
  defaultFeeds?: any[],
  supplierId?: string,
  mortalityRate?: number,
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
      // First try farm feed links (for Feeding Plan)
      let feedData = getFeedDataForFishSize(feedLinks, fishSize);

      // If no farm data, try default feeds (for Ad-hoc)
      if (!feedData && defaultFeeds && defaultFeeds.length > 0) {
        feedData = getFeedDataFromDefaultFeeds(defaultFeeds, fishSize, supplierId);
      }

      return {
        de: feedData?.de, // Default DE value when feed data is missing
        feedProtein: feedData?.crudeProteinGPerKg,
        feedPrice: feedData?.feedCost,
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
      T,
      selectedGrowthModel.models.tFCRc,
    );

    let tFCR = calculateTheoreticalFeedConversionRatio(tDEN, initialFeedValues.de, WF);
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

    function calculateEstFCR(fishSize: number, feedValues: any): any {
      if (!feedValues || feedValues.de === undefined || feedValues.de === null || feedValues.de === 0) {
        console.error('[Tilapia calculateEstFCR] ERROR: feedValues.de is invalid:', feedValues?.de);
        return NaN;
      }
      const numerator = (0.009 * fishSize + 12.45);
      const denominator = feedValues.de / 1.03;
      const result = numerator / denominator;
      const finalResult = Number(result.toFixed(2));
      if (isNaN(finalResult)) {
        console.error('[Tilapia calculateEstFCR] ERROR: Result is NaN', { numerator, de: feedValues.de, result });
      }
      return finalResult;
    }


    function calculateDate(date: string, day: number) {
      return dayjs(date, 'YYYY-MM-DD').add(day, 'day').format('DD-MM-YYYY');
    }

    const maxPeriod = Math.min(period, 365);
    const effectiveMortalityRate = mortalityRate ?? 0.05;
    // Add initial day (day 0) row to reflect starting fish size

    for (let day = 1; day <= maxPeriod; day += 1) {
      const currentIBW = prevFishSize;
      const stepDays = timeInterval || 1;

      if (day !== 1) {
        const updatedFishCount = calculateTilapiaNumberOfFish(
          prevNumberOfFish,
          effectiveMortalityRate,
          stepDays,
        );
        if (
          Number.isFinite(updatedFishCount) &&
          !Number.isNaN(updatedFishCount)
        ) {
          prevNumberOfFish = updatedFishCount;
        }
      }

      const currentFeedValues = getFeedValues(prevFishSize);

      if (!currentFeedValues || currentFeedValues.de === undefined || currentFeedValues.de === null) {
        console.error(`[Tilapia Day ${day}] ERROR: Missing feed DE value`, currentFeedValues);
      }
      const estfcr = calculateEstFCR(prevFishSize, currentFeedValues);
      // Use unified fish size formula with TGC from model and provided time interval
      const TGCForStep = computeTGCFromModel(selectedGrowthModel.models, T);

      if (isNaN(TGCForStep)) {
        console.error(`[Tilapia Day ${day}] ERROR: TGCForStep is NaN`);
      }
      let computedFishSize = calculateTilapiaFishSize(
        prevFishSize,
        T,
        stepDays,
      );
      if (
        !Number.isFinite(computedFishSize) ||
        Number.isNaN(computedFishSize) ||
        computedFishSize <= 0
      ) {
        computedFishSize = calculateFishSizeUnified(
          prevFishSize,
          TGCForStep,
          T,
          stepDays,
        );
      }
      if (
        !Number.isFinite(computedFishSize) ||
        Number.isNaN(computedFishSize) ||
        computedFishSize <= 0
      ) {
        computedFishSize = prevFishSize;
      }
      const nextFishSize = Number(computedFishSize);
      // Always compute day-over-day growth, including day 1
      const dailyGrowth = calculateTilapiaGrowth(nextFishSize, prevFishSize);
      const safeDailyGrowth = Number.isFinite(dailyGrowth)
        ? dailyGrowth
        : nextFishSize - prevFishSize;
      if (isNaN(tFCR)) {
        console.error(`[Tilapia Day ${day}] ERROR: tFCR is NaN`, { tDEN, DE: initialFeedValues.de, WF });
      }
      const tilapiaFeedingRate = calculateTilapiaFeedingRate(
        nextFishSize,
        T,
        currentFeedValues.de,
      );

      // Use only tilapia-specific feeding rate; do not fall back
      let feedingRateRaw = tilapiaFeedingRate;
      // Guard against invalid/negative results
      feedingRateRaw = Math.max(0, Number(feedingRateRaw));
      let prevFeedingRate = parseFloat(String(feedingRateRaw));
      if (isNaN(prevFeedingRate)) {
        console.error(`[Tilapia Day ${day}] ERROR: prevFeedingRate is NaN`, { IBW: currentIBW, TGCForStep, T, tFCR, feedingRateRaw });
      }
      let prevFeedIntake = ((prevFeedingRate * nextFishSize) / 100).toFixed(3);
      if (isNaN(parseFloat(prevFeedIntake))) {
        console.error(`[Tilapia Day ${day}] ERROR: prevFeedIntake is NaN`, { prevFeedingRate, prevFishSize });
      }

      // DAILY growth should be nextFishSize - prevFishSize (not cumulative)
      const dailyGrowthForDisplay = calculateTilapiaGrowth(
        nextFishSize,
        prevFishSize,
      );
      const safeDailyGrowthForDisplay = Number.isFinite(dailyGrowthForDisplay)
        ? dailyGrowthForDisplay
        : nextFishSize - prevFishSize;
      prevGrowth = Number(safeDailyGrowthForDisplay).toFixed(3);

      // Display fish size at the start of the day/interval (matches Excel)
      const displayedFishSize = prevFishSize;

      const newRow = {
        date: calculateDate(startDate, day),
        days: day,
        averageProjectedTemp: T,
        numberOfFish: Number(prevNumberOfFish.toFixed(2)),
        expectedWaste,
        fishSize: displayedFishSize.toFixed(3),
        growth: prevGrowth,
        feedType: currentFeedValues.feedName,
        feedSize:
          displayedFishSize >= 50
            ? '#3'
            : displayedFishSize >= 25
              ? '#2'
              : '#1',
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
      prevFishSize = Number(nextFishSize.toFixed(3));
      prevGrowth = prevGrowth;
      prevWeight = nextFishSize;
      prevFeedIntake = prevFeedIntake;
      prevFeedingRate = prevFeedingRate;
    }
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
  defaultFeeds?: any[],
  supplierId?: string,
  mortalityRate?: number,
) {

  // Resolve feed profile 
  //links for the selected production unit, if available

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
    // First try farm feed links (for Feeding Plan)
    let feedData = getFeedDataForFishSize(feedLinks, fishSize);

    // If no farm data, try default feeds (for Ad-hoc)
    if (!feedData && defaultFeeds && defaultFeeds.length > 0) {
      feedData = getFeedDataFromDefaultFeeds(defaultFeeds, fishSize, supplierId);
    }

    if (!feedData) {
      console.warn('[RainbowTrout getFeedValues] WARNING: No feed data found, using hardcoded defaults');
    }

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
  // Excel-equivalent Rainbow Trout feeding rate (% of body weight per day)
  function calculateRainbowTroutFeedingRateExcel(
    fishSizeG: number,
    temperatureC: number,
    deMJPerKg: number,
  ): number {
    // Next fish size using Excel polynomial (1-day step)
    const nextSize = calculateRainbowTroutFishSizeExcel(
      fishSizeG,
      temperatureC,
    );
    // Relative growth component
    const growthComponent = nextSize / fishSizeG - 1;
    // Est. FCR as per Excel (-28.29 + 38.95*M^0.01903) / (DE / 1.03)
    const estFcrNumerator = -28.29 + 38.95 * Math.pow(fishSizeG, 0.01903);
    const estFcrDenominator = deMJPerKg / 1.03;
    if (!isFinite(estFcrDenominator) || estFcrDenominator === 0) return NaN;
    const estFcr = estFcrNumerator / estFcrDenominator;
    const feedingRatePercent = growthComponent * estFcr * 100;
    return feedingRatePercent;
  }

  // Excel-equivalent Rainbow Trout fish size update
  // Formula derived from sheet:
  // new = ( current^(1/3) + ( 4.283547943*T^(1/8) - 2.919678112*T^(1/4) + 0.4443081526*T^(1/2) - 0.011762442*T - 1.805789941 ) * T * stepDaysFactor )^3
  // We multiply by time interval (days) to support arbitrary steps; set to 1 for daily.
  function calculateRainbowTroutFishSizeExcel(currentWeight, temperature) {
    const rootCurrent = Math.pow(currentWeight, 1 / 3);
    const t = temperature;

    const poly =
      4.283547943 * Math.pow(t, 0.125) -
      2.919678112 * Math.pow(t, 0.25) +
      0.4443081526 * Math.pow(t, 0.5) -
      0.011762442 * t -
      1.805789941;

    // Excel multiplies poly by temperature
    const increment = poly * t;

    const next = Math.pow(rootCurrent + increment, 3);
    return next;
  }



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
    if (!feedValues || feedValues.de === undefined || feedValues.de === null || feedValues.de === 0) {
      console.error('[RainbowTrout calculateEstFCR] ERROR: feedValues.de is invalid:', feedValues?.de);
      return NaN;
    }
    const numerator = 38.95 * Math.pow(fishSize, 0.01903) - 28.29;
    const denominator = feedValues.de / (1 + e10);
    if (denominator === 0 || isNaN(denominator)) {
      console.error('[RainbowTrout calculateEstFCR] ERROR: Denominator is invalid:', { de: feedValues.de, e10, denominator });
      return NaN;
    }
    const result = numerator / denominator;
    const finalResult = Number(result.toFixed(2));
    if (isNaN(finalResult)) {
      console.error('[RainbowTrout calculateEstFCR] ERROR: Result is NaN', { numerator, denominator, result });
    }
    return finalResult;
  }



  function calculateDate(date: string, day: number) {
    return dayjs(date, 'YYYY-MM-DD').add(day, 'day').format('DD-MM-YYYY');
  }
  // Loop through the days and calculate values
  for (let day = 1; day <= period; day += 1) {
    const oldFishSize = prevFishSize;

    // Update IBW to current fish size for proper feeding rate calculation
    const currentIBW = prevFishSize;

    const FBW = calculateFW(prevWeight, 0.35, 0.16, [T], [7]);

    prevNumberOfFish =
      day !== 1
        ? calculateNoOfFish(prevNumberOfFish, mortalityRate, 1)
        : prevNumberOfFish;

    const currentFeedValues = getFeedValues(prevFishSize);
    if (!currentFeedValues || currentFeedValues.de === undefined || currentFeedValues.de === null) {
      console.error(`[RainbowTrout Day ${day}] ERROR: Missing feed DE value`, currentFeedValues);
    }
    const estfcr = calculateEstFCR(prevFishSize, currentFeedValues, 0.03);
    // Use unified fish size formula
    const TGCForStep = computeTGCFromModel(selectedGrowthModel.models, T);
    if (isNaN(TGCForStep)) {
      console.error(`[RainbowTrout Day ${day}] ERROR: TGCForStep is NaN`);
    }
    const stepDays = timeInterval || 1;
    // Always compute next fish size (including day 1), but display start-of-day weight
    let rtComputedNext = calculateRainbowTroutFishSizeExcel(
      prevFishSize,
      T,
    );
    if (
      !Number.isFinite(rtComputedNext) ||
      Number.isNaN(rtComputedNext) ||
      rtComputedNext <= 0
    ) {
      rtComputedNext = calculateFishSizeUnified(prevFishSize, TGCForStep, T, stepDays);
    }
    let rtNextFishSize = Number(rtComputedNext);
    // If Excel-derived next size does not increase, fall back to unified; if still not increasing, hold size
    if (rtNextFishSize <= prevFishSize) {
      const unifiedNext = calculateFishSizeUnified(prevFishSize, TGCForStep, T, stepDays);
      if (Number.isFinite(unifiedNext) && !Number.isNaN(unifiedNext) && unifiedNext > prevFishSize) {
        rtNextFishSize = Number(unifiedNext);
      } else {
        rtNextFishSize = prevFishSize;
      }
    }

    // Use TGCForStep instead of recalculating TGC
    const TGC = TGCForStep;

    const tDEN = calculateDENeedLinear(
      selectedGrowthModel.models.tFCRa,
      selectedGrowthModel.models.tFCRb,
      T,
      selectedGrowthModel.models.tFCRc,
    );
    const tFCR = calculateTheoreticalFeedConversionRatio(
      tDEN,
      currentFeedValues.de,
      WF,
    );
    if (isNaN(tFCR)) {
      console.error(`[RainbowTrout Day ${day}] ERROR: tFCR is NaN`, { tDEN, DE: currentFeedValues.de, WF });
    }
    // Prefer Excel feeding rate; if invalid, fall back to unified
    let feedingRateRaw = calculateRainbowTroutFeedingRateExcel(
      currentIBW,
      T,
      currentFeedValues.de,
    );
    // Prevent negative feeding rates
    feedingRateRaw = Math.max(0, Number(feedingRateRaw));
    // Prevent negative feeding rates
    feedingRateRaw = Math.max(0, Number(feedingRateRaw));
  
    let prevFeedingRate = parseFloat(String(feedingRateRaw));
    if (isNaN(prevFeedingRate)) {
      console.error(`[RainbowTrout Day ${day}] ERROR: prevFeedingRate is NaN`, { IBW: currentIBW, TGC, T, tFCR, feedingRateRaw });
    }
    let prevFeedIntake = ((prevFeedingRate * prevFishSize) / 100).toFixed(3);
    if (isNaN(parseFloat(prevFeedIntake))) {
      console.error(`[RainbowTrout Day ${day}] ERROR: prevFeedIntake is NaN`, { prevFeedingRate, prevFishSize });
    }

    // Growth is always next - prev (including day 1)
    const currentFBW = prevFishSize;
    prevGrowth = (rtNextFishSize - currentFBW).toFixed(3);

    const newRow = {
      date: calculateDate(startDate, day),
      days: day,
      averageProjectedTemp: T,
      numberOfFish: prevNumberOfFish.toFixed(2),
      expectedWaste,
      // Show start-of-day fish size (matches Excel)
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
    // Carry forward the computed next size
    prevFishSize = Number(rtNextFishSize.toFixed(3));
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
  defaultFeeds?: any[],
  supplierId?: string,
  mortalityRate?: number,
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
    // First try farm feed links (for Feeding Plan)
    let feedData = getFeedDataForFishSize(feedLinks, fishSize);

    // If no farm data, try default feeds (for Ad-hoc)
    if (!feedData && defaultFeeds && defaultFeeds.length > 0) {
      feedData = getFeedDataFromDefaultFeeds(defaultFeeds, fishSize, supplierId);
    }

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
    if (!feedValues || feedValues.de === undefined || feedValues.de === null || feedValues.de === 0) {
      console.error('[AfricanCatfish calculateEstFCR] ERROR: feedValues.de is invalid:', feedValues?.de);
      return NaN;
    }
    const numerator = 9.794 * Math.pow(fishSize, 0.0726);
    const denominator = feedValues.de / 1.03;
    if (denominator === 0 || isNaN(denominator)) {
      console.error('[AfricanCatfish calculateEstFCR] ERROR: Denominator is invalid:', { de: feedValues.de, denominator });
      return NaN;
    }
    const result = numerator / denominator;
    const finalResult = Number(result.toFixed(2));
    if (isNaN(finalResult)) {
      console.error('[AfricanCatfish calculateEstFCR] ERROR: Result is NaN', { numerator, denominator, result });
    }
    return finalResult;
  }


  function calculateDate(date: string, day: number) {
    return dayjs(date, 'YYYY-MM-DD').add(day, 'day').format('DD-MM-YYYY');
  }
  function calculateAfricanCatfishFishSizeExcel(
    currentWeight,
    temperature
  ) {
    const rootCurrent = Math.pow(currentWeight, 1 / 3);
    const t = temperature;
    const poly =
      (-0.00001496 * Math.pow(t, 2) + 0.0008244 * t - 0.009494) * t;

    const next = Math.pow(rootCurrent + poly, 3);
    return next;
  }

  function calculateAfricanCatfishFeedingRateExcel(
    fishSizeG: number,
    temperatureC: number,
    deMJPerKg: number,
    wasteFactorFraction?: number,
  ): number {

    const nextSize = calculateAfricanCatfishFishSizeExcel(
      fishSizeG,
      temperatureC
    );

    const growthComponent = nextSize / fishSizeG - 1;

    const wasteFactor = 1 + (wasteFactorFraction ?? 0.03);
    const denominator = deMJPerKg * wasteFactor; 

    if (!isFinite(denominator) || denominator === 0) return NaN;
    const conversionEnergyComponent = (9.794 * Math.pow(fishSizeG, 0.0726)) / denominator;

    const feedingRate = growthComponent * conversionEnergyComponent * 100;

    return feedingRate;
  }
  for (let day = 1; day <= period; day += 1) {
    const oldFishSize = prevFishSize;
    const Days = timeInterval || 1;

    const currentIBW = prevFishSize;

    const FBW = calculateFW(prevWeight, 0.35, 0.16, [T], [7]);

    prevNumberOfFish =
      day !== 1
        ? calculateNoOfFish(prevNumberOfFish, mortalityRate, Days)
        : prevNumberOfFish;

    const currentFeedValues = getFeedValues(prevFishSize);
    if (!currentFeedValues || currentFeedValues.de === undefined || currentFeedValues.de === null) {
      console.error(`[AfricanCatfish Day ${day}] ERROR: Missing feed DE value`, currentFeedValues);
    }
    const estfcr = calculateEstFCR(prevFishSize, currentFeedValues);
    const TGCForStep = computeTGCFromModel(selectedGrowthModel.models, T);
  
    if (isNaN(TGCForStep)) {
      console.error(`[AfricanCatfish Day ${day}] ERROR: TGCForStep is NaN`);
    }
    const stepDays = timeInterval || 1;
    let ccComputedNext = calculateFishSizeUnified(prevFishSize, TGCForStep, T, stepDays);
    const ccNextFishSize = Number(ccComputedNext);

    const TGC = TGCForStep;

    const tDEN = calculateDENeedLinear(
      selectedGrowthModel.models.tFCRa,
      selectedGrowthModel.models.tFCRb,
      T,
      selectedGrowthModel.models.tFCRc,
    );
    const tFCR = calculateTheoreticalFeedConversionRatio(
      tDEN,
      currentFeedValues.de,
      WF,
    );
    if (isNaN(tFCR)) {
      console.error(`[AfricanCatfish Day ${day}] ERROR: tFCR is NaN`, { tDEN, DE: currentFeedValues.de, WF });
    }
    // Prefer Excel-based feeding rate; fall back to unified if invalid
    let feedingRateRaw = calculateAfricanCatfishFeedingRateExcel(
      currentIBW,
      T,
      currentFeedValues.de,
      WF,
    );
    if (!Number.isFinite(feedingRateRaw)) {
      feedingRateRaw = calcUnifiedFeedingRate(currentIBW, TGC, T, tFCR);
    }
  
    let prevFeedingRate = parseFloat(String(feedingRateRaw));
    if (isNaN(prevFeedingRate)) {
      console.error(`[AfricanCatfish Day ${day}] ERROR: prevFeedingRate is NaN`, { IBW: currentIBW, TGC, T, tFCR, feedingRateRaw });
    }
    let prevFeedIntake = ((prevFeedingRate * prevFishSize) / 100).toFixed(3);
    if (isNaN(parseFloat(prevFeedIntake))) {
      console.error(`[AfricanCatfish Day ${day}] ERROR: prevFeedIntake is NaN`, { prevFeedingRate, prevFishSize });
    }

    const currentFBW = prevFishSize;
    prevGrowth = (ccNextFishSize - currentFBW).toFixed(3);

    const newRow = {
      date: calculateDate(startDate, day),
      days: day,
      averageProjectedTemp: T,
      numberOfFish: Number(prevNumberOfFish.toFixed(2)),
      expectedWaste,
      // Show start-of-day fish size (matches Excel)
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
    // Carry forward computed next size
    prevFishSize = Number(ccNextFishSize.toFixed(3));
    prevGrowth = prevGrowth;
    prevWeight = FBW;
    prevFeedIntake = prevFeedIntake;
    prevFeedingRate = prevFeedingRate;
  }
  return newData;
}
