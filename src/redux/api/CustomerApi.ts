import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { CustomerInfo } from '@/types/index';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveCustomerInfo: builder.mutation<
      AppQueryResult<any>,
      {
        body: CustomerInfo;
        url: string;
      }
    >({ 
      query: ({ body, url }) => ({
        url: `customer-info`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
    createTempId: builder.query<
      AppQueryResult<{ Id: string }>,
      { url: string }
    >({
      query: ({ url }) => ({
        url: `tempId`,
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getWishListProducts: builder.query<AppQueryResult<any>, { url: string }>({
      query: ({ url }) => ({
        url: `getWishList`,
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    deleteFromWishList: builder.query<
      AppQueryResult<{ Id: string }>,
      { url: string }
    >({
      query: ({ url }) => ({
        url: `tempId`,
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    addToWishList: builder.mutation<
      AppQueryResult<any>,
      {
        body: any;
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `addToWishList`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
  }),
});

export const {
  useAddToWishListMutation,
  useSaveCustomerInfoMutation,
  useLazyCreateTempIdQuery,
  useGetWishListProductsQuery
} = customerApi;
