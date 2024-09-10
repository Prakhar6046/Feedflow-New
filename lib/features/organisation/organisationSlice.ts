import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface InitialState {
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
const initialState: InitialState = {
  isLoading: false,
  organisations: [],
};

const organisationSlice = createSlice({
  name: "organisation",
  initialState,
  reducers: {
    handleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateOrganisations: (state, action) => {
      state.organisations = action.payload;
    },
  },
});

// Actions
export const organisationAction = organisationSlice.actions;
//selector
export const selectOrganisationLoading = (state: RootState) =>
  state.organisation.isLoading;
export const selectOrganisations = (state: RootState) =>
  state.organisation.organisations;

export const OrganisationReducer = organisationSlice.reducer;
