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
  mangerId?: String[];
  FarmManger?: {
    userId: Number;
  }[];
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
    farmId: string;
    id: any;
    YearBasedPredicationProductionUnit: ProductionParaMeterType[];
  }[];
  production: Production[];
  WaterQualityPredictedParameters: ProductionParaMeterType[];
}
export interface UnitsTypes {
  name: string | undefined;
  formula: string | undefined;
  id: string;
  index: number;
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
    unitId?: string;
  }[];
  area: string;
  depth: string;
  width: string;
  length: string;
  height: string;
  radius: string;
}

export interface Years {
  Jan: string;
  Feb: string;
  Mar: string;
  Apr: string;
  May: string;
  Jun: string;
  Jul: string;
  Aug: string;
  Sep: string;
  Oct: string;
  Nov: string;
  Dec: string;
}

export interface ProductionParaMeterType {
  id: number;
  farmId: string;
  updatedBy: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  YearBasedPredication: [
    {
      modelId(arg0: string, modelId: any): unknown;
      id: number;
      waterQualityPredictedParameterId: number;
      createdAt: string;
      updatedAt: string;
      waterTemp?: Years;
      DO?: Years;
      TSS?: Years;
      NH4?: Years;
      NO3?: Years;
      NO2?: Years;
      ph?: Years;
      visibility?: Years;
      GrowthModel: string;
      idealRange: {
        DO?: { Max: string; Min: string };
        ph?: { Max: string; Min: string };
        NH4?: { Max: string; Min: string };
        NO2?: { Max: string; Min: string };
        NO3?: { Max: string; Min: string };
        TSS?: { Max: string; Min: string };
        waterTemp?: { Max: string; Min: string };
        visibility?: { Max: string; Min: string };
      };
    }
  ];
}
export interface Models {
  id: number;
  name: string;
  specie: string;
  temperatureCoefficient: string;
  growthEquationLength: string;
  growthEquationBodyWeight: string;
  conditionFactor1: string;
  conditionFactor2: string;
  updatedAt: string;
  createdAt: string;
}
export interface GrowthModel {
  id: number;
  farmId: string;
  updatedAt: string;
  createdAt: string;
  organisationId: 1;
  modelId: 2;
  models: Models;
}

export interface Prediction {
  id: Number;
  waterQualityPredictedParameterId: Number;
  createdAt: String;
  updatedAt: String;
  waterTemp: any;
  DO: any;
  TSS: any;
  NH4: any;
  NO3: any;
  NO2: any;
  ph: any;
  visibility: any;
  idealRange: any;
  modelId: Number;
}
