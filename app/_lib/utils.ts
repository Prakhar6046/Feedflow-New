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
