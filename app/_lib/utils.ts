import toast from 'react-hot-toast';
import { FarmGroup, Production } from '../_typeModels/production';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
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
    timeZone: 'UTC', // Adjust this to your desired timezone if needed
  });
};

export const sanitizeIsoString = (isoString: string): string => {
  // If the string contains both offset and Z, remove the Z
  if (isoString.includes('+') && isoString.endsWith('Z')) {
    return isoString.slice(0, -1); // Remove the trailing Z
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
    toast.success('Image delete successfully');
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
  // Convert data into an array of rows
  // data.forEach((row: any) => {
  //   worksheet.addRow([
  //     row.date,
  //     row.days,
  //     row.waterTemp,
  //     row.fishWeight,
  //     row.numberOfFish,
  //     row.biomass,
  //     row.stockingDensityNM3,
  //     row.stockingDensityKg,
  //     row.feedPhase,
  //     row.feedProtein,
  //     row.feedDE,
  //     row.feedPrice,
  //     row.growth,
  //     row.estimatedFCR,
  //     row.partitionedFCR,
  //     row.feedIntake,
  //   ]);
  // });
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
];

export function calculateFishGrowthTilapia(
  fishWeight: number,
  temp: number,
  numberOfFishs: any,
  expectedWaste: number,
  period: number,
  startDate: string,
  timeInterval: number,
  DE: number,
) {
  console.log(timeInterval);

  const IBW = fishWeight;
  const T = temp;
  let prevWeight = IBW;
  let prevNumberOfFish: any = numberOfFishs;
  let prevFishSize: any = IBW;
  let prevGrowth: any = 0;
  const newData = [];

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
  function calculateFishSize(
    volumeM4: number,
    temperatureJ5: number,
    constantE7: number,
  ) {
    const rootVolume = Math.pow(volumeM4, 1 / 3);
    const logPart = -0.003206 + 0.001705 * Math.log(temperatureJ5 - 11.25);
    const addition = rootVolume + logPart * constantE7 * temperatureJ5;
    const result = Math.pow(addition, 3);
    return result;
  }

  function calculateFeedingRate(
    fishSize: number,
    temperature: number,
    DE: number,
  ): any {
    const A = Math.pow(fishSize, 1 / 3);
    const B = -0.003206 + 0.001705 * Math.log(temperature - 11.25);
    const C = A + B * temperature;
    const D = Math.pow(C, 3) / fishSize - 1;

    const estFCR = (0.009 * fishSize + 12.45) / (DE / 1.03);

    const feedingRate = D * estFCR * 100;

    return feedingRate;
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

  function calculateEstFCR(fishSize: number, DE: number): any {
    return Number(((0.009 * fishSize + 12.45) * 1.03) / DE).toFixed(2);
  }

  function calculateGrowth(newFishSize: number, prevFishSize: number) {
    return newFishSize - prevFishSize;
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
        ? calculateNoOfFish(prevNumberOfFish, 0.05, 7)
        : prevNumberOfFish;
    const estfcr = calculateEstFCR(prevFishSize, DE);
    prevFishSize =
      day === 1 ? prevFishSize : calculateFishSize(prevFishSize, 24, 7);

    let prevFeedingRate = parseFloat(
      calculateFeedingRate(prevFishSize, temp, DE),
    );
    let prevFeedIntake = ((prevFeedingRate * prevFishSize) / 100).toFixed(3);

    prevGrowth =
      day === 1
        ? prevFishSize - IBW
        : calculateGrowth(prevFishSize, oldFishSize).toFixed(3);

    const newRow = {
      date: calculateDate(startDate, day),
      days: day,
      averageProjectedTemp: T,
      numberOfFish: prevNumberOfFish.toFixed(2),
      expectedWaste,
      fishSize: prevFishSize.toFixed(3),
      growth: prevGrowth,
      feedType:
        Number(prevFishSize.toFixed(3)) >= 200
          ? 'SAF 6035 (2-3mm)'
          : Number(prevFishSize.toFixed(3)) >= 50
            ? 'Tilapia Starter #3'
            : Number(prevFishSize.toFixed(3)) >= 25
              ? 'Tilapia Starter #2'
              : Number(prevFishSize.toFixed(3)) >= 5
                ? 'Tilapia Starter #1'
                : 'Tilapia Starter #0',
      feedSize: prevWeight >= 50 ? '#3' : prevWeight >= 25 ? '#2' : '#1',
      feedProtein: 400,
      feedDE: 13.47,
      feedPrice: 32,
      estimatedFCR: estfcr,
      feedIntake: prevFeedIntake,
      partitionedFCR: 0.0,
      feedingRate: prevFeedingRate.toFixed(2),
      feedCost: 49409,
    };

    // Store new data
    newData.push(newRow);
    prevFishSize = prevFishSize.toFixed(3);
    prevGrowth = prevGrowth;
    prevWeight = FBW;
    prevFeedIntake = prevFeedIntake;
    prevFeedingRate = prevFeedingRate;
  }
  const dayGap = console.log(newData);

  return newData;
}
export function calculateFishGrowthRainBowTrout(
  fishWeight: number,
  temp: number,
  numberOfFishs: any,
  expectedWaste: number,
  period: number,
  startDate: string,
  timeInterval: number,
  DE: number,
) {
  const IBW = fishWeight;
  const T = temp;
  let prevWeight = IBW;
  let prevNumberOfFish: any = numberOfFishs;
  let prevFishSize: any = IBW;
  let prevGrowth: any = 0;
  const newData = [];

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

  const calculateFishSize = (fishSize: number, temp: number) => {
    const part1 = Math.pow(fishSize, 0.333333);
    const part2 =
      4.283547943 * Math.pow(temp, 0.125) +
      -2.919678112 * Math.pow(temp, 0.25) +
      0.4443081526 * Math.pow(temp, 0.5) +
      -0.011762442 * Math.pow(temp, 1) +
      -1.805789941;

    const combined = Math.pow(part1 + part2 * temp, 3);
    return combined;
  };

  function calculateFeedingRate(
    fishSize: number,
    temperature: number,
    DE: number,
  ): any {
    const A = Math.pow(fishSize, 1 / 3);
    const B = -0.003206 + 0.001705 * Math.log(temperature - 11.25);
    const C = A + B * temperature;
    const D = Math.pow(C, 3) / fishSize - 1;

    const estFCR = (0.009 * fishSize + 12.45) / (DE / 1.03);

    const feedingRate = D * estFCR * 100;

    return feedingRate;
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

  function calculateEstFCR(fishSize: number, DE: number): any {
    return Number(((0.009 * fishSize + 12.45) * 1.03) / DE).toFixed(2);
  }

  function calculateGrowth(newFishSize: number, prevFishSize: number) {
    return newFishSize - prevFishSize;
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
        ? calculateNoOfFish(prevNumberOfFish, 0.05, 7)
        : prevNumberOfFish;
    const estfcr = calculateEstFCR(prevFishSize, DE);
    prevFishSize =
      day === 1 ? prevFishSize : calculateFishSize(prevFishSize, 14);

    let prevFeedingRate = parseFloat(
      calculateFeedingRate(prevFishSize, temp, DE),
    );
    let prevFeedIntake = ((prevFeedingRate * prevFishSize) / 100).toFixed(3);

    prevGrowth =
      day === 1
        ? prevFishSize - IBW
        : calculateGrowth(prevFishSize, oldFishSize).toFixed(3);

    const newRow = {
      date: calculateDate(startDate, day),
      days: day,
      averageProjectedTemp: T,
      numberOfFish: prevNumberOfFish.toFixed(2),
      expectedWaste,
      fishSize: prevFishSize.toFixed(3),
      growth: prevGrowth,
      feedType:
        Number(prevFishSize.toFixed(3)) >= 200
          ? 'SAF 6035 (2-3mm)'
          : Number(prevFishSize.toFixed(3)) >= 50
            ? 'Tilapia Starter #3'
            : Number(prevFishSize.toFixed(3)) >= 25
              ? 'Tilapia Starter #2'
              : Number(prevFishSize.toFixed(3)) >= 5
                ? 'Tilapia Starter #1'
                : 'Tilapia Starter #0',
      feedSize: prevWeight >= 50 ? '#3' : prevWeight >= 25 ? '#2' : '#1',
      feedProtein: 400,
      feedDE: 13.47,
      feedPrice: 32,
      estimatedFCR: estfcr,
      feedIntake: prevFeedIntake,
      partitionedFCR: 0.0,
      feedingRate: prevFeedingRate.toFixed(2),
      feedCost: 49409,
    };

    // Store new data
    newData.push(newRow);
    prevFishSize = prevFishSize.toFixed(3);
    prevGrowth = prevGrowth;
    prevWeight = FBW;
    prevFeedIntake = prevFeedIntake;
    prevFeedingRate = prevFeedingRate;
  }
  return newData;
}

export function calculateFishGrowthAfricanCatfish(
  fishWeight: number,
  temp: number,
  numberOfFishs: any,
  expectedWaste: number,
  period: number,
  startDate: string,
  timeInterval: number,
  DE: number,
) {
  const IBW = fishWeight;
  const T = temp;
  let prevWeight = IBW;
  let prevNumberOfFish: any = numberOfFishs;
  let prevFishSize: any = IBW;
  let prevGrowth: any = 0;
  const newData = [];

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
  const calculateFishSize = (fishSize: number, temp: number) => {
    const part1 = Math.pow(fishSize, 0.333333);
    const part2 =
      (-0.00001496 * Math.pow(temp, 2) + 0.0008244 * temp - 0.009494) * temp;

    const result = Math.pow(part1 + part2, 3);
    return result;
  };

  function calculateFeedingRate(
    fishSize: number,
    temperature: number,
    DE: number,
  ): any {
    const A = Math.pow(fishSize, 1 / 3);
    const B = -0.003206 + 0.001705 * Math.log(temperature - 11.25);
    const C = A + B * temperature;
    const D = Math.pow(C, 3) / fishSize - 1;

    const estFCR = (0.009 * fishSize + 12.45) / (DE / 1.03);

    const feedingRate = D * estFCR * 100;

    return feedingRate;
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

  function calculateEstFCR(fishSize: number, DE: number): any {
    return Number(((0.009 * fishSize + 12.45) * 1.03) / DE).toFixed(2);
  }

  function calculateGrowth(newFishSize: number, prevFishSize: number) {
    return newFishSize - prevFishSize;
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
        ? calculateNoOfFish(prevNumberOfFish, 0.05, 7)
        : prevNumberOfFish;
    const estfcr = calculateEstFCR(prevFishSize, DE);
    prevFishSize =
      day === 1 ? prevFishSize : calculateFishSize(prevFishSize, 20);

    let prevFeedingRate = parseFloat(
      calculateFeedingRate(prevFishSize, temp, DE),
    );
    let prevFeedIntake = ((prevFeedingRate * prevFishSize) / 100).toFixed(3);

    prevGrowth =
      day === 1
        ? prevFishSize - IBW
        : calculateGrowth(prevFishSize, oldFishSize).toFixed(3);

    const newRow = {
      date: calculateDate(startDate, day),
      days: day,
      averageProjectedTemp: T,
      numberOfFish: prevNumberOfFish.toFixed(2),
      expectedWaste,
      fishSize: prevFishSize.toFixed(3),
      growth: prevGrowth,
      feedType:
        Number(prevFishSize.toFixed(3)) >= 200
          ? 'SAF 6035 (2-3mm)'
          : Number(prevFishSize.toFixed(3)) >= 50
            ? 'Tilapia Starter #3'
            : Number(prevFishSize.toFixed(3)) >= 25
              ? 'Tilapia Starter #2'
              : Number(prevFishSize.toFixed(3)) >= 5
                ? 'Tilapia Starter #1'
                : 'Tilapia Starter #0',
      feedSize: prevWeight >= 50 ? '#3' : prevWeight >= 25 ? '#2' : '#1',
      feedProtein: 400,
      feedDE: 13.47,
      feedPrice: 32,
      estimatedFCR: estfcr,
      feedIntake: prevFeedIntake,
      partitionedFCR: 0.0,
      feedingRate: prevFeedingRate.toFixed(2),
      feedCost: 49409,
    };

    // Store new data
    newData.push(newRow);
    prevFishSize = prevFishSize.toFixed(3);
    prevGrowth = prevGrowth;
    prevWeight = FBW;
    prevFeedIntake = prevFeedIntake;
    prevFeedingRate = prevFeedingRate;
  }
  return newData;
}
