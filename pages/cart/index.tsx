import CustomImage from '@/components/CustomImage';
import MainContentLayout from '@/layouts/MainContentLayout';
import {
  useAddToCartMutation,
  useGetCartProductsQuery,
  useLazyCheckPromoCodeQuery,
} from '@/redux/api/cartApi';
import { wrapper } from '@/redux/store';
import { ProductCart, ServerCart } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import {
  StringIterator,
  filter,
  isEmpty,
  isNull,
  kebabCase,
  lowerCase,
} from 'lodash';
import React, { useEffect, useState } from 'react';
import { alexandriaFontMeduim, appLinks, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import CartProduct from '@/components/widgets/product/CartProduct';
import PromoCode from '@/components/cart/PromoCode';
import PaymentSummary from '@/components/PaymentSummary';
import CheckoutFixedBtn from '@/components/CheckoutFixedBtn';
import SaleNotification from '@/components/cart/SaleNotification';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import ContentLoader from '@/components/skeletons';
import { resetPromo, setPromocode } from '@/redux/slices/cartSlice';
import GuestOrderModal from '@/components/modals/GuestOrderModal';
import { useRouter } from 'next/router';
import EmptyCart from '@/components/cart/EmptyCart';
import { isAuthenticated } from '@/redux/slices/customerSlice';
import { NextPage } from 'next';
import { setAreaBranchModalStatus } from '@/redux/slices/modalsSlice';
import ChangeMoodModal from '@/components/modals/ChangeMoodModal';

type Props = { url: string };

const Cart: NextPage<Props> = ({ url }): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    customer: { userAgent, id },
    searchParams: { method },
    cart: { enable_promocode, promocode },
    customer: { id: customer_id, prefrences },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const destID = useAppSelector(destinationId);
  const color = useAppSelector(themeColor);
  const isAuth = useAppSelector(isAuthenticated);
  const [triggerAddToCart] = useAddToCartMutation();
  const [triggerCheckPromoCode] = useLazyCheckPromoCodeQuery();

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

  // reset promo
  // useEffect(() => {
  //   dispatch(resetPromo())
  // }, []);

  // inc and dec and rmove
  const HandelDecIncRmv = (item: ProductCart, process: string) => {
    if (process === 'inc') {
      handelIncRequest(item);
    } else if (process === 'dec') {
      // if val === 1 then remove the item
      if (item.Quantity === 1) {
        handelRemoveRequest(item);
      } else {
        handelDecRequest(item);
      }
    }
  };

  const handelIncRequest = (item: ProductCart) => {
    triggerAddToCart({
      process_type: method,
      destination: destObj,
      body: {
        UserAgent: userAgent,

        Cart:
          isSuccess && cartItems.data && cartItems.data.Cart
            ? filter(cartItems.data.Cart, (i) => i.id !== item.id).concat({
                ...item,
                Quantity: item.Quantity + 1,
              })
            : cartItems.data.Cart,
      },
      url,
    }).then((r: any) => {
      if (r.data && r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      } else {
        if (r.error && r.error.data && r.error.data.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg)),
              type: `error`,
            })
          );
        }
      }
    });
  };

  const handelDecRequest = (item: ProductCart) => {
    triggerAddToCart({
      process_type: method,
      destination: destObj,
      body: {
        UserAgent: userAgent,
        Cart:
          isSuccess && cartItems.data && cartItems.data.Cart
            ? filter(cartItems.data.Cart, (i) => i.id !== item.id).concat({
                ...item,
                Quantity: item.Quantity - 1,
              })
            : cartItems.data.Cart,
      },
      url,
    }).then((r: any) => {
      if (r.data && r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      } else {
        if (r.error && r.error.data && r.error.data.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg)),
              type: `error`,
            })
          );
        }
      }
    });
  };

  const handelRemoveRequest = (item: ProductCart) => {
    const currentItems = filter(cartItems.data.Cart, (i) => i.id !== item.id);
    triggerAddToCart({
      process_type: method,
      destination: destObj,
      body: {
        UserAgent: userAgent,
        Cart:
          isSuccess &&
          cartItems.data &&
          cartItems.data.Cart &&
          !isEmpty(currentItems)
            ? currentItems
            : [], // empty Cart Case !!!
      },
      url,
    }).then((r: any) => {
      if (r.data && r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      } else {
        if (r.error && r.error.data && r.error.data.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg)),
              type: `error`,
            })
          );
        }
      }
    });
  };

  // apply promo
  const handelApplyPromoCode = (value: string | undefined) => {
    // console.log('promo', value);
    //  don't check if dest is selected cause promo is not showing if cart is empty

    /*
    check if promo val is not empty or undef
    if user is logged in or guest   ===> later
    */

    // remove promo if exists
    if (enable_promocode) {
      dispatch(resetPromo());
    } else if (value) {
      triggerCheckPromoCode({
        userAgent: userAgent,
        PromoCode: value,
        url,
        area_branch: destObj,
      }).then((r: any) => {
        if (r.data && r.data.status && r.data.promoCode) {
          // promoCode Success case
          dispatch(setPromocode(value));

          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.data.msg)),
              type: `success`,
            })
          );
        } else if (r.error && r.error?.data && r.error?.data?.msg) {
          dispatch(resetPromo());
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg)),
              type: `error`,
            })
          );
        }

        refetchCart();
      });
    }
  };

  const handelContinue = () => {
    /*
    = check if area or branch is selected  done 
    = check  if 
     or user 
    = navigate
    */
    //  check if user id is null

    // check with eng ahmed wheter the guest redirect is diffrent from the user redirect\

    if (isNull(customer_id)) {
      router.push(appLinks.login.path);
    } else if (isNull(destID) || prefrences.type === '') {
      // open select modal
      dispatch(setAreaBranchModalStatus(true));
    } else if (method === 'delivery') {
      if (isAuth) {
        router.push(appLinks.createAuthAddress(customer_id));

      // if isauth ask eng usama if user should navigate to alladdressses or to create user address
      // if guest navigate to create guest address

      // if(isAuth){

      // }
      router.push(appLinks.addressCreate(''));
    } else {
      if (method === 'delivery') {
        if (isAuth) {
          router.push(appLinks.createAuthAddress(id));
        } else {
          router.push(appLinks.addressCreate('1')); 
      } 
    } else {
      //  go to checkout
      router.push(appLinks.checkout.path);
    }
  }
}};

  /*
  btn msg when min charge and  sale notification
  min cart disable btn
  */

  return (
    <MainContentLayout showBackBtnHeader={true} currentModule="review_cart">
      {/* if cart is empty */}
      <div className={''}>
        {isSuccess && isEmpty(cartItems?.data?.Cart) ? (
          <EmptyCart />
        ) : isSuccess ? (
          <div>
            {/* delivery fees always come with 0 but in dashboard it is not 0 */}
            <SaleNotification
              delivery_fees={
                enable_promocode
                  ? parseFloat(cartItems?.data?.delivery_fee ?? '')
                  : parseFloat(cartItems?.data?.delivery_fees)
              }
              min_for_free_delivery={parseFloat(
                cartItems?.data?.free_delivery_data ?? ''
              )}
              total={
                enable_promocode
                  ? parseFloat(cartItems?.data?.sub_total?.toString() ?? '')
                  : parseFloat(cartItems?.data?.subTotal?.toString() ?? '')
              }
            />
            <div className="p-5">
              {cartItems?.data?.Cart.map((product) => (
                <CartProduct
                  HandelDecIncRmv={HandelDecIncRmv}
                  product={product}
                />
              ))}

              {/* promocode */}
              <PromoCode
                url={url}
                handelApplyPromoCode={handelApplyPromoCode}
              />

              {/* payment summary */}
              <div className="py-5">
                <p
                  suppressHydrationWarning={suppressText}
                  className={`${alexandriaFontMeduim} mb-1`}
                >
                  {t('order_review')}
                </p>
                <PaymentSummary data={cartItems?.data} />
              </div>
            </div>

            <CheckoutFixedBtn
              cartLessThanMin={
                promocode
                  ? parseFloat(
                      cartItems?.data?.minimum_order_price?.toString() ?? ''
                    ) >
                    parseFloat(
                      cartItems?.data?.total_cart_after_tax?.toString() ?? ''
                    )
                  : parseFloat(
                      cartItems?.data?.minimum_order_price?.toString() ?? ''
                    ) > parseFloat(cartItems?.data?.total?.toString())
              }
              url={url}
              cart={true}
              handelContinueInCart={() => handelContinue()}
            />

            {/* select modal */}
            <ChangeMoodModal url={url} />
          </div>
        ) : (
          <div>
            <ContentLoader type="ProductCart" sections={2} />
            <ContentLoader type="Promocode" sections={1} />
            <ContentLoader type="PaymentSummary" sections={1} />
          </div>
        )}
      </div>
    </MainContentLayout>
  );
}
export default Cart;

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
