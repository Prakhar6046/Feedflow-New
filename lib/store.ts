import { configureStore } from "@reduxjs/toolkit";
import { OrganisationReducer } from "./features/organisation/organisationSlice";
import { UserReducer } from "./features/user/userSlice";
import { SidebarReducer } from "./features/sidebar/sidebarSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      organisation: OrganisationReducer,
      user: UserReducer,
      sidebar: SidebarReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
