import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appLinks, suppressText } from '../constants';
import ScheduelStatusIcon from '@/appIcons/status_home_scheduel.svg';
import PrepareStatusIcon from '@/appIcons/status_home_prepare.svg';
import DeliveryStatusIcon from '@/appIcons/status_home_delivery.svg';
import ArrowUpStatusIcon from '@/appIcons/status_home_up_arrow.svg';
import {
  useGetCartProductsQuery,
} from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { ServerCart } from '../types';
import { useRouter } from 'next/router';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';

type Props = {
  url: string;
  cart?: boolean;
  handelContinueInCart?: () => void;
};

export default function CheckoutFixedBtn({
  url,
  cart = false,
  handelContinueInCart = () => {},
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    customer: { userAgent },
    searchParams: { method },
    Cart: { enable_promocode, promocode },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const destID = useAppSelector(destinationId);
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

  return (
    <div>
      <div className="h-48"></div>
      {/* sticky fooer */}
      <div className="fixed bottom-0 w-full lg:w-2/4 xl:w-1/3  border-t bg-white text-white  p-5">
        {/* checkout btn */}
        {isSuccess &&
          cartItems &&
          cartItems.data &&
          cartItems?.data?.Cart &&
          cartItems?.data?.Cart.length > 0 && (
            <div
              onClick={() => {
                if (cart) {
                  handelContinueInCart();
                } else {
                  router.push(appLinks.cart.path);
                }
              }}
              className="flex items-center gap-x-2 justify-between rounded-full w-full py-2 px-4 cursor-pointer"
              style={{ backgroundColor: color }}
            >
              <div className="flex items-center gap-x-3">
                <p
                  suppressHydrationWarning={suppressText}
                  className="flex items-center justify-center rounded-full w-8 h-8 bg-red-800"
                >
                  {cartItems?.data?.Cart.length}
                </p>
                <p suppressHydrationWarning={suppressText}>
                  {cart ? t('go_to_checkout') : t('review_order')}
                </p>
              </div>

              <p suppressHydrationWarning={suppressText}>
                {cartItems?.data?.total} {t('kwd')}
              </p>
            </div>
          )}

        {/* order status  btn*/}
        {!cart && (
          <div
            className="flex items-center gap-x-2 justify-between rounded-full text-white w-full py-2 px-4 my-3"
            style={{ backgroundColor: color }}
          >
            <div className="flex items-center gap-x-2">
              <div>
                <DeliveryStatusIcon />
              </div>
              <div>
                <p suppressHydrationWarning={suppressText} className="">
                  Order Ready For Deliver
                </p>
                <p suppressHydrationWarning={suppressText} className="text-xs">
                  Estimated Time 2:00-2:30 PM
                </p>
              </div>
            </div>
            <div>
              <ArrowUpStatusIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
