import { Dayjs } from "dayjs";

export interface FishSupply {
  id: Number;
  organisation: Number;
  hatchingDate: Dayjs | any;
  spawningDate: Dayjs | any;
  spawningNumber: Number;
  age: String;
  broodstockMale: String;
  broodstockFemale: String;
  fishFarm: String;
  fishFarmId: String;
  status: String;
  createdBy: Number;
  updatedBy: String;
  createdAt: String;
  updatedAt: String;
  organisationId: String;
  productionUnits: Number;
  creator: {
    hatchery: [
      {
        id: String;
        name: String;
        code: String;
        altitude: String;
        fishSpecie: String;
        createdBy: Number;
        updatedBy: String;
        createdAt: String;
        updatedAt: String;
        organisationId: Number;
      }
    ];
  };
}
