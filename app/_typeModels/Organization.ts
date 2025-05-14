import { SingleUser } from "./User";

export interface OrganizationInitialState {
  isLoading: boolean;
  organisations: Organisation[];
}
export interface Organisation {
  id: Number;
  name: String;
  contactNumber: String;
  contactPerson: String;
  image: String;
  organisationCode: String;
  createdAt: String;
  updatedAt: String;
}
export interface OrganizationAddress {
  id: String;
  name: String;
  street: String;
  province: String;
  city: String;
  postCode: String;
  createdAt: String;
  updatedAt: String;
  organisationId: String;
}
export interface OrganizationContact {
  id: String;
  name: String;
  email: String;
  phone: String;
  role: String;
  createdAt: String;
  updatedAt: String;
  organisationId: String;
}
export interface SingleOrganisation {
  id: Number;
  name: String;
  contactNumber: String;
  contactPerson: String;
  image?: String;
  imageUrl?: String;
  organisationCode: String;
  createdAt: String;
  updatedAt: String;
  addressId?: String;
  contactId?: String;
  address?: OrganizationAddress;
  contact?: OrganizationContact[];
  users?: SingleUser[];
  organisationType: string;
}
export interface AddOrganizationFormInputs {
  organisationName: String;
  image: FileList;
  organisationCode: String;
  address: String;
  country: String;
  province: String;
  city: String;
  postCode: String;
  organisationType: String;
  contacts: {
    name: string;
    role: string;
    email: string;
    phone: string;
  }[];
  members: {
    name: string;
    email: string;
    phone: string;
  }[];
  hatcheryName?: String;
  hatcheryCode?: String;
  fishSpecie?: String;
  hatcheryAltitude?: String;
}
