import { Production } from './production';

export interface FarmInitialState {
  isLoading: boolean;
  farm: Farm;
  farms: Farm[];
  editFarm: Farm;
  isEditFarm: boolean;
}
export interface Organisation {
  id: number;
  image: string | null;
  imageUrl: string;
  name: string;
  organisationCode: string;
  organisationType: string;
  updatedBy: number | null;
  createdBy: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  addressId: string;
}
export interface UnitsTypes {
  name: string | undefined;
  formula: string | undefined;
  id: string;
  index: number;
}
export interface CalculateType {
  output: number;
  id: number;
}
export interface ProductionUnitsFormTypes {
  productionUnits: {
    name: string;
    type: string;
    capacity: string;
    waterflowRate: string;
    id: number;
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
    },
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

export interface FeedProfile {
  id: number;
  farmId: string;
  createdAt: string;
  updatedAt: string;
  profiles: {
    selection_1: string;
    selection_2: string;
    selection_3: string;
    selection_4: string;
    selection_5: string;
    selection_10: string;
    selection_15: string;
    selection_20: string;
    selection_25: string;
    selection_30: string;
    selection_35: string;
    selection_40: string;
    selection_45: string;
    selection_50: string;
    selection_55: string;
    selection_60: string;
    selection_65: string;
    selection_70: string;
    selection_75: string;
    selection_80: string;
    selection_85: string;
    selection_90: string;
    selection_95: string;
    selection_100: string;
    selection_120: string;
    selection_140: string;
    selection_160: string;
    selection_180: string;
  };
}

export interface FarmAddress {
  id: string;
  addressLine1: string;
  addressLine2: string;
  province: string;
  city: string;
  zipCode?: string;
  country?: string;
}

export interface Farm {
  id?: string;
  name: string;
  mangerId?: string[];
  FarmManger?: {
    userId: number;
  }[];

  fishFarmer: string;
  farmAltitude: string;
  lat: string;
  lng: string;

  // Address Info
  addressLine1: string;
  addressLine2: string;
  province: string;
  city: string;
  zipCode: string;
  country: string;
  farmAddressId?: string;
  farmAddress?: FarmAddress;

  // Relations
  organisationId?: number;
  organisation: Organisation;

  production: Production[];
  productionUnits: {
    id: any;
    name: string;
    type: string;
    capacity: string;
    waterflowRate: string;
    farmId: string;
    YearBasedPredicationProductionUnit: ProductionParaMeterType[];
    FeedProfileProductionUnit?: any[]; // Add proper type if needed
  }[];

  WaterQualityPredictedParameters: ProductionParaMeterType[];
  FeedProfile?: FeedProfile[];

  // Audit Fields
  createdBy?: number | null;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
export interface TableHeadType {
  id: string;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
}
