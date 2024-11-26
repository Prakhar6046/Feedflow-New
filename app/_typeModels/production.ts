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
  organisation: SingleOrganisation;
  fishCount: String;
  batchNumberId: String;
  age: String;
  meanLength: String;
  stockingDensityKG: String;
  stockingDensityNM: String;
  stockingLevel: String;
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
}
export interface FarmGroup {
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
    meanLength: String;
    meanWeight: String;
    stockingDensityKG: String;
    stockingDensityNM: String;
    stockingLevel: String;
    fishSupply: {
      batchNumber: String;
      age: String;
    };
  }[];
}
[];
