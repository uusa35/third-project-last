import Policy from '@/components/Policy';
import TextTrans from '@/components/TextTrans';
import ContentLoader from '@/components/skeletons';
import { googleMapUrl } from '@/constants/*';
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
import {
  MapIcon,
  PhoneArrowDownLeftIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { LocationCitySharp } from '@mui/icons-material';
import { find, lowerCase, map } from 'lodash';
import { NextPage } from 'next';
import React, { useEffect, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { setLocale } from 'yup';

type Props = {
  url: string;
};

const BranchIndex: NextPage<Props> = ({ url }): React.ReactNode => {
  const { t } = useTranslation();
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
    triggerGetBranches(
      {
        url,
        lang,
      },
      false
    );
  }, []);

  if (!isSuccess) return null;

  return (
    <MainContentLayout url={url} showBackBtnHeader currentModule="our_branches">
      <div className="flex flex-col mx-3  justify-start items-center">
        {map(branches?.Data, (b, i) => (
          <div
            key={i}
            className={`w-full p-4 space-y-2 border-b-2  border-gray-200`}
          >
            <div className="flex flex-row justify-between items-center">
              <span>
                <TextTrans ar={b.name_ar} en={b.name_en} length={60} />
              </span>
              <div className="flex flex-row gap-4">
                <a href={`tel:${b.mobile}`}>
                  <PhoneIcon className="w-5 h-5 text-gray-800" />
                </a>
                {b.latitude && b.longitude && (
                  <a
                    href={googleMapUrl(b.longitude, b.latitude)}
                    target="_blank"
                  >
                    <MapIcon className="w-5 h-5 text-gray-800" />
                  </a>
                )}
              </div>
            </div>
            <div className="text-md text-gray-400">{b.location}</div>
            <div className="flex flex-row ">
              <div className="text-md me-2">
                <span className="text-green-400">{b.status}</span>
              </div>
              <div className="text-md">
                <span>{b.mobile}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
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
