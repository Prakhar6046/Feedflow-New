import { SingleUser } from './User';

export interface OrganizationInitialState {
  isLoading: boolean;
  organisations: Organisation[];
}
export interface Organisation {
  id: number;
  name: string;
  contactNumber: string;
  contactPerson: string;
  image: string;
  organisationCode: string;
  createdAt: string;
  updatedAt: string;
}
export interface OrganizationAddress {
  id: string;
  name: string;
  street: string;
  province: string;
  city: string;
  postCode: string;
  createdAt: string;
  updatedAt: string;
  organisationId: string;
}
export interface OrganizationContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permission: string;
  createdAt: string;
  updatedAt: string;
  organisationId: string;
  invite: boolean;
}
export interface SingleOrganisation {
  id: number;
  name: string;
  contactNumber: string;
  contactPerson: string;
  image?: string;
  imageUrl?: string;
  organisationCode: string;
  createdAt: string;
  updatedAt: string;
  addressId?: string;
  contactId?: string;
  address?: OrganizationAddress;
  contact?: OrganizationContact[];
  users?: SingleUser[];
  organisationType: string;
}

export interface AddOrganizationFormInputs {
  organisationName: string;
  image: FileList;
  organisationCode: string;
  address: string;
  country: string;
  province: string;
  city: string;
  postCode: string;
  organisationType: string;
  createdBy: number;
  contacts: {
    name: string;
    role: string;
    email: string;
    phone: string;
    permission: string;
    invite?: boolean;
    newInvite?: boolean;
  }[];

  hatcheryName?: string;
  hatcheryCode?: string;
  fishSpecie?: string;
  hatcheryAltitude?: string;
}
export interface Hatchery {
  id: string;
  name: string;
  code: string;
  altitude: string;
  fishSpecie: string;
  createdBy?: number | null;
  updatedBy?: string | null;
  createdAt: string; // ISO date string from the DB
  updatedAt: string;
  organisationId?: number | null;
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
  hatchery: Hatchery[];
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
  newInvite: boolean;
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
