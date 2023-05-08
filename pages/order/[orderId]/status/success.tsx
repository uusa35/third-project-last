import MainContentLayout from '@/layouts/MainContentLayout';
import React from 'react';
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

type Props = { url: string };

export default function OrderSuccess({ url }: Props) {
  const { t } = useTranslation();
  const orderType = 'later';

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
    UserAgent:
      'd972045e-e95b-40c6-be47-238997fef4e9-gmbLgjJ0l6qb4HNf9nGxHkWme7WfsHxF-b600ecbf098431ae282945af21228d14',
    area_branch: { 'x-area-id': 26 },
    url,
  });

  if (!isSuccess) {
    <p>loading</p>;
  }
  return (
    <MainContentLayout showBackBtnHeader={true} currentModule="scheduled_order">
      {/* image and text */}
      {orderType === 'later' ? (
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
              <span className="text-[#1A1615] font-bold">: 2:00-2:30 PM</span>
            </p>

            <p
              suppressHydrationWarning={suppressText}
              className="text-[#544A45] lg:w-3/4 text-xs"
            >
              {t('order_id')} <span className="text-[#1A1615] font-bold">: #123456789</span>
            </p>
          </div>
        </div>
      ) : (
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
      )}

      {/* orderDetails */}
      <div className="p-5 border-b-4">
        <OrderDetails OrderStatus={true} />
      </div>

      {/* payment method */}
      <div className="p-5 border-b-4">
        <p suppressHydrationWarning={suppressText} className="font-bold mb-3">
          {t('payment_method')}
        </p>
        <div className="flex items-center gap-x-2 text-sm">
          <CashIcon />
          <p suppressHydrationWarning={suppressText}> cash on delivery</p>
        </div>
        <div className="flex gap-x-2 bg-[#F5F5F5] p-2 mt-3">
          <div className="pt-1">
            <InfoIcon />
          </div>

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
      <div className=" p-5 border-b-4">
        <p suppressHydrationWarning={suppressText} className="font-bold mb-3">
          {t('order_items')}
        </p>
        {cartItems?.data?.Cart.map((product) => (
          <CartProduct product={product} checkoutProduct={true} />
        ))}
      </div>

      <div className="p-3">
        <p suppressHydrationWarning={suppressText} className="font-bold mb-3">
          {t('order_summary')}
        </p>
        <PaymentSummary />
      </div>
    </MainContentLayout>
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
