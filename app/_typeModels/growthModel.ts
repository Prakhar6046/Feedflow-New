import { FeedConversionRatioModel } from "../_components/GrowthModel";

export interface OrganisationModelResponse {
  id: number;
  organisationId: number;
  modelId: number;
  isDefault: boolean;
  useExistingModel: boolean;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  models: Model;
  organisation: Organisation;
  selectedFarms:any;
}
type CoefficientModel = 'logarithmic' | 'polynomial' | 'quadratic';
export interface Model {
  id: number;
  name: string;
  specieId: string;
  productionSystemId: string;
  temperatureCoefficient: CoefficientModel; // e.g., "logarithmic"
  tgcA: number;
  tgcB: number;
  tgcC: number;
  tgcD: number | null;
  tgcE: number | null;
  tFCRModel: FeedConversionRatioModel; 
  tFCRa: number;
  tFCRb: number;
  tFCRc: number;
  organisationId: number;
  createdBy: number;
  updatedBy: string | number;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
}

export interface Organisation {
  id: number;
  image: string | null;
  imageUrl: string;
  name: string;
  organisationCode: string;
  organisationType: string;
  updatedBy: string | number | null;
  createdBy: number;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  addressId: string;
}
