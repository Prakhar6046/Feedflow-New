import { FeedSupply } from '../_components/feedSupply/FeedSelection';

export interface FeedInitialState {
  isLoading: boolean;
  editFeed: FeedSupply;
  isEditFeed: boolean;
}
export interface FeedProduct {
  organaisationId: number;
  id: string;
  ProductSupplier: string;
  brandName: string;
  productName: string;
  productFormat: string;
  particleSize: string;
  fishSizeG: number;
  nutritionalClass: string;
  nutritionalPurpose: string;
  suitableSpecies: string;
  suitabilityAnimalSize: string;
  productionIntensity: string;
  suitabilityUnit: string;
  feedingPhase: string;
  lifeStage: string;
  shelfLifeMonths: number;
  feedCost: number;
  feedIngredients: string;
  moistureGPerKg: number;
  crudeProteinGPerKg: number;
  crudeFatGPerKg: number;
  crudeFiberGPerKg: number;
  crudeAshGPerKg: number;
  nfe: number;
  calciumGPerKg: number;
  phosphorusGPerKg: number;
  carbohydratesGPerKg: number;
  metabolizableEnergy: number;
  feedingGuide: string;
  geCoeffCP: number;
  geCoeffCF: number;
  geCoeffNFE: number;
  ge: number;
  digCP: number;
  digCF: number;
  digNFE: number;
  deCP: number;
  deCF: number;
  deNFE: number;
  de: number;
  createdAt: string;
  updatedAt: string;
}
