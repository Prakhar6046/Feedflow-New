import { RootState } from '@/lib/store';
import { createSlice } from '@reduxjs/toolkit';
interface InitialState {
  switchSidebar: boolean;
}

const initialState: InitialState = {
  switchSidebar: false,
};
const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    handleSwitchSidebar: (state, action) => {
      state.switchSidebar = action.payload;
    },
  },
});

// Actions
export const sidebarAction = sidebarSlice.actions;
//selector
export const selectSwitchSidebar = (state: RootState) =>
  state.sidebar.switchSidebar;

export const SidebarReducer = sidebarSlice.reducer;
