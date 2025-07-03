import { Dayjs } from "dayjs";
import { Farm } from "./Farm";
import { SingleOrganisation } from "./Organization";

export interface Production {
  id: Number;
  fishFarmId: String;
  productionUnitId: String;
  biomass: String;
  count: String;
  currentBatch: String;
  stocked: String;
  meanWeight: String;
  createdBy: String;
  updatedBy: String;
  createdAt: String;
  updatedAt: String;
  currentDate: string;
  organisationId: Number;
  isManager?: Boolean;
  farm: Farm;
  field?: String;
  organisation: SingleOrganisation;
  fishCount: String;
  batchNumberId: String;
  age: String;
  meanLength: String;
  stockingDensityKG: String;
  stockingDensityNM: String;
  stockingLevel: String;
  waterTemp: String;
  DO: String;
  TSS: String;
  NH4: String;
  NO3: String;
  NO2: String;
  ph: String;
  visibility: String;
  productionUnit: {
    YearBasedPredicationProductionUnit?: any;
    id: String;
    name: String;
    type: String;
    capacity: String;
    waterflowRate: String;
    farmId: String;
  };
  fishSupply: {
    batchNumber: String;
    age: String;
  };
  WaterManageHistory?: {
    id: Number;
    currentDate: String;
    waterTemp: String;
    DO: String;
    TSS: String;
    NH4: String;
    NO3: String;
    NO2: String;
    ph: String;
    visibility: String;
    productionId: Number;
  }[];
  WaterManageHistoryAvgrage?: {
    id: Number;
    currentDate: String;
    waterTemp: String;
    DO: String;
    TSS: String;
    NH4: String;
    NO3: String;
    NO2: String;
    ph: String;
    visibility: String;
    productionId: Number;
  }[];
  FishManageHistory: {
    id: Number;
    fishFarmId: String;
    productionUnitId: String;
    biomass: String;
    fishCount: String;
    batchNumberId: Number;
    currentDate: String;
    age: String;
    meanLength: String;
    meanWeight: String;
    stockingDensityKG: String;
    stockingDensityNM: String;
    stockingLevel: String;
    createdBy: String;
    updatedBy: String;
    createdAt: String;
    updatedAt: String;
    organisationId: Number;
    field: String;
    productionId: Number;
  }[];
}
export interface MonthyFishAverage {
  biomass: Number;
  fishCount: Number;
  meanLength: Number;
  meanWeight: Number;
  stockingDensityKG: Number;
  stockingDensityNM: Number;
}
export interface MonthyWaterAverage {
  DO: Number;
  NH4: Number;
  NO2: Number;
  NO3: Number;
  TSS: Number;
  ph: Number;
  visibility: Number;
  waterTemp: Number;
}
export interface FarmGroup {
  farm: String;
  units: {
    id: Number;
    waterTemp: String;
    DO: String;
    TSS: String;
    NH4: String;
    NO3: String;
    NO2: String;
    ph: String;
    createdAt: String;
    visibility: String;
    productionUnit: {
      id: String;
      name: String;
      type: String;
      capacity: String;
      waterflowRate: String;
      createdAt: String;
      updatedAt: String;
      farmId: String;
    };
    monthlyAverages?: MonthyFishAverage;
    yearlyAverages?: MonthyFishAverage;
    allTimeAverages?: MonthyFishAverage;
    individualAverages?: MonthyFishAverage;
    monthlyAveragesWater?: MonthyWaterAverage;
    yearlyAveragesWater?: MonthyWaterAverage;
    allTimeAveragesWater?: MonthyWaterAverage;
    individualAveragesWater?: MonthyWaterAverage;
    WaterManageHistoryAvgrage: any;
    fishManageHistory: any;
    biomass: String;
    fishCount: String;
    batchNumberId: Number;
    age: String;
    field?: String;
    meanLength: String;
    meanWeight: String;
    stockingDensityKG: String;
    stockingDensityNM: String;
    stockingLevel: String;
    isManager: Boolean;
    fishSupply: {
      batchNumber: String;
      age: String;
    };
  }[];
}
[];
export interface FishManageHistoryGroup {
  farm: String;
  units: {
    id: Number;
    productionUnit: {
      id: String;
      name: String;
      type: String;
      capacity: String;
      waterflowRate: String;
      createdAt: String;
      updatedAt: String;
      farmId: String;
    };
    biomass: String;
    fishCount: String;
    batchNumberId: Number;
    age: String;
    field?: String;
    meanLength: String;
    meanWeight: String;
    stockingDensityKG: String;
    stockingDensityNM: String;
    stockingLevel: String;
    isManager: Boolean;
    fishSupply: {
      batchNumber: String;
      age: String;
    };
    fishManageHistory?: {
      id: Number;
      fishFarmId: String;
      productionUnitId: String;
      biomass: String;
      fishCount: String;
      batchNumberId: Number;
      currentDate: String;
      age: String;
      meanLength: String;
      meanWeight: String;
      stockingDensityKG: String;
      stockingDensityNM: String;
      stockingLevel: String;
      createdBy: string;
      updatedBy: String;
      createdAt: String;
      updatedAt: String;
      organisationId: Number;
      field: String;
      productionId: Number;
    }[];
  }[];
}
export interface WaterManageHistoryGroup {
  unit: String;
  units: {
    id: Number;
    productionUnit: {
      id: String;
      name: String;
      type: String;
      capacity: String;
      waterflowRate: String;
      createdAt: String;
      updatedAt: String;
      farmId: String;
    };
    biomass: String;
    fishCount: String;
    batchNumberId: Number;
    age: String;
    field?: String;
    meanLength: String;
    meanWeight: String;
    stockingDensityKG: String;
    stockingDensityNM: String;
    stockingLevel: String;
    isManager: Boolean;
    createdAt: String;
    fishSupply: {
      batchNumber: String;
      age: String;
    };
    WaterManageHistoryAvgrage?: {
      id: Number;
      currentDate: String;
      waterTemp: String;
      DO: String;
      TSS: String;
      NH4: String;
      NO3: String;
      NO2: String;
      ph: String;
      visibility: String;
      productionId: Number;
      createdAt: String;
    }[];
    WaterSampleHistory?: {
      id: Number;
      currentDate: String;
      waterTemp: String;
      DO: String;
      TSS: String;
      NH4: String;
      NO3: String;
      NO2: String;
      ph: String;
      visibility: String;
      productionId: Number;
    }[];
    waterManageHistory?: {
      DO: string;
      NH4: string;
      NO2: string;
      NO3: string;
      TSS: string;
      currentDate: string;
      id: number;
      ph: string;
      productionId: number;
      visibility: string;
      waterTemp: string;
    }[];
  }[];
}
