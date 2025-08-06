export interface UserInitialState {
  isLoading: boolean;
  users: SingleUser[];
  role: string;
}

export interface SingleUser {
  id: number;
  name: string;
  email: string;
  image: string;
  imageUrl: string;
  password: string;
  status: string;
  role: string;
  createdAt: string;
  organisationId: number;
  invite: boolean;
  access: boolean;
  organisation: Organisation;
  permissions: Permissions;
  userId?: number;
}

export interface FarmPermissions {
  id?: string;
  farmId: string;
  name: string;
  stock: boolean;
  transfer: boolean;
  harvest: boolean;
  mortalities: boolean;
  sample: boolean;
  createReport: boolean;
  feedingPlans: boolean;
}

export interface Permissions {
  createUsers: boolean;
  editUsers: boolean;
  editAdminRights: boolean;
  editOrganisation: boolean;
  addFeedSupply: boolean;
  editFeedSupply: boolean;
  addFishProducers: boolean;
  editFishProducers: boolean;
  createFishSupply: boolean;
  editFishSupply: boolean;
  createFarms: boolean;
  editFarms: boolean;
  transferFishBetweenFarms: boolean;
  farms?: FarmPermissions[];
}
export interface UserFormInputs {
  name: string;
  image: string;
  organisation: string;
  organisationType: string;
  organisationId: number;
  email: string;
  password: string;
  confirmPassword: string;
  permissions?: Permissions;
}
export interface AddUserFormInputs {
  name: string;
  image: string;
  organisationId: number;
  email: string;
  permissions: Permissions;
}
export interface Organisation {
  id: number;
  image: string | null;
  imageUrl: string;
  name: string;
  organisationCode: string;
  organisationType: string;
  updatedBy: number | null;
  createdBy: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  addressId: string;
  Farm: Farm[];
  contact: Contact[];
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
}
export interface FarmPermissions {
  farmId: string; // or number, depending on your Farm model
  stock: boolean;
  transfer: boolean;
  harvest: boolean;
  mortalities: boolean;
  sample: boolean;
  createReport: boolean;
  feedingPlans: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string | null;
  permission: string; // e.g. 'SUPERADMIN'
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  invite: boolean;
  organisationId: number;
}
