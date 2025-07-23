import { OrganizationInitialState } from '@/app/_typeModels/Organization';
import { RootState } from '@/lib/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: OrganizationInitialState = {
  isLoading: false,
  organisations: [],
};

const organisationSlice = createSlice({
  name: 'organisation',
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
