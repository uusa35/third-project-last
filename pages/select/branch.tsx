import MainHead from '@/components/MainHead';
import TextTrans from '@/components/TextTrans';
import { suppressText } from '@/constants/*';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useLazyGetBranchesQuery } from '@/redux/api/branchApi';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { wrapper } from '@/redux/store';
import { AppQueryResult, Branch } from '@/types/queries';
import { map } from 'lodash';
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';

type Props = {
  url: string
}

export default function index({ url }: Props) {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang },
    appSetting: { isRTL }
  } = useAppSelector((state) => state);

  const [triggerGetBranches, { data: branches, isLoading: branchesLoading }] = useLazyGetBranchesQuery<{
    data: AppQueryResult<Branch[]>;
    isLoading: boolean;
  }>();
  useEffect(() => {
    triggerGetBranches({ lang, url, type: 'pickup' }, false);   
  }, []);
  return (
    <>
    <MainHead 
      title={t('select_branch')}
      description={`${t('select_branch')}`}
    />
    <MainContentLayout url={url} showBackBtnHeader currentModule='select_branch'>
      <div className="px-4">
        <div className={`p-3`}>
          {map(branches?.Data, (b: Branch, i) => (
            <button
              key={i}
              // onClick={() =>
              //   setSelectedData({ ...selectedData, branch: b })
              // }
              className={`flex flex-row  w-full justify-between items-center px-2 py-3 border-b-2 border-gray-100`}
            >
            <div className="text-start">
              <p className="font-semibold">
                <TextTrans ar={b.name_ar} en={b.name_en} />
              </p>
              <p className="text-base text-zinc-500">{b.location}</p>
            </div>
            {isRTL ? <ArrowBackIos className="text-zinc-500" /> : <ArrowForwardIos className="text-zinc-500" />}
            </button>
          ))}
        </div>
      </div>
    </MainContentLayout>
    </>
      
  )
}
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      // const { method }: any = query;
      // if (!method) {
      //   return {
      //     notFound: true,
      //   };
      // }
      return {
        props: {
          previousRoute: req.headers.referer ?? null,
          // method,
          url: req.headers.host,
        },
      };
    }
);