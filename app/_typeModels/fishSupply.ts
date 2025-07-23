import { Dayjs } from 'dayjs';
import { Farm } from './Farm';

export interface FishSupply {
  id: number;
  organisation: number;
  batchNumber: string;
  hatchingDate: Dayjs | any;
  spawningDate: Dayjs | any;
  spawningNumber: number;
  age: string;
  broodstockMale: string;
  broodstockFemale: string;
  fishFarm: string;
  fishFarmId: string;
  status: string;
  createdBy: number;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  organisationId: string;
  productionUnits: string;
  creator: {
    hatchery: [
      {
        id: string;
        name: string;
        code: string;
        altitude: string;
        fishSpecie: string;
        createdBy: number;
        updatedBy: string;
        createdAt: string;
        updatedAt: string;
        organisationId: number;
      },
    ];
  };
  farm: Farm;
}
