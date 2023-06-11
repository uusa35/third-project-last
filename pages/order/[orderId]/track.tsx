import CustomImage from '@/components/CustomImage';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyOrders from '@/appImages/empty_orders.png';
import NoOrder from '@/appImages/no_order.png';
import { Search } from '@mui/icons-material';
import { suppressText } from '@/constants/*';
import { NextPage } from 'next';

type Props = {
  url: string
}

const UserOrders: NextPage<Props> = ({ url }) => {
  const { t } = useTranslation();

  return (
    <Suspense>
      <MainHead
        title={t('track_order')}
        description={`${t('track_order')}`}
      />
      <MainContentLayout url={url} showBackBtnHeader currentModule="track_order">
        <div className="flex flex-col items-center justify-center h-[90vh] space-y-2 px-5">
          <CustomImage
            src={NoOrder}
            alt="empty orders"
            width={150}
            height={150}
          />
          <h3 className="text-lg font-bold" suppressHydrationWarning={suppressText}>
            {t('no_order_with_this_id')}
          </h3>
          <p className="text-zinc-500" suppressHydrationWarning={suppressText}>
            {t('check_the_id_and_try_again')}
          </p>
        </div>
      </MainContentLayout>
    </Suspense>
  )
}
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);