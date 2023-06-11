import { Models } from '@/types/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { searchParamsSlice } from './searchParamsSlice';

const initialState: Models = {
  areaBranchIsOpen: false,
  closedStoreIsOpen: false,
  showHelpModal: false
};


export const ModelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setAreaBranchModelStatus: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => ({
      ...state,
      areaBranchIsOpen: action.payload,
    }),
    setClosedStoreModelStatus: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => ({
      ...state,
      closedStoreIsOpen: action.payload,
    }),
    toggleShowHelpModal: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => ({
      ...state,
      showHelpModal: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(searchParamsSlice.actions.setDestination, (state, action) => {
      state.areaBranchIsOpen = false;
    });
  },
});

export const { setAreaBranchModelStatus, setClosedStoreModelStatus, toggleShowHelpModal } = ModelsSlice.actions;