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

const PrivacyPolicy: NextPage<Props> = ({ url, element }): React.ReactElement => {
  const { isRTL } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const privacyPolicy = find(element, (e) => e.key === 'Privacy policy');

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader
      currentModule="privacy_policy"
    >
      {privacyPolicy ? (
        <div className="p-5">
          <h2 className="font-bold pb-2">
            <TextTrans 
              en={privacyPolicy?.title_en} 
              ar={privacyPolicy?.title_ar} 
              className="!uppercase text-lg"
            />
          </h2>
          <p className="text-[#544A45]">
            <TextTrans 
              en={privacyPolicy?.content_en}
              ar={privacyPolicy?.content_ar} 
              className="block break-words"
              length={isRTL ? privacyPolicy?.content_ar.length : privacyPolicy?.content_en.length}
            />
          </p>
        </div>
      ): (
        <ContentLoader type="Policy" sections={1} />
      )}
    </MainContentLayout>
  )
}

export default PrivacyPolicy;

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
