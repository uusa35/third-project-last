import Policy from '@/components/Policy';
import TextTrans from '@/components/TextTrans';
import ContentLoader from '@/components/skeletons';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { staticPagesApi } from '@/redux/api/staticPagesApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { wrapper } from '@/redux/store';
import { StaticPage } from '@/types/index';
import { find } from 'lodash';
import { NextPage } from 'next';
import React, { useEffect } from 'react'

type Props = {
  url: string;
  element: StaticPage[];
};

const ShippingPolicy: NextPage<Props> = ({ url, element }): React.ReactElement => {
  const dispatch = useAppDispatch();
  const shippingPolicy = find(element, (e) => e.key === 'Shipping policy');

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader
      currentModule="shipping_policy"
    >
      {shippingPolicy ? (
        <Policy policyType={shippingPolicy} />
      ): (
        <ContentLoader type="Policy" sections={1} />
      )}
    </MainContentLayout>
  )
}

export default ShippingPolicy;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      const { data: element, isError } = await store.dispatch(
        staticPagesApi.endpoints.getVendorStaticPages.initiate({ url })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.Data || !url) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          url,
        },
      };
    }
);
