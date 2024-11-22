import { Farm } from "./Farm";
import { SingleOrganisation } from "./Organization";

export interface SampleEnvironment {
  id: Number;
  fishFarmId: String;
  productionUnitId: String;
  date: String;
  do: String;
  ammonia: String;
  TSS: String;
  createdBy: String;
  updatedBy: String;
  createdAt: String;
  updatedAt: String;
  organisationId: Number;
  farm: Farm;
  organisation: SingleOrganisation;

  productionUnit: {
    id: String;
    name: String;
    type: String;
    capacity: String;
    waterflowRate: String;
    farmId: String;
  };
}

export interface SampleStock {
  id: Number;
  fishFarmId: String;
  productionUnitId: String;
  biomass: String;
  fishCount: String;
  meanLength: String;
  meanWeight: String;
  createdBy: String;
  updatedBy: String;
  createdAt: String;
  updatedAt: String;
  organisationId: Number;
  farm: Farm;
  organisation: SingleOrganisation;

  productionUnit: {
    id: String;
    name: String;
    type: String;
    capacity: String;
    waterflowRate: String;
    farmId: String;
  };
}
