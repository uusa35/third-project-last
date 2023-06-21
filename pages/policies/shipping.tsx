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
  const { locale: { isRTL } } = useAppSelector((state) => state);
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
        <div className="p-5">
          <h2 className="font-bold pb-2">
            <TextTrans 
              en={shippingPolicy?.title_en} 
              ar={shippingPolicy?.title_ar} 
              className="!uppercase text-lg"
            />
          </h2>
          <p className="text-[#544A45]">
            <TextTrans 
              en={shippingPolicy?.content_en}
              ar={shippingPolicy?.content_ar} 
              className="block break-words"
              length={isRTL ? shippingPolicy?.content_ar.length : shippingPolicy?.content_en.length}
            />
          </p>
        </div>
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
