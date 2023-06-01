import MainContentLayout from '@/layouts/MainContentLayout';
import React from 'react';
import { Suspense } from 'react';
import MainHead from '@/components/MainHead';
import { useTranslation } from 'react-i18next';
import { wrapper } from '@/redux/store';
import Cash from '@/appIcons/cash_checkout.svg';
import {
  suppressText,
  mainBtnClass,
  appLinks,
  alexandriaFontSemiBold,
} from '@/constants/*';
import { useRouter } from 'next/router';
import { useGetInvoiceQuery } from '@/redux/api/orderApi';
import { useAppSelector } from '@/redux/hooks';
import { AppQueryResult } from '@/types/queries';
import { OrderInvoice } from '@/types/index';

type Props = {
  url: string;
};

export default function orderReceipt({ url }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    searchParams: { destination },
    locale: { lang },
  } = useAppSelector((state) => state);

  const {
    data: orderReceiptData,
    isSuccess,
    isLoading,
  } = useGetInvoiceQuery<{
    data: AppQueryResult<OrderInvoice>;
    isSuccess: boolean;
    isLoading: boolean;
  }>(
    {
      order_id: '1',
      area_branch: destination,
      url,
      lang,
    },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <Suspense>
      <MainHead
        title={t('order_receipt')}
        description={`${t('order_receipt')}`}
      />
      <MainContentLayout
        url={url}
        showBackBtnHeader
        currentModule="order_receipt"
      >
        <div className="py-5">
          <h3
            className={`px-4 py-3 ${alexandriaFontSemiBold}`}
            suppressHydrationWarning={suppressText}
          >
            {t('order_items')}
          </h3>
          <div className="border-b-8 border-gray-100 px-4">
            {/* {cartItems?.data?.Cart?.map((product) => (
                <CartProduct product={product} checkoutProduct={true} />
              ))} */}
          </div>
          <div className="py-3 border-b-8 border-gray-100 px-4">
            <h2
              className={`py-3 ${alexandriaFontSemiBold}`}
              suppressHydrationWarning={suppressText}
            >
              {t('contact_details')}
            </h2>
            <div className="font-semibold text-sm space-y-1">
              <p>method</p>
              <p className="font-light">address</p>
              <p>notes</p>
              <p>name</p>
              <p>phone</p>
            </div>
          </div>
          <div className="px-4">
            <h2
              className={`text-lg  py-3 ${alexandriaFontSemiBold}`}
              suppressHydrationWarning={suppressText}
            >
              {t('payment_details')}
            </h2>
            <div className="flex items-center py-1">
              <Cash />
              <p className="ps-3">payment method</p>
            </div>
            <div className="pb-36 space-y-1">
              <div className="flex justify-between text-gray-700 text-lg">
                <h4 suppressHydrationWarning={suppressText}>{t('subtotal')}</h4>
                <p suppressHydrationWarning={suppressText}>
                  subtotal {t('kwd')}
                </p>
              </div>
              <div className="flex justify-between text-gray-700 text-lg">
                <h4 suppressHydrationWarning={suppressText}>
                  {t('delivery_fees')}
                </h4>
                <p suppressHydrationWarning={suppressText}>
                  delivery fees {t('kwd')}
                </p>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <h4 suppressHydrationWarning={suppressText}>{t('total')}</h4>
                <p suppressHydrationWarning={suppressText}>total {t('kwd')}</p>
              </div>
            </div>
            <div className="border-t-[1px] border-gray-200 py-5">
              <button
                className={`${mainBtnClass} bg-gray-100`}
                onClick={() => router.push(`${appLinks.home.path}`)}
              >
                <span
                  className="text-black"
                  suppressHydrationWarning={suppressText}
                >
                  {t('re_order')}
                </span>
              </button>
            </div>
          </div>
        </div>
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
