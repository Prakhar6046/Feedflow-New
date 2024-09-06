import { configureStore } from "@reduxjs/toolkit";
import { OrganisationReducer } from "./features/organisation/organisationSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { organisation: OrganisationReducer },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
