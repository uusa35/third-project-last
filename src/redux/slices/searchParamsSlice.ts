import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Area, Branch, Category, SearchParams } from "@/types/queries";
import { RootState } from "../store";
import { DestinationInfo } from "@/types/index";

const initialState: DestinationInfo = {
  method: undefined,
  destination: undefined,
  destination_type: undefined,
  category_id: null,
};

export const searchParamsSlice = createSlice({
  name: "searchParams",
  initialState,
  reducers: {
    setDestination: (
      state: typeof initialState,
      action: PayloadAction<{
        destination: Branch | Area;
        method: "pickup" | "delivery";
      }>
    ) => ({
      ...state,
      method: action.payload.method,
      destination_type: action.payload.method === "pickup" ? "branch" : "area",
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
  state.method === "pickup"
    ? { branch_id: state.destination?.id }
    : { area_id: state.destination?.id };
// branch_id: method !== `pickup` ? branch_id : ``,
//   area_id: method === `pickup` ? area_id : ``,
