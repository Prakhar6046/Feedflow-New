import { FarmGroup } from "../_typeModels/production";

export const readableDate = (date: any) => {
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
};

export const productionIntensity = [
  "Intensive",
  "Extensive",
  "Semi-Intensive",
  "Recreational",
];
export const units = ["Hatchery", "Grow-out", "Nursery", "Breeding", "None"];
export const feedingPhase = [
  "Pre-Starter",
  "Grower",
  "Breeder",
  "Maintenance",
  "Starter",
  "Finisher",
  "None",
];
export const lifeStage = [
  "Fry",
  "Juvenile",
  "Breeder",
  "Adult",
  "Fingerling",
  "Grower",
  "Maintenance",
  "None",
];
export const species = ["Tilapia"];
export const nutritionalPurpose = [
  "Primary Feed Source",
  "Supplementary Feeding",
];
export const nutritionalClass = ["Complete & Balanced", "Complementary"];
export const ProductFormatCode = [
  "Mash",
  "Compress Pellets",
  "Crumbles",
  "Extruded Pellets",
  "Other",
];
export const Status = [
  "Current",
  "Harvested",
  "Not Allowed",
  "Removed",
  "Transferred",
  "Sold",
];
export const nutritionalGuarantee = ["Minimum", "Maximum", "Typical"];
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
  "Stock",
  "Transfer",
  "Harvest",
  "Mortalities",
  "Sample",
];
export const waterQualityFields = ["Sample"];

export const formattedDate = (date: string) => {
  const convertedDate = new Date(date);
  return convertedDate.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "UTC", // Adjust this to your desired timezone if needed
  });
};

// Format the date and time
const options: any = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true,
};

export const sanitizeIsoString = (isoString: string): string => {
  // If the string contains both offset and Z, remove the Z
  if (isoString.includes("+") && isoString.endsWith("Z")) {
    return isoString.slice(0, -1); // Remove the trailing Z
  }
  return isoString;
};

export const convertDate = (isoString: string): string => {
  try {
    const sanitizedString = sanitizeIsoString(isoString);
    const date = new Date(sanitizedString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid Date");
    }

    // Format the date manually
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    return "Invalid Date";
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
    console.error("Error parsing localStorage item:", error);
    return null;
  }
};

export const Years = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
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
  localData?: boolean
) => {
  let orderType: number;
  if (localData) {
    orderType = order === "asc" ? -1 : 1;
  } else {
    orderType = order === "asc" ? 1 : -1;
  }
  if (groupedData) {
    if (selectedView === "fish") {
      const sortedData = [...groupedData].sort(
        (production1: FarmGroup, production2: FarmGroup) => {
          console.log(selectedView);
          console.log(property);
          if (property === "Farm") {
            if (production1.farm < production2.farm) return -1 * orderType;
            if (production1.farm > production2.farm) return 1 * orderType;
          } else if (property === "unit") {
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
          } else if (property === "unit") {
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
          } else if (property === "Fish") {
            if (production1.units[0].fishCount < production2.units[0].fishCount)
              return -1 * orderType;

            if (production1.units[0].fishCount > production2.units[0].fishCount)
              return 1 * orderType;
          } else if (property === "Biomass") {
            if (production1.units[0].biomass < production2.units[0].biomass)
              return -1 * orderType;

            if (production1.units[0].biomass > production2.units[0].biomass)
              return 1 * orderType;
          } else if (property === "Mean weight") {
            if (
              production1.units[0].meanWeight < production2.units[0].meanWeight
            )
              return -1 * orderType;

            if (
              production1.units[0].meanWeight > production2.units[0].meanWeight
            )
              return 1 * orderType;
          } else if (property === "Mean length") {
            if (
              production1.units[0].meanLength < production2.units[0].meanLength
            )
              return -1 * orderType;

            if (
              production1.units[0].meanLength > production2.units[0].meanLength
            )
              return 1 * orderType;
          } else if (property === "Stocking Density") {
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
          } else if (property === "Stocking density") {
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
          } else if (property === "Stocking level") {
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
        }
      );
      return sortedData;
    } else if (selectedView === "water") {
      const sortedData = [...groupedData].sort(
        (production1: FarmGroup, production2: FarmGroup) => {
          if (property === "Farm") {
            if (production1.farm < production2.farm) return -1 * orderType;
            if (production1.farm > production2.farm) return 1 * orderType;
          } else if (property === "unit") {
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
          } else if (property === "watertemp") {
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
          } else if (property === "Dissolved oxygen") {
            if (
              Number(production1.units[0].DO) < Number(production2.units[0].DO)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].DO) > Number(production2.units[0].DO)
            )
              return 1 * orderType;
          } else if (property === "tss") {
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
          } else if (property === "nh4") {
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
          } else if (property === "no3") {
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
          } else if (property === "no2") {
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
          } else if (property === "ph") {
            if (
              Number(production1.units[0].ph) < Number(production2.units[0].ph)
            )
              return -1 * orderType;
            if (
              Number(production1.units[0].ph) > Number(production2.units[0].ph)
            )
              return 1 * orderType;
          } else if (property === "visibility") {
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
        }
      );
      return sortedData;
    }
  }
};
