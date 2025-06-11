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
  permission: string;
  createdAt: String;
  updatedAt: String;
  organisationId: String;
  invite: boolean;
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
  createdBy: Number;
  contacts: {
    name: string;
    role: string;
    email: string;
    phone: string;
    permission: string;
    invite?: boolean;
    newInvite?: boolean;
  }[];

  hatcheryName?: String;
  hatcheryCode?: String;
  fishSpecie?: String;
  hatcheryAltitude?: String;
}

export interface OrganizationData {
  id: number;
  image: string;
  imageUrl: string;
  name: string;
  organisationCode: string;
  organisationType: string;
  updatedBy: null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  addressId: string;
  address: Address;
  contact: Contact[];
  hatchery: any[];
  Farm: Farm[];
}

export interface Address {
  id: string;
  name: string | null;
  street: null;
  province: string;
  city: string;
  postCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  organisationId: null;
  addressLine1?: string; // Optional as it appears only in farmAddress
  addressLine2?: string; // Optional as it appears only in farmAddress
  zipCode?: string; // Optional as it appears only in farmAddress
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permission: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  organisationId: number;
}

export interface Farm {
  id: string;
  name: string;
  farmAltitude: string;
  farmAddressId: string;
  lat: string;
  lng: string;
  fishFarmer: string;
  updatedBy: null;
  createdBy: null;
  organisationId: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  farmAddress: Address; // Reusing the Address interface as it has similar structure
}

export interface FeedSupplier {
  id: number;
  image: string | null;
  imageUrl: string | null;
  name: string;
  organisationCode: string;
  organisationType: string;
  updatedBy: number | null;
  createdBy: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  addressId: string;
}
