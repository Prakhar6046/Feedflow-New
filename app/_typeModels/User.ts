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
  organisationId: Number;
  organisation: {
    name: String;
    imageUrl: String;
  };
}
export interface UserEditFormInputs {
  name: string;
  image: string;
  organisation: string;
  organisationId: Number;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface AddUserFormInputs {
  name: string;
  image: string;
  organisationId: Number;
  email: string;
}
