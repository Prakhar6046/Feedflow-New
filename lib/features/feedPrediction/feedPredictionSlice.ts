import { RootState } from '@/lib/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  currentFarmTab: '',
};

const feedPredictionSlice = createSlice({
  name: 'feedPrediction',
  initialState,
  reducers: {
    setFarmTab: (state, action: PayloadAction<string>) => {
      state.currentFarmTab = action.payload;
    },
  },
});

// Actions
export const feedPredictionAction = feedPredictionSlice.actions;
//selector
export const selectCurrentFarmTab = (state: RootState) =>
  state.feedPrediction.currentFarmTab;

export const FeedPredictionReducer = feedPredictionSlice.reducer;
