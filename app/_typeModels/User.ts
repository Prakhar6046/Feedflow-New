export interface UserInitialState {
  isLoading: Boolean;
  users: any;
  role: String;
}

export interface SingleUser {
  id: Number;
  name: String;
  email: String;
  image: String;
  imageUrl: String;
  password: String;
  status: String;
  role: String;
  createdAt: String;
  organisationId: number;
  invite: boolean;
  access: boolean;
  organisation: {
    organisationType(organisationType: any): string;
    name: String;
    imageUrl: String;
  };
  permissions: {
    editOrganisation: boolean;
    viewOrganisation: boolean;
    createOrganisation: boolean;
  };
}

export interface Permissions {
  viewOrganisation: boolean;
  editOrganisation: boolean;
  createOrganisation: boolean;
}
export interface UserEditFormInputs {
  name: string;
  image: string;
  organisation: string;
  organisationType: string;
  organisationId: Number;
  email: string;
  password: string;
  confirmPassword: string;
  permissions: Permissions;
}
export interface AddUserFormInputs {
  name: string;
  image: string;
  organisationId: Number;
  email: string;
  permissions: Permissions;
}
