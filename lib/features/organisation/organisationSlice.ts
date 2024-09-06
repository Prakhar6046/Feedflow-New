import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const organisationSlice = createSlice({
  name: "organisation",
  initialState,
  reducers: {
    handleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// Actions
export const organisationAction = organisationSlice.actions;
//selector
export const selectOrganisationLoading = (state: RootState) =>
  state.organisation.isLoading;

export const OrganisationReducer = organisationSlice.reducer;
