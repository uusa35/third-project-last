import MainContentLayout from '@/layouts/MainContentLayout';
import React, { Fragment } from 'react';
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
  alexandriaFont,
  alexandriaFontLight,
} from '@/constants/*';
import { useRouter } from 'next/router';
import { useGetInvoiceQuery } from '@/redux/api/orderApi';
import { useAppSelector } from '@/redux/hooks';
import { AppQueryResult } from '@/types/queries';
import {
  CheckBoxes,
  OrderInvoice,
  QuantityMeters,
  RadioBtns,
} from '@/types/index';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import CartProduct from '@/components/widgets/product/CartProduct';
import TextTrans from '@/components/TextTrans';
import { isEmpty, map } from 'lodash';
import PaymentSummary from '@/components/PaymentSummary';
import ContentLoader from '@/components/skeletons';
import Link from 'next/link';
import { NextPage } from 'next';

type Props = {
  url: string;
  orderId: string;
};

const orderReceipt: NextPage<Props> = ({ url, orderId }) => {
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
              {orderReceiptData.data?.order_items?.map((product, index) => (
                <div className="flex justify-between gap-x-1 w-full">
                  {/* name and addons and qty meter*/}
                  <div>
                    <Link
                      className="flex gap-x-1"
                      href={`${appLinks.productShow(product.ProductID)}`}
                    >
                      <TextTrans
                        className={`capitalize ${alexandriaFontSemiBold}`}
                        ar={product.item_ar}
                        en={product.item_en}
                        length={15}
                      />
                      <p
                        className={`capitalize ${alexandriaFontSemiBold}`}
                        suppressHydrationWarning={suppressText}
                      >
                        x{product.quantity}
                      </p>
                    </Link>

                    {/* addons products */}
                    <div
                      className={`flex gap-1 w-auto flex-wrap w-fit mb-2 py-1`}
                    >
                      {product.addon.map((addon, idx) => (
                        <TextTrans
                          key={addon.addon_id}
                          className={`bg-[#F3F2F2] text-[#544A45] px-1 text-xxs capitalize rounded-lg`}
                          ar={`${addon.addon_name_ar}`}
                          en={`${addon.addon_name_en}`}
                        />
                      ))}
                    </div>

                    {/* notes */}

                    <p
                      suppressHydrationWarning={suppressText}
                      className="text-xs"
                    >
                      {product.extra_notes}
                    </p>
                  </div>

                  {/* price */}
                  <div className="font-bold text-sm">
                    <p
                      className=" uppercase"
                      //   style={{ color }}
                      suppressHydrationWarning={suppressText}
                    >
                      {parseFloat(product.price?.toString()).toFixed(3)}{' '}
                      {t('kwd')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="py-3 border-b-8 border-gray-100 px-4">
              <h2
                className={`py-3 ${alexandriaFontSemiBold}`}
                suppressHydrationWarning={suppressText}
              >
                {t('contact_details')}
              </h2>
              <div className="text-sm space-y-1">
                <p className="font-light">address</p>
                <p suppressHydrationWarning={suppressText}>
                  {orderReceiptData.data?.contact_details.delivery_instruction}
                </p>

                {/* customer details */}
                <div className={`${alexandriaFont} mt-1`}>
                  <p suppressHydrationWarning={suppressText}>
                    {orderReceiptData.data?.contact_details.customer.name}
                  </p>
                  <p suppressHydrationWarning={suppressText}>
                    {orderReceiptData.data?.contact_details.customer.phone}
                  </p>
                </div>
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
                <PaymentSummary data={orderReceiptData.data.payment_summary} />
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
          <ContentLoader type="Receipt" sections={1} />
        )}
      </MainContentLayout>
    </Suspense>
  );
}
export default orderReceipt;
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
