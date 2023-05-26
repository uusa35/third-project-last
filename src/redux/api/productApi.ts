import { Product, Locale } from '../../types';
import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        page?: string;
        limit?: string;
        lang: Locale['lang'] | string | undefined;
        url: string;
        category_id: string | number;
        destination?: any;
      }
    >({
      query: ({
        category_id,
        page,
        limit,
        lang,
        url,
        destination = {},
      }: any) => ({
        url: `items`,
        params: { category_id, page, limit },
        headers: {
          url,
          lang,
          ...destination,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getSearchProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        lang: Locale['lang'] | string | undefined;
        key?: string;
        branch_id?: string;
        areaId?: string;
        url: string;
        category_id?: string;
      }
    >({
      query: ({
        lang,
        key = ``,
        branch_id = '',
        areaId = ``,
        url,
        category_id,
      }: any) => ({
        url: `search`,
        params: {
          key,
          ...(category_id && { category_id: category_id }),
        },
        headers: {
          url,
          ...(areaId && { 'x-area-id': areaId }),
          ...(branch_id && { 'x-branch-id': branch_id }),
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getProduct: builder.query<
      AppQueryResult<Product>,
      {
        id: string | number;
        lang: Locale['lang'] | string | undefined;
        destination?: any;
        url: string;
      }
    >({
      query: ({ id, lang, url, destination = {} }: any) => ({
        url: `itemDetails`,
        params: { product_id: id },
        headers: {
          url,
          lang,
          ...destination
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getTopSearch: builder.query<
      AppQueryResult<{ topSearch: string[]; trendingItems: Product[] }>,
      {
        lang: Locale['lang'] | string | undefined;
        branchId?: string;
        areaId?: string;
        url: string;
      }
    >({
      query: ({ lang, branchId = ``, areaId = ``, url }) => ({
        url: `topSearches`,
        headers: {
          url,
          ...(areaId && { 'x-area-id': areaId }),
          ...(branchId && { 'x-branch-id': branchId }),
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductQuery,
  useGetTopSearchQuery,
  useGetSearchProductsQuery,
  useLazyGetSearchProductsQuery,
} = productApi;
