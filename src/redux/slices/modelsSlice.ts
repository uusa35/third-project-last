import { Models } from '@/types/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Models = {
    areaBranchIsOpen: false,
    closedStoreIsOpen: false
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
    },
  });

  export const { setAreaBranchModelStatus, setClosedStoreModelStatus } = ModelsSlice.actions;