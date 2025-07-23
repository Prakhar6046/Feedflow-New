import { Farm } from './Farm';
import { SingleOrganisation } from './Organization';

export interface SampleEnvironment {
  id: number;
  fishFarmId: string;
  productionUnitId: string;
  date: string;
  do: string;
  ammonia: string;
  TSS: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  organisationId: number;
  farm: Farm;
  organisation: SingleOrganisation;

  productionUnit: {
    id: string;
    name: string;
    type: string;
    capacity: string;
    waterflowRate: string;
    farmId: string;
  };
}

export interface SampleStock {
  id: number;
  fishFarmId: string;
  productionUnitId: string;
  biomass: string;
  fishCount: string;
  meanLength: string;
  meanWeight: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  organisationId: number;
  farm: Farm;
  organisation: SingleOrganisation;

  productionUnit: {
    id: string;
    name: string;
    type: string;
    capacity: string;
    waterflowRate: string;
    farmId: string;
  };
}
