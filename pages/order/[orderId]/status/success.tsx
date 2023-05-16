import MainContentLayout from '@/layouts/MainContentLayout';
import React, { useState } from 'react';
import SuccessScheduled from '@/appImages/Scheduled_Successfully.svg';
import Success from '@/appImages/order_success.svg';
import { useTranslation } from 'react-i18next';
import { suppressText } from '@/constants/*';
import OrderDetails from '@/components/checkout/OrderDetails';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { ServerCart } from '@/types/index';
import { wrapper } from '@/redux/store';
import CartProduct from '@/components/widgets/product/CartProduct';
import Link from 'next/link';
import PaymentSummary from '@/components/PaymentSummary';
import CashIcon from '@/appIcons/cash_checkout.svg';
import InfoIcon from '@/appIcons/info_scheduled_order.svg';
import { orderApi } from '@/redux/api/orderApi';
import { Order } from '@/types/index';
import { apiSlice } from '@/redux/api';
import { useAppSelector } from '@/redux/hooks';
import { destinationId, destinationObject } from '@/redux/slices/searchParamsSlice';
import { map } from 'lodash';
import NeedHelpIcon from '@/appIcons/need_help.svg';
import CancelIcon from '@/appIcons/cancel_order.svg';
import HelpModal from '@/components/modals/HelpModal';
import GuestOrderStatus from '@/components/order/GuestOrderStatus';

type Props = {
    element: Order;
    url: string;
};

export default function OrderSuccess({ element, url }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const DestinationId = useAppSelector(destinationId);
  const desObject = useAppSelector(destinationObject);
  console.log({ DestinationId, desObject  })
  const {
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const {
    data: cartItems,
    isSuccess,
    refetch: refetchCart,
  } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    isLoading: boolean;
    refetch: () => void;
  }>({
    UserAgent: userAgent,
    area_branch: desObject,
    url,
  });

  if (!isSuccess) {
    <p>loading</p>;
  }
  return (
    <MainContentLayout showBackBtnHeader={true} currentModule={`${t('order')} #${element.order_id}`}>
      {/* image and text */}
      {/* if guest */}
        <div className="px-5">
          <div className="flex justify-center py-5">
            <Success />
          </div>
          <div className="flex flex-col items-center justify-center text-center mb-7">
            <p
              suppressHydrationWarning={suppressText}
              className="font-bold lg:w-3/4"
            >
              {t('your_order_is_successfully_done')}
            </p>
            <p
              suppressHydrationWarning={suppressText}
              className="text-[#544A45] lg:w-3/4 py-2 text-xs"
            >
              {t('success_msg')}
            </p>

            <p
              suppressHydrationWarning={suppressText}
              className="text-[#544A45] lg:w-3/4 text-xs py-1"
            >
              {t('estimated_time')}{' '}
              <span className="text-[#1A1615] font-bold">
                :{element.estimated_time?.from} {element.estimated_time?.to && `- ${element.estimated_time?.to}`}
              </span>
            </p>

            <p
              suppressHydrationWarning={suppressText}
              className="text-[#544A45] lg:w-3/4 text-xs"
            >
              {t('order_id')} <span className="text-[#1A1615] font-bold">: # {element.order_id}</span>
            </p>
          </div>
        </div>
        {/* if user */}
        {/* <div className="px-5">
          <div className="flex justify-center py-5">
            <SuccessScheduled />
          </div>
          <div className="flex justify-center text-center mb-7">
            <p
              suppressHydrationWarning={suppressText}
              className="font-bold lg:w-3/4"
            >
              {t('your_order_has_been_scheduled_successfully')}
            </p>
          </div>
        </div> */}

      {/* orderDetails */}
      <div className="p-5 border-b-4">
        <GuestOrderStatus order={element} />
      </div>

      {/* payment method */}
      <div className="p-5 border-b-4">
        <p suppressHydrationWarning={suppressText} className="font-bold mb-3">
          {t('payment_method')}
        </p>
        {element.payment_method === 'C.O.D' && <div className="flex items-center gap-x-2 text-sm">
          <CashIcon />
          <p suppressHydrationWarning={suppressText}>
            {t('cash_on_delivery')}
          </p>
        </div>}
        <div className="flex gap-x-2 bg-[#F5F5F5] p-2 mt-3">
          <div className="pt-1">
            <InfoIcon />
          </div>

          {/* if card type !== cod */}
          <p
            suppressHydrationWarning={suppressText}
            className="text-xs break-all"
          >
            {t(
              'your_card_will_not_be_charged_until_your_order_is_placed_minutes_before_scheduled_order_time'
            )}
          </p>
        </div>
      </div>

      {/* items */}
      <div className="p-5 border-b-4">
        <p suppressHydrationWarning={suppressText} className="font-bold mb-3">
          {t('order_items')}
        </p>
        {map(element.items, (item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <div className="flex pb-2">
                <h5 className="pe-2">{item.item}</h5>
                <span>x{item.quantity}</span>
              </div>
              <div className="flex flex-wrap items-center">
              {map(item.addon, (a) => (
                <div key={a.addon_id} className="pe-3 pb-4">
                  <div
                    className="bg-gray-100 text-gray-500 rounded-2xl text-center h-8 px-3">
                    <span className="pe-2">x{a.addon_quantity}</span>
                    <span>{a.addon_name}</span>
                  </div>
                </div>
              ))}
              </div>
              <p>{item.extra_notes}</p>
            </div>
            <p>{item.price}</p>
          </div>
        ))}
      </div>
      <div className="p-5">
        <button className="flex items-center pb-5" onClick={() => setIsOpen(true)}>
          <NeedHelpIcon />
          <span className="ps-3 pe-2 capitalize">{t('need_help?')}</span>
          <span>{t('contact_us')}</span>
        </button>
        <button className="flex items-center text-red-600 pb-5">
          <CancelIcon />
          <span className="ps-3 capitalize">{t('cancel_order')}</span>
        </button>
      </div>
      <HelpModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      />
    </MainContentLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
      async ({ req, query }) => {
        const { orderId }: any = query;
        const url = req.headers.host;
        if (!url || !orderId) {
          return {
            notFound: true,
          };
        }
        const {
          data: element,
          isError,
        }: { data: AppQueryResult<Order>; isError: boolean } =
          await store.dispatch(
            orderApi.endpoints.checkOrderStatus.initiate({
              status: 'success',
              order_id: orderId ? orderId : 3,
              url,
            })
          );
        await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
        if (isError || !element.status || !element.data) {
          return {
            notFound: true,
          };
        }
        return {
          props: {
            element: element.data,
            url,
          },
        };
      }
  );
