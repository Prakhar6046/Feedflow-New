import { averagesDropdown } from "@/app/_lib/utils";
import { BreadcrumInitialState, Sort } from "@/app/_typeModels/breadcrum";
import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { ActionPathnameNormalizer } from "next/dist/server/future/normalizers/request/action";

const initialState: any = {
  allFarms: [],
  allUnits: [],
  startDate: dayjs().startOf("year").format(),
  endDate: dayjs().format(),
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
      console.log("farm payload", action.payload);
      state.selectedDropDownfarms = action.payload;
    },
    setSelectedDropDownUnits: (state, action) => {
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
    setStartDate: (state, action) => {
      console.log(action.payload);

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
      state.startDate = dayjs().startOf("year").format();
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
