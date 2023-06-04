import CustomImage from '@/components/CustomImage';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyOrders from '@/appImages/empty_orders.png';
import Search from '@/appIcons/gray_search.svg';
import MyOrders from '@/appImages/my_orders.png';
import {
  alexandriaFontBold,
  alexandriaFontLight,
  appLinks,
} from '@/constants/*';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import { suppressText } from '@/constants/*';
import { useGetUserOrdersQuery } from '@/redux/api/orderApi';
import { useAppSelector } from '@/redux/hooks';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { AppQueryResult } from '@/types/queries';

type Props = {
  url: string;
};

export default function UserOrders({ url }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    customer: { token },
    locale: { lang },
  } = useAppSelector((state) => state);
  const destination = useAppSelector(destinationHeaderObject);

  const { data, isLoading, isSuccess } = useGetUserOrdersQuery<{
    isSuccess: boolean;
    isLoading: boolean;
    data: AppQueryResult<any>;
  }>({ url, lang, destination }, { refetchOnMountOrArgChange: true });

  const handleChange = (orderId: string) => {
    router.push(`${appLinks.orderTrack(orderId)}`);
  };

  return (
    <Suspense>
      <MainHead title={t('orders')} description={`${t('orders')}`} />
      <MainContentLayout url={url} showBackBtnHeader currentModule="my_orders">
        {isSuccess  ? (
          <>
            {/* {data&& data} */}
            <div>
              <div className="flex flex-col items-center space-y-2 px-4 py-8 border-b-8 border-gray-100">
                <CustomImage
                  src={MyOrders}
                  alt="my orders"
                  width={100}
                  height={100}
                />
                <h3
                  className="text-base font-bold"
                  suppressHydrationWarning={suppressText}
                >
                  {t('have_a_order_id?_enter_it_to_track_it')}
                </h3>
                <div className="w-full flex items-center border-b-2 border-gray-200">
                  <Search className="text-zinc-500" />
                  <input
                    type="search"
                    name="searchArea"
                    id="searchArea"
                    placeholder={`${t('order_id')}`}
                    suppressHydrationWarning={suppressText}
                    className={`flex-1 px-2 py-3 h-12 bg-transparent text-base text-zinc-600 capitalize foucs:ring-0 outline-none`}
                    onChange={debounce(
                      (e) => handleChange(e.target.value),
                      400
                    )}
                  />
                </div>
              </div>
              <div>
                <h2 className="p-3 text-lg font-bold">{t('upcoming')}</h2>
                <div className="border-b-2 border-gray-100 pt-3 pb-2 px-4">
                  <div className="text-base space-y-1">
                    <p
                      className="font-semibold"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('order')} #132465987
                    </p>
                    <p className="text-zinc-700 text-base">
                      Sunday 20 March , 11:00 PM
                    </p>
                    <p>
                      Double Big Tasty <span>x1</span>
                    </p>
                    <p>
                      Grand Share Box <span>x1</span>
                    </p>
                    <p
                      className="font-semibold"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('total')} price {t('kwd')}
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      href={appLinks.orderTrack('1')}
                      className="w-full block text-center h-10 px-10 pt-1 bg-gray-100 rounded-full me-2"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('track_order')}
                    </Link>
                  </div>
                </div>
              </div>
              <h2
                className="p-3 text-lg font-bold"
                suppressHydrationWarning={suppressText}
              >
                {t('completed')}
              </h2>
              <div className="border-b-2 border-gray-100 py-3 px-4">
                <div className="text-base space-y-2">
                  <p
                    className="font-semibold"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('order')} #132465987
                  </p>
                  <p className="text-zinc-700 text-base">
                    Sunday 20 March , 11:00 PM
                  </p>
                  <p className="text-sm ps-5 text-green-500">
                    {t('delivered_successfully')}
                  </p>
                  <p>
                    Double Big Tasty <span>x1</span>
                  </p>
                  <p>
                    Grand Share Box <span>x1</span>
                  </p>
                </div>
                <div className="py-3">
                  <Link
                    href={appLinks.productShow(`425`)}
                    className="inline-block me-1 pt-2 pb-3 px-10 bg-gray-100 rounded-full"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('re_order')}
                  </Link>
                  <Link
                    href={appLinks.orderReceipt('1')}
                    className="inline-block me-1 pt-2 pb-3 px-10 bg-gray-100 rounded-full"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('view_receipt')}
                  </Link>
                </div>
              </div>
              <div className="border-b-2 border-gray-100 py-3 px-4">
                <div className="text-base space-y-2">
                  <p
                    className="font-semibold"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('order')} #132465987
                  </p>
                  <p className="text-zinc-700 text-base">
                    Sunday 20 March , 11:00 PM
                  </p>
                  <p
                    className="text-sm ps-5 text-red-500"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('cancelled_successfully')}
                  </p>
                  <p>
                    Double Big Tasty <span>x1</span>
                  </p>
                  <p>
                    Grand Share Box <span>x1</span>
                  </p>
                </div>
                <div className="py-3">
                  <Link
                    href={appLinks.productShow(`425`)}
                    className="inline-block me-1 pt-2 pb-3 px-10 bg-gray-100 rounded-full"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('re_order')}
                  </Link>
                  <Link
                    href={appLinks.orderReceipt('1')}
                    className="inline-block me-1 pt-2 pb-3 px-10 bg-gray-100 rounded-full"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('view_receipt')}
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>loading skelton</p>
        )}
      </MainContentLayout>
    </Suspense>
  );
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
