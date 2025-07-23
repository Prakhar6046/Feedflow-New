import { configureStore } from '@reduxjs/toolkit';
import { OrganisationReducer } from './features/organisation/organisationSlice';
import { UserReducer } from './features/user/userSlice';
import { SidebarReducer } from './features/sidebar/sidebarSlice';
import { FarmReducer } from './features/farm/farmSlice';
import { FeedReducer } from './features/feed/feedSlice';
import { BreadcrumReducer } from './features/breadcrum/breadcrumSlice';
import { commonFilterReducer } from './features/commonFilters/commonFilters';
import { FeedPredictionReducer } from './features/feedPrediction/feedPredictionSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      organisation: OrganisationReducer,
      user: UserReducer,
      sidebar: SidebarReducer,
      farm: FarmReducer,
      feed: FeedReducer,
      breadcrum: BreadcrumReducer,
      commonFilter: commonFilterReducer,
      feedPrediction: FeedPredictionReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
