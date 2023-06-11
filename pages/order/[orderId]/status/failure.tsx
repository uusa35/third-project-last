import MainContentLayout from '@/layouts/MainContentLayout';
import React from 'react';
import FailureIcon from '@/appImages/failed.svg';
import { useTranslation } from 'react-i18next';
import { suppressText } from '@/constants/*';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { ProductCart, ServerCart } from '@/types/index';
import { wrapper } from '@/redux/store';
import PaymentSummary from '@/components/PaymentSummary';
import CartProduct from '@/components/widgets/product/CartProduct';
import CallusIcon from '@/appIcons/call_us_green.svg';
import { NextPage } from 'next';

type Props = { url: string };

 const OrderFailure: NextPage<Props>=({ url }): React.ReactElement =>{
  const { t } = useTranslation();

  const DetailComponent = ({
    title,
    info,
  }: {
    title: string;
    info: string;
  }) => {
    return (
      <div className="flex justify-between items-center py-3 border-b-2 text-sm">
        <p suppressHydrationWarning={suppressText} className="text-[#877D78]">
          {t(title)}
        </p>
        <p suppressHydrationWarning={suppressText} className="">
          {info}
        </p>
      </div>
    );
  };

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
    <MainContentLayout showBackBtnHeader={true} currentModule="order 21367890">
      <div className="px-5">
        <div className="flex justify-center py-5">
          <FailureIcon />
        </div>
        <div className="flex flex-col items-center justify-center text-center mb-7">
          <p
            suppressHydrationWarning={suppressText}
            className="font-bold lg:w-3/4"
          >
            {t('the_payment_process_has_failed')}
          </p>
          <p
            suppressHydrationWarning={suppressText}
            className="text-[#544A45] lg:w-3/4 py-2 text-xs"
          >
            {t('failure_msg')}
          </p>
        </div>

        <DetailComponent title="order_receipt" info="order 32456789" />
        <DetailComponent title="order_id" info="order 32456789" />
        <DetailComponent title="date_time" info="bjhbjhb" />
        <DetailComponent title="order_type" info="bjhbjhb" />
        <DetailComponent title="payment_card" info="bjhbjhb" />
        <DetailComponent title="contact_info" info="bjhbjhb" />
      </div>
      {/* items */}
      <div className=" p-5">
        <p
          suppressHydrationWarning={suppressText}
          className="mb-2 text-[#877D78]"
        >
          {t('order_items')}
        </p>
        {cartItems?.data?.Cart.map((product: ProductCart) => (
          <CartProduct product={product} checkoutProduct={true} />
        ))}
      </div>

      <div className="p-3 pt-0">
        <p
          suppressHydrationWarning={suppressText}
          className="mb-3 text-[#877D78]"
        >
          {t('order_summary')}
        </p>
        <PaymentSummary />
      </div>

      <div>
        <div className="h-28"></div>
        {/* sticky btn */}
        <div className="fixed bottom-0 w-full lg:w-2/4 xl:w-1/3  border-t bg-white text-white  p-5 cursor-pointer">
          {/* checkout btn */}
          <div className="flex items-center gap-x-3 justify-center rounded-full w-full py-2 px-4 bg-[#12B76A]">
            <CallusIcon />
            <p suppressHydrationWarning={suppressText} className="text-white">
              {t('need_help_call_us')}
            </p>
          </div>
        </div>
      </div>
    </MainContentLayout>
  );
}

export default OrderFailure

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
