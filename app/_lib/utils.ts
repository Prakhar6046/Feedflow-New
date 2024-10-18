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
