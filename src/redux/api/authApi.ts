import { apiSlice } from './index';
import { AppQueryResult, PhoneCheck, Register, VerifyCode } from '@/types/queries';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkPhone: builder.mutation<
      AppQueryResult<PhoneCheck>,
      {
        body: {
            phone: string;
            phone_country_code: string;
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `phone-check`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result.status,
      }),
    }),
    verifyCode: builder.mutation<
      AppQueryResult<VerifyCode>,
      {
        body: {
            phone: string;
            phone_country_code: string;
            code: string,
            type: 'register' | 'rest'
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `verify`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result.status,
      }),
    }),
    register: builder.mutation<
      AppQueryResult<Register>,
      {
        body: {
            phone: string;
            phone_country_code: string;
            name: string;
            email: string
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `register`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result.status,
      }),
    }),
    login: builder.mutation<
      AppQueryResult<Register>,
      {
        body: {
            phone: string;
            phone_country_code: string;
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `login`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result.status,
      }),
    }),
  }),
});

export const { 
    useCheckPhoneMutation,
    useVerifyCodeMutation,
    useRegisterMutation,
    useLoginMutation
} = authApi;
