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
export const units = ["Hatchery", "Grow-out", "None", "Nursery", "Breeding"];
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
  "Other",
  "Crumbles",
  "Extruded Pellets",
];
export const nutritionalGuarantee = ["Minimum", "Maximum", "Typical"];
