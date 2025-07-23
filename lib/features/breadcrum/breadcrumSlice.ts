import { BreadcrumInitialState, Sort } from '@/app/_typeModels/breadcrum';
import { RootState } from '@/lib/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BreadcrumInitialState = {
  sort: {
    column: '',
    direction: '',
  },
};

const breadcrumSlice = createSlice({
  name: 'breadcrum',
  initialState,
  reducers: {
    handleSort: (state, action: PayloadAction<Sort>) => {
      state.sort = action.payload;
    },
  },
});

// Actions
export const breadcrumsAction = breadcrumSlice.actions;
//selector
export const selectSort = (state: RootState) => state.breadcrum.sort;

export const BreadcrumReducer = breadcrumSlice.reducer;
