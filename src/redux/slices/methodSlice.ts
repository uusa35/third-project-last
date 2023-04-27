import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { branchSlice } from "./branchSlice";
import { areaSlice } from "./areaSlice";

const initialState = {
  method: "",
};

export const MethodSlice = createSlice({
  name: "method",
  initialState,
  reducers: {
    setMethod: (state: typeof initialState, action: PayloadAction<string>) => {
      return { method: action.payload };
    },

    resetMethod: (state: typeof initialState, action: PayloadAction<void>) =>
      initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(branchSlice.actions.setBranch, (state, action) => {
      state.method = "pickup";
    });
    builder.addCase(areaSlice.actions.setArea, (state, action) => {
      state.method = "delivery";
    });
  },
});

export const { setMethod, resetMethod } = MethodSlice.actions;
