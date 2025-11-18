import { ModuleAccessMap } from '../_lib/constants/userAccessMatrix';
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
  advisors?: OrganisationAdvisorLink[];
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
    inputRole?: string;
    email: string;
    phone: string;
    userType: string;
    permission?: string;
    permissions?: ModuleAccessMap;
    invite?: boolean;
    newInvite?: boolean;
    userDefinition?: string;
  }[];

  hatcheryName?: string;
  hatcheryCode?: string;
  fishSpecie?: string;
  hatcheryAltitude?: string;
  allocatedAdvisors?: AdvisorFormInput[];
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
  users?: SingleUser[];
  hatchery: any[];
  Farm: Farm[];
  advisors?: OrganisationAdvisorLink[];
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
  invite: boolean;
  role: string;
  inputRole?: string;
  permission: string;
  permissions?: ModuleAccessMap;
  userType?: string;
  userDefinition?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  organisationId: number;
}

export interface OrganisationAdvisorLink {
  id: string;
  organisationId: number;
  advisorId: number;
  accessLevel: number;
  advisor?: SingleUser;
}

export interface AdvisorFormInput {
  advisorId: number | null;
  accessLevel: number | null;
  advisorEmail?: string;
  advisorName?: string;
  isFromContact?: boolean; // Flag to identify if advisor comes from contacts
  contactIndex?: number; // Index of the contact in the contacts array
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
  address?: OrganizationAddress;
  contact?: OrganizationContact[];
}
