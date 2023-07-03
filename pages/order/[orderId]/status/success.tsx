import MainContentLayout from '@/layouts/MainContentLayout';
import React, { useEffect, useState } from 'react';
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
import CreditIcon from '@/appIcons/credit_checkout.svg';
import KnetIcon from '@/appIcons/knet.svg';
import InfoIcon from '@/appIcons/info_scheduled_order.svg';
import { orderApi, useLazyCheckOrderStatusQuery } from '@/redux/api/orderApi';
import { Order } from '@/types/index';
import { apiSlice } from '@/redux/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';
import { isUndefined, map } from 'lodash';
import NeedHelpIcon from '@/appIcons/need_help.svg';
import CancelIcon from '@/appIcons/cancel_order.svg';
import HelpModal from '@/components/modals/HelpModal';
import GuestOrderStatus from '@/components/order/GuestOrderStatus';
import TextTrans from '@/components/TextTrans';
import { setUrl } from '@/redux/slices/appSettingSlice';
import OrderSuccessSkeleton from '@/components/skeletons/OrderSuccessSkeleton';
import ContentLoader from '@/components/skeletons';
import { NextPage } from 'next';
import { isAuthenticated } from '@/redux/slices/customerSlice';

type Props = {
  url: string;
  orderId: string;
};

const OrderSuccess: NextPage<Props> = ({
  url,
  orderId,
}): React.ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isAuth = useAppSelector(isAuthenticated);
  const DestinationId = useAppSelector(destinationId);
  const desObject = useAppSelector(destinationHeaderObject);
  const dispatch = useAppDispatch();
  const {
    customer: { userAgent },
    cart: { promocode },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const [triggerGetOrderStatus, { data: order, isLoading }] =
    useLazyCheckOrderStatusQuery<{
      data: AppQueryResult<Order>;
      isLoading: boolean;
    }>();

  useEffect(() => {
    triggerGetOrderStatus(
      {
        status: 'success',
        order_id: orderId,
        url,
        area_branch: destObj,
        userAgent,
      },
      false
    );
  }, [orderId]);
  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  const {
    data: cartItems,
    isSuccess,
    refetch: refetchCart,
  } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    isLoading: boolean;
    refetch: () => void;
  }>(
    {
      userAgent,
      area_branch: destObj,
      PromoCode: promocode,
      url,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    refetchCart();
  }, []);
  console.log({ isAuth });

  return (
    <>
      {!isUndefined(order?.data) ? (
        <MainContentLayout
          showBackBtnHeader={true}
          currentModule={`${t('order')} #${order.data.order_id}`}
        >
          {/* {order.orderType === 'pickup_later' || order.orderType === 'delivery_later' ? (
          <div className="px-5">
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
        </div>
        ): ( */}
          <div className="px-5">
            <div className="flex justify-center py-5">
              <Success />
            </div>
            <div className="flex flex-col items-center justify-center text-center mb-7">
              <p
                suppressHydrationWarning={suppressText}
                className="font-semibold"
              >
                {t('your_order_has_been_scheduled_successfully')}
              </p>
              <p
                suppressHydrationWarning={suppressText}
                className="text-[#544A45] lg:w-3/4 text-sm py-1"
              >
                {t('estimated_time')}{' '}
                <span className="text-[#1A1615] font-bold">
                  :{order.data.estimated_time?.from}{' '}
                  {order.data.estimated_time?.to &&
                    `- ${order.data.estimated_time?.to}`}
                </span>
              </p>
              <p
                suppressHydrationWarning={suppressText}
                className="text-[#544A45] lg:w-3/4 text-sm"
              >
                {t('order_id')}{' '}
                <span className="text-[#1A1615] font-bold">
                  : # {order.data.order_id}
                </span>
              </p>
            </div>
          </div>
          {/* )} */}

          {/* orderDetails */}
          <div className="p-5 border-b-4">
            <GuestOrderStatus order={order.data} />
          </div>

          {/* payment method */}
          <div className="p-5 border-b-4">
            <p
              suppressHydrationWarning={suppressText}
              className="font-bold mb-3"
            >
              {t('payment_method')}
            </p>
            {order.data.payment_method === 'C.O.D' && (
              <div className="flex items-center gap-x-2 text-sm">
                <CashIcon />
                <p suppressHydrationWarning={suppressText}>
                  {t('cash_on_delivery')}
                </p>
              </div>
            )}
            {order.data.payment_method === 'knet' && (
              <div className="flex items-center gap-x-2 text-sm">
                <KnetIcon />
                <p suppressHydrationWarning={suppressText}>
                  {order.data.payment_method}
                </p>
              </div>
            )}
            {order.data.payment_method === 'visa' && (
              <div className="flex items-center gap-x-2 text-sm">
                <CreditIcon />
                <p suppressHydrationWarning={suppressText}>
                  {order.data.payment_method}
                </p>
              </div>
            )}
          </div>

          {/* items */}
          <div className="p-5 border-b-4">
            <p
              suppressHydrationWarning={suppressText}
              className="font-bold pb-5"
            >
              {t('order_items')}
            </p>
            {map(order.data.items, (item, index) => (
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
            ))}
          </div>
          <div className="p-5">
            <button
              className="flex items-center pb-5"
              onClick={() => setIsOpen(true)}
            >
              <NeedHelpIcon />
              <span className="ps-3 pe-2 capitalize">{t('need_help?')}</span>
              <span>{t('contact_us')}</span>
            </button>
          </div>
          <HelpModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} />
        </MainContentLayout>
      ) : (
        <ContentLoader type="OrderSuccess" sections={1} />
      )}
    </>
  );
};
export default OrderSuccess;

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
      return {
        props: {
          url: req.headers.host,
          orderId,
        },
      };
    }
);
