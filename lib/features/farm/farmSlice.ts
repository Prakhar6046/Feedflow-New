import { Farm, FarmInitialState } from '@/app/_typeModels/Farm';
import { RootState } from '@/lib/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FarmInitialState = {
  isLoading: false,
  farm: {} as Farm,
  farms: [],
  editFarm: {} as Farm,
  isEditFarm: false,
};

const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    handleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateFarm: (state, action: PayloadAction<Farm>) => {
      state.farm = action.payload;
    },
    updateFarms: (state, action: PayloadAction<Farm[]>) => {
      state.farms = action.payload;
    },
    editFarm: (state, action: PayloadAction<Farm>) => {
      state.editFarm = action.payload;
    },
    resetState: (state) => {
      state.isEditFarm = false;
    },
  },
});

// Actions
export const farmAction = farmSlice.actions;
//selector
export const selectFarmLoading = (state: RootState) => state.farm.isLoading;
export const selectFarm = (state: RootState) => state.farm.farm;
export const selectFarms = (state: RootState) => state.farm.farms;
export const selectEditFarm = (state: RootState) => state.farm.editFarm;
export const selectIsEditFarm = (state: RootState) => state.farm.isEditFarm;

export const FarmReducer = farmSlice.reducer;
