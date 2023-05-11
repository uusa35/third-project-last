import CustomImage from '@/components/CustomImage';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { wrapper } from '@/redux/store';
import { ServerCart } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import { isEmpty } from 'lodash';
import React from 'react';
import EmptyCart from '@/appImages/empty_cart.png';
import { appLinks, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { destinationObject } from '@/redux/slices/searchParamsSlice';
import Link from 'next/link';
import { themeColor } from '@/redux/slices/vendorSlice';
import CartProduct from '@/components/widgets/product/CartProduct';
import PromoCode from '@/components/cart/PromoCode';
import PaymentSummary from '@/components/PaymentSummary';
import CheckoutFixedBtn from '@/components/CheckoutFixedBtn';
import SaleNotification from '@/components/cart/SaleNotification';

type Props = { url: string };

export default function Cart({ url }: Props) {
  const { t } = useTranslation();
  const {
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const destination = useAppSelector(destinationObject);
  const color = useAppSelector(themeColor);

  // get cart
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
  return (
    <MainContentLayout showBackBtnHeader={true} currentModule="review_cart">
      {/* if cart is empty */}
      <div className={''}>
        {isSuccess && isEmpty(cartItems?.data?.Cart) ? (
          <div className="flex flex-col items-center justify-center p-5">
            <CustomImage
              src={EmptyCart.src}
              alt="empty_cart"
              className="w-2/3 h-auto my-5 px-3"
              width={100}
              height={100}
            />
            <div className="capitalize text-center">
              <p
                suppressHydrationWarning={suppressText}
                className="font-bold pb-1"
              >
                {t('your_cart_is_empty')}
              </p>
              <p
                suppressHydrationWarning={suppressText}
                className="text-[#544A45] text-sm mb-5"
              >
                {t('add_some_items_to_your_cart')}
              </p>

              <Link
                href={appLinks.home.path}
                scroll={true}
                className={`w-full text-sm px-4 py-2 text-white rounded-full`}
                style={{ backgroundColor: color }}
              >
                {t('continue_shopping')}
              </Link>
            </div>
          </div>
        ) : (
          isSuccess && (
            <div>
              {/* <SaleNotification /> */}
              <div className="p-5">
                {cartItems?.data?.Cart.map((product) => (
                  <CartProduct product={product} />
                ))}

                {/* promocode */}
                <PromoCode url={url} />

                {/* payment summary */}
                <div className="py-3">
                  <p
                    suppressHydrationWarning={suppressText}
                    className="font-bold"
                  >
                    {t('order_review')}
                  </p>
                  <PaymentSummary />
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <CheckoutFixedBtn />
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
