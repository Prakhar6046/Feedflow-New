import { averagesDropdown } from '@/app/_lib/utils';
import { RootState } from '@/lib/store';
import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
export interface FilterState {
  allFarms: {
    id: string;
    option: string;
  }[];
  allUnits: {
    id: string;
    option: string;
  }[];
  startDate: string;
  endDate: string;
  selectedDropDownYears: number[];
  selectedDropDownfarms: {
    id: string;
    option: string;
  }[];
  selectedDropDownUnits: {
    id: string;
    option: string;
  }[];
  selectedAverage: string;
}
const initialState: FilterState = {
  allFarms: [],
  allUnits: [],
  startDate: dayjs().startOf('year').format(),
  endDate: dayjs().format(),
  selectedDropDownYears: [new Date().getFullYear()],
  selectedDropDownfarms: [],
  selectedDropDownUnits: [],
  selectedAverage: averagesDropdown[0],
};

const commonFilterSlice = createSlice({
  name: 'commonFilter',
  initialState,
  reducers: {
    setAllFarms: (state, action) => {
      state.allFarms = action.payload;
    },
    setAllUnits: (state, action) => {
      state.allUnits = action.payload;
    },
    setSelectedDropDownfarms: (state, action) => {
      state.selectedDropDownfarms = action.payload;
    },
    setSelectedDropDownUnits: (state, action) => {
      console.log();

      state.selectedDropDownUnits = action.payload;
    },
    setSelectedDropDownYears: (state, action) => {
      state.selectedDropDownYears = action.payload;
    },
    handleYearChange: (state, action) => {
      const value = action.payload;
      state.selectedDropDownYears =
        typeof value === 'string' ? value.split(',') : value;
    },
    setSelectedAverage: (state, action) => {
      state.selectedAverage = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    handleResetFilters: (state) => {
      state.selectedDropDownfarms = state.allFarms;
      state.selectedDropDownUnits = [];
      state.selectedDropDownYears = [new Date().getFullYear()];
      state.selectedAverage = averagesDropdown[0];
      state.startDate = dayjs().startOf('year').format();
      state.endDate = dayjs().format();
    },
  },
});

// Actions
export const commonFilterAction = commonFilterSlice.actions;
//selector
export const selectAllFarms = (state: RootState) => state.commonFilter.allFarms;
export const selectAllUnits = (state: RootState) => state.commonFilter.allUnits;
export const selectSelectedFarms = (state: RootState) =>
  state.commonFilter.selectedDropDownfarms;
export const selectSelectedUnits = (state: RootState) =>
  state.commonFilter.selectedDropDownUnits;
export const selectDropDownYears = (state: RootState) =>
  state.commonFilter.selectedDropDownYears;
export const selectSelectedAverage = (state: RootState) =>
  state.commonFilter.selectedAverage;
export const selectStartDate = (state: RootState) =>
  state.commonFilter.startDate;
export const selectEndDate = (state: RootState) => state.commonFilter.endDate;
export const commonFilterReducer = commonFilterSlice.reducer;
