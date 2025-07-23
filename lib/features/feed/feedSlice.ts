import { FeedSupply } from '@/app/_components/feedSupply/FeedSelection';
import { FeedInitialState } from '@/app/_typeModels/Feed';
import { RootState } from '@/lib/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FeedInitialState = {
  isLoading: false,
  editFeed: {} as FeedSupply,
  isEditFeed: false,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    handleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    editFeed: (state, action: PayloadAction<FeedSupply>) => {
      state.editFeed = action.payload;
      state.isEditFeed = true;
    },
    resetState: (state) => {
      state.isEditFeed = false;
    },
  },
});

// Actions
export const feedAction = feedSlice.actions;
//selector
export const selectFarmLoading = (state: RootState) => state.feed.isLoading;
export const selectEditFeed = (state: RootState) => state.feed.editFeed;
export const selectIsEditFeed = (state: RootState) => state.feed.isEditFeed;

export const FeedReducer = feedSlice.reducer;
