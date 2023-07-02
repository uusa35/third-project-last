import Policy from '@/components/Policy';
import TextTrans from '@/components/TextTrans';
import ContentLoader from '@/components/skeletons';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { useLazyGetBranchesQuery } from '@/redux/api/branchApi';
import { staticPagesApi } from '@/redux/api/staticPagesApi';
import { vendorApi } from '@/redux/api/vendorApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { wrapper } from '@/redux/store';
import { StaticPage, Vendor } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import { find } from 'lodash';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { setLocale } from 'yup';

type Props = {
  url: string;
  element: StaticPage[];
};

const BranchIndex: NextPage<Props> = ({ url }): React.ReactNode => {
  const dispatch = useAppDispatch();
  const {
    locale: { lang },
  } = useAppSelector((state) => state);
  const [triggerGetBranches, { data: branches, isSuccess }] =
    useLazyGetBranchesQuery();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    triggerGetBranches({
      url,
      lang,
    });
  }, []);

  if (!isSuccess) return null;

  console.log('data', branches);

  return (
    <MainContentLayout url={url} showBackBtnHeader currentModule="our_branches">
      <div>BranchIndex</div>
    </MainContentLayout>
  );
};

export default BranchIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      if (!url) {
        return { notFound: true };
      }
      return {
        props: {
          url,
        },
      };
    }
);
