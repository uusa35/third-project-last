import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area } from '@/types/queries';
import { branchSlice } from './branchSlice';

const initialState: any = {
    method:undefined , //pickup or delivery or undefined,
    destination_Type:undefined,//pickup or delivery or undefined
    destination_id:null,//number or string

    category_id:null,//number or string

    destination:undefined     // area | branch
};

export const searchParamsSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {
    setArea: (state: typeof initialState, action: PayloadAction<Area>) =>
      action.payload,
  },
  extraReducers: (builder) => {
    builder.addCase(
      branchSlice.actions.setBranch,
      (state, action) => initialState
    );
  },
});

export const { setArea, removeArea } = searchParamsSlice.actions;