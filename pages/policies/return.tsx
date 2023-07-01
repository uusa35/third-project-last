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

const ReturnPolicy: NextPage<Props> = ({ url, element }): React.ReactElement => {
  const dispatch = useAppDispatch();
  const returnPolicy = find(element, (e) => e.key === 'Return policy');

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader
      currentModule="return_policy"
    >
      {returnPolicy ? (
        <Policy policyType={returnPolicy} />
      ): (
        <ContentLoader type="Policy" sections={1} />
      )}
    </MainContentLayout>
  )
}

export default ReturnPolicy;

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
