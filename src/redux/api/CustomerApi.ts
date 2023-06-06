import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { CustomerInfo } from '@/types/index';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    SaveCustomerInfo: builder.mutation<
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

    GetWishListProducts: builder.query<AppQueryResult<any>, { url: string }>({
      query: ({ url }) => ({
        url: `getWishList`,
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),

    DeleteFromWishList: builder.query<
      AppQueryResult<{ Id: string }>,
      { url: string; product_id: string }
    >({
      query: ({ url, product_id }) => ({
        url: `removeProductWishList`,
        params: { product_id },
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),

    AddToWishList: builder.mutation<
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
  useGetWishListProductsQuery,
  useLazyDeleteFromWishListQuery
} = customerApi;
