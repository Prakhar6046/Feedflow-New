import { Production } from "./production";

export interface FarmInitialState {
  isLoading: boolean;
  farm: Farm;
  farms: Farm[];
  editFarm: Farm;
  isEditFarm: boolean;
}
export interface Farm {
  name: String;
  addressLine1: String;
  farmAltitude: String;
  addressLine2: String;
  province: String;
  city: String;
  zipCode: String;
  country: String;
  id?: String;
  fishFarmer: String;
  lat: String;
  lng: String;
  productionUnits?: {
    name: string;
    type: string;
    capacity: string;
    waterflowRate: string;
    id: any;
  }[];
  production: Production[];
}
export interface UnitsTypes {
  name: string | undefined;
  formula: string | undefined;
  id: string;
}
export interface CalculateType {
  output: number;
  id: any;
}
export interface ProductionUnitsFormTypes {
  productionUnits: {
    name: string;
    type: string;
    capacity: string;
    waterflowRate: string;
    id: any;
  }[];
}
