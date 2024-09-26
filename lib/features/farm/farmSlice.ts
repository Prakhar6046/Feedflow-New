import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface Farm {
  name: String;
  addressLine1: String;
  addressLine2: String;
  province: String;
  city: String;
  zipCode: String;
  country: String;
}
interface InitialState {
  isLoading: boolean;
  farm: Farm;
}

const initialState: InitialState = {
  isLoading: false,
  farm: {} as Farm,
};

const farmSlice = createSlice({
  name: "farm",
  initialState,
  reducers: {
    handleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateFarm: (state, action: PayloadAction<Farm>) => {
      state.farm = action.payload;
    },
  },
});

// Actions
export const farmAction = farmSlice.actions;
//selector
export const selectFarmLoading = (state: RootState) => state.farm.isLoading;
export const selectFarm = (state: RootState) => state.farm.farm;

export const FarmReducer = farmSlice.reducer;
