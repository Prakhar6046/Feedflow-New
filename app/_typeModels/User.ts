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
  inputRole?: string;
  createdAt: string;
  organisationId: number; 
  invite: boolean;
  access: boolean;
  organisationType: string;
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
  setup: {
    farm: number | number[];
    feedSupply: number | number[];
    fishSupply: number | number[];
  };
  users: {
    fishProducers: number | number[];
    feedManufacturers: number | number[];
  };
  manage: {
    production: number | number[];
    feedPrediction: number | number[];
  };
  feedLibrary: number | number[];
  growthModels: number | number[];
  organisations: {
    fishProducers: number | number[];
    feedManufacturers: number | number[];
  };
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
  userType?: string; // User type based on organization type
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
  permission: string; 
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  invite: boolean;
  organisationId: number;
}
