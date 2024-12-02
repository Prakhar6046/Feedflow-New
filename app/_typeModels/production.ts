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
      createdBy: String;
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
    waterManageHistory?: {
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
  }[];
}
