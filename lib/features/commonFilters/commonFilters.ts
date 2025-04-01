import { averagesDropdown } from "@/app/_lib/utils";
import { BreadcrumInitialState, Sort } from "@/app/_typeModels/breadcrum";
import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  allFarms: [],
  allUnits: [],
  startMonth: 1,
  endMonth: new Date().getMonth() + 1,
  selectedDropDownYears: [new Date().getFullYear()],
  selectedDropDownfarms: [],
  selectedDropDownUnits: [],
  selectedAverage: averagesDropdown[0],
};

const commonFilterSlice = createSlice({
  name: "commonFilter",
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
      debugger;
      state.selectedDropDownUnits = action.payload;
    },
    setSelectedDropDownYears: (state, action) => {
      state.selectedDropDownYears = action.payload;
    },
    handleYearChange: (state, action) => {
      const value = action.payload;
      state.selectedDropDownYears =
        typeof value === "string" ? value.split(",") : value;
    },
    setSelectedAverage: (state, action) => {
      state.selectedAverage = action.payload;
    },
    setStartMonth: (state, action) => {
      state.startMonth = action.payload;
    },
    setEndMonth: (state, action) => {
      state.endMonth = action.payload;
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
export const selectStartMonth = (state: RootState) =>
  Number(state.commonFilter.startMonth);
export const selectEndMonth = (state: RootState) =>
  Number(state.commonFilter.endMonth);
export const commonFilterReducer = commonFilterSlice.reducer;
