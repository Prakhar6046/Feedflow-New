import { Farm } from "./Farm";
import { SingleOrganisation } from "./Organization";

export interface FarmManager {
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
  farm: Farm;
  organisation: SingleOrganisation;
}
