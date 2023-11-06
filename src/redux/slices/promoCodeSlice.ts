import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomePromoCode, HomePromoCodeSlice } from '@/types/index';
import moment from 'moment';
import { isEmpty } from 'lodash';

const initialState: HomePromoCodeSlice = {
  closedModals: [],
};

export const PromoCodeSlice = createSlice({
  name: 'PromoCode',
  initialState,
  reducers: {
    addToHiddenModals: (
      state,
      action: PayloadAction<{ closedDate: string; id: number }>
    ) => {
      console.log('pl', action.payload);
      return {
        ...state,
        closedModals: [...state.closedModals, action.payload],
      };
    },
    removeExpiredPromoCodes: (state, action: PayloadAction<void>) => {
      let remainHiddenModals: HomePromoCodeSlice['closedModals'] = [];

      // remove promos that is one day old
      state.closedModals.forEach((item, idx) => {
        if (moment().diff(moment(item.closedDate), 'days') < 1) {
          remainHiddenModals.push(item);
        }
      });
      // console.log({ remainHiddenModals });
      return { ...state, closedModals: [...remainHiddenModals] };
    },
  },
});

export const { removeExpiredPromoCodes, addToHiddenModals } =
  PromoCodeSlice.actions;
