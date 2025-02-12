import toast from "react-hot-toast";
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

export const months = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];
export const getCurrentMonth = () => {
  const currentMonth = new Date().getMonth();
  return Years[currentMonth];
};

export const averagesDropdown = [
  "Lastest sample average",
  "Monthly average",
  "Yearly average",
  "All-time average",
  "Individual average",
];
export const deleteImage = async (
  payload: {
    id?: Number | undefined;
    type?: String | undefined;
    image: String | undefined;
  },
  setProfilePic: (val: string) => void
) => {
  const response = await fetch(`/api/profile-pic/delete`, {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    setProfilePic("");
    toast.dismiss();
    toast.success("Image delete successfully");
  }
};
export const handleUpload = async (
  imagePath: FileList,
  profilePic: String | undefined,
  setProfilePic: (val: string) => void
) => {
  const file = imagePath[0];
  const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
  if (!allowedTypes.includes(file?.type)) {
    toast.dismiss();
    toast.error(
      "Invalid file type. Please upload an image in .jpg, .jpeg, .png or.svg format."
    );
    return;
  }
  // Validate file size
  const maxSizeInMB = 2;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    toast.dismiss();
    toast.error(
      `File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`
    );
    return;
  }

  const formData = new FormData();
  formData.append("image", imagePath[0]);
  const oldImageName = profilePic?.split("/").pop()?.split(".")[0];

  formData.append("oldImageName", oldImageName || "");

  const response = await fetch(`/api/profile-pic/upload/new`, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const profileData = await response.json();
    setProfilePic(profileData.data.url);
    toast.dismiss();
    toast.success("Profile photo successfully uploaded");
  }
};
