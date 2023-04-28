import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area, Branch, Category } from '@/types/queries';
import { branchSlice } from './branchSlice';

const initialState: any = {
  method: undefined, //pickup or delivery or undefined,
  destination_Type: undefined,//pickup or delivery or undefined
  destination_id: null,//number or string

  category_id: null,//number or string

  destination: undefined     // area | branch
};

export const searchParamsSlice = createSlice({
  name: 'searchParams',
  initialState,
  reducers: {
    setDestination: (state: typeof initialState, action: PayloadAction<{ destination: Branch | Area, type: 'pickup' | 'delivery'>) => ({
      method: action.payload.type,
      destination: action.payload.destination,
      destination_type: action.payload.type === 'pickup' ? 'branch' : 'area'
    }),
    setCategory: (state: typeof initialState, action: PayloadAction<number>) => ({
      ...state,
      category_id: action.payload,
    }),
  }
});

export const { setDestination, setCategory } = searchParamsSlice.actions;