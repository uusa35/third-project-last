import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area, Branch, Category, SearchParams } from '@/types/queries';
import { RootState } from '../store';

const initialState: SearchParams = {
  method: null,
  destination: null,
  destination_type: null,
  category_id: null,
};

export const searchParamsSlice = createSlice({
  name: 'searchParams',
  initialState,
  reducers: {
    setDestination: (
      state: typeof initialState,
      action: PayloadAction<{
        destination: Branch | Area;
        type: 'pickup' | 'delivery';
      }>
    ) => ({
      ...state,
      method: action.payload.type,
      destination_type: action.payload.type === 'pickup' ? 'branch' : 'area',
      destination: action.payload.destination,
    }),
    setCategory: (
      state: typeof initialState,
      action: PayloadAction<number>
    ) => ({
      ...state,
      category_id: action.payload,
    }),
  },
});

export const { setDestination, setCategory } = searchParamsSlice.actions;
export const destinationId = (state: RootState) => state.destination.id;
export const destinationObject = (state: RootState) =>
  state.method === 'pickup'
    ? { 'x-branch-id': state.destination?.id }
    : { 'x-area-id': state.destination?.id };
// branch_id: method !== `pickup` ? branch_id : ``,
//   area_id: method === `pickup` ? area_id : ``,
