import { combineReducers } from '@reduxjs/toolkit';
import { localeSlice } from './localeSlice';
import { productApi } from './../api/productApi';
import { appLoadingSlice } from './appLoadingSlice';
import { apiSlice } from '../api';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { categoryApi } from '@/redux/api/categoryApi';
import { vendorApi } from '@/redux/api/vendorApi';
import { locationApi } from '@/redux/api/locationApi';
import { branchApi } from '@/redux/api/branchApi';
import { vendorSlice } from '@/redux/slices/vendorSlice';
// import { branchSlice } from '@/redux/slices/branchSlice';
// import { branchesSlice } from '@/redux/slices/branchesSlice';
// import { areaSlice } from '@/redux/slices/areaSlice';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';
import { customerSlice } from '@/redux/slices/customerSlice';
import { productCartSlice } from '@/redux/slices/productCartSlice';


export const rootReducer = combineReducers({
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [localeSlice.name]: localeSlice.reducer,
  [vendorSlice.name]: vendorSlice.reducer,
  // [branchSlice.name]: branchSlice.reducer,
  // [areaSlice.name]: areaSlice.reducer,
  // [branchesSlice.name]: branchesSlice.reducer,
  [appSettingSlice.name]: appSettingSlice.reducer,
  [searchParamsSlice.name]: searchParamsSlice.reducer,
  [customerSlice.name]: customerSlice.reducer,
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
  [branchApi.reducerPath]: branchApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [vendorApi.reducerPath]: vendorApi.reducer,
  [productCartSlice.name]: productCartSlice.reducer,
  
});
