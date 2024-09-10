import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface InitialState {
  isLoading: boolean;
  users: any;
}

const initialState: InitialState = {
  isLoading: false,
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

// Actions
export const userAction = userSlice.actions;
//selector
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUsers = (state: RootState) => state.user.users;

export const UserReducer = userSlice.reducer;
