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
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import CartProduct from '@/components/widgets/product/CartProduct';
import TextTrans from '@/components/TextTrans';
import { map } from 'lodash';
import PaymentSummary from '@/components/PaymentSummary';

type Props = {
  url: string;
  orderId: string;
};

export default function orderReceipt({ url, orderId }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    searchParams: { destination },
    locale: { lang },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);

  // console.log({ orderId });
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
      order_id: orderId,
      area_branch: destObj,
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
        {isSuccess ? (
          <div className="py-5">
            <h3
              className={`px-4 py-3 ${alexandriaFontSemiBold}`}
              suppressHydrationWarning={suppressText}
            >
              {t('order_items')}
            </h3>
            <div className="border-b-8 border-gray-100 px-4">
              {orderReceiptData.data?.order_summary?.items?.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-t-2 border-gray-200 py-5"
                  >
                    <div>
                      <div className="flex pb-2 items-end">
                        <h5 className="pe-6">
                          <TextTrans en={item.item_en} ar={item.item_ar} />
                        </h5>
                        <span className="text-sm">x{item.quantity}</span>
                      </div>
                      <div className="flex flex-wrap items-center">
                        {map(item.addon, (a) => (
                          <div key={a.addon_id} className="pe-3 pb-4">
                            <div className="bg-gray-100 text-zinc-400 rounded-2xl text-center h-8 px-3 pt-1">
                              <span className="pe-2 text-sm">
                                x{a.addon_quantity}
                              </span>
                              <TextTrans
                                en={a.addon_name_en}
                                ar={a.addon_name_ar}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p>{item.extra_notes}</p>
                    </div>
                    <p className="uppercase">
                      {item.total} {t('kwd')}
                    </p>
                  </div>
                )
              )}
            </div>
            <div className="py-3 border-b-8 border-gray-100 px-4">
              <h2
                className={`py-3 ${alexandriaFontSemiBold}`}
                suppressHydrationWarning={suppressText}
              >
                {t('contact_details')}
              </h2>
              <div className="font-semibold text-sm space-y-1">
                <p className="font-light">address</p>
                <p>notes</p>
                <p>name</p>
                <p>phone</p>
              </div>
            </div>


            {/* payment summary */}
            <div className="py-3 px-4">
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
                <PaymentSummary data={orderReceiptData.data.order_summary} />
              </div>



              {/* reorder */}
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
        ) : (
          <p>loading</p>
        )}
      </MainContentLayout>
    </Suspense>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      const { orderId }: any = query;
      if (!req.headers.host || !orderId) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          orderId,
          url: req.headers.host,
        },
      };
    }
);
