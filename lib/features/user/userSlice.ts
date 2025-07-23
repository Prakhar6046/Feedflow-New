import { UserInitialState } from '@/app/_typeModels/User';
import { RootState } from '@/lib/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserInitialState = {
  isLoading: false,
  users: [],
  role: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    handleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
    handleRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

// Actions
export const userAction = userSlice.actions;
//selector
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUsers = (state: RootState) => state.user.users;
export const selectRole = (state: RootState) => state.user.role;

export const UserReducer = userSlice.reducer;
