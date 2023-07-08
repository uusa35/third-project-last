import CustomImage from '@/components/CustomImage';
import MainContentLayout from '@/layouts/MainContentLayout';
import {
  useAddToCartMutation,
  useGetCartProductsQuery,
  useLazyCheckPromoCodeQuery,
} from '@/redux/api/cartApi';
import { wrapper } from '@/redux/store';
import { ProductCart, ServerCart, UserAddressFields } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import {
  StringIterator,
  filter,
  isEmpty,
  isNull,
  isUndefined,
  kebabCase,
  lowerCase,
  map,
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
import { useLazyGetAddressesQuery } from '@/redux/api/addressApi';

type Props = { url: string };

const Cart: NextPage<Props> = ({ url }): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    searchParams: { method, destination },
    cart: { enable_promocode, promocode },
    customer: {
      id: customer_id,
      prefrences,
      userAgent,
      address,
      token: { api_token },
    },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const destID = useAppSelector(destinationId);
  const color = useAppSelector(themeColor);
  const isAuth = useAppSelector(isAuthenticated);
  const [triggerAddToCart] = useAddToCartMutation();
  const [
    triggerGetAddresses,
    { data: addresses, isSuccess: addressesSuccess },
  ] = useLazyGetAddressesQuery<{
    data: AppQueryResult<UserAddressFields[]>;
    isSuccess: boolean;
  }>();
  const [triggerCheckPromoCode] = useLazyCheckPromoCodeQuery();
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
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

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
        dispatch(resetPromo());
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
        dispatch(resetPromo());
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
        if (enable_promocode) {
          dispatch(resetPromo());
        }
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
        // console.log({ r });
        if (r.error && r.error?.msg) {
          dispatch(resetPromo());
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.msg)),
              type: `error`,
            })
          );
        } else if (r.data && r.data.status && r.data.promoCode) {
          // promoCode Success case
          dispatch(setPromocode(value));
          refetchCart();
          dispatch(
            showToastMessage({
              content: r.data.msg,
              type: `success`,
            })
          );
        }
      });
    }
  };

  const handelContinue = async () => {
    if (isNull(customer_id) && !isAuth) {
      router.push(appLinks.login.path);
    } else if (isNull(destID) || prefrences.type === '') {
      // open select modal
      dispatch(setAreaBranchModalStatus(true));
    } else if (method === 'delivery' && !isAuth && !address.id) {
      // should check on address of user too but nothing in state so check in checkout
      // router.push(appLinks.guestAddress.path);
      // guest mode here ----> Esra should continue this scenario
      console.log('guest');
      // router.push(appLinks.selectArea('guest'));
    } else {
      if (method === 'delivery') {
        if (isAuth) {
          // go here (selecting address if exist)
          await triggerGetAddresses({ url, api_token }, false).then(
            (r: any) => {
              if (r.data && r.data.data && r.data.data.length >= 1) {
                const areaIds = map(r.data.data, 'address.area_id');
                const sameAreaId = filter(
                  areaIds,
                  (t) => t == destination.id.toString()
                );
                if (!isEmpty(sameAreaId)) {
                  // same area id
                } else if (!isEmpty(areaIds)) {
                  // has addresses but not same destnation
                  console.log('has address');
                } else {
                  // does not have any address
                  console.log('no address');
                }
              } else {
                // auth user has no address.
              }
            }
          );
        } else {
          console.log('else 1');
          // router.push(appLinks.selectArea('guest'));
        }
      } else {
        console.log('else 3');
        // router.push(appLinks.checkout.path);
      }
    }
  };

  return (
    <MainContentLayout showBackBtnHeader={true} currentModule="review_cart">
      {/* if cart is empty */}
      {isSuccess && isEmpty(cartItems?.data?.Cart) ? (
        <EmptyCart />
      ) : isSuccess ? (
        <div>
          {/* delivery fees always come with 0 but in dashboard it is not 0 */}
          <SaleNotification
            delivery_fees={
              cartItems?.data?.delivery_fee
                ? parseFloat(cartItems?.data?.delivery_fee)
                : parseFloat(cartItems?.data?.delivery_fees)
            }
            min_for_free_delivery={parseFloat(
              cartItems?.data?.free_delivery_data ?? ''
            )}
            total={
              cartItems?.data?.sub_total
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
            <PromoCode url={url} handelApplyPromoCode={handelApplyPromoCode} />

            {/* payment summary */}
            <div className="py-5">
              <p
                suppressHydrationWarning={suppressText}
                className={`${alexandriaFontMeduim} mb-1`}
              >
                {t('order_review')}
              </p>
              <PaymentSummary
                sub_total={
                  cartItems?.data?.subTotal || cartItems?.data?.sub_total || 0
                }
                total={cartItems?.data?.total || 0}
                total_cart_after_tax={
                  cartItems?.data?.total_cart_after_tax || 0
                }
                promo_code_discount={cartItems?.data?.promo_code_discount || 0}
                delivery_fees={
                  cartItems?.data?.delivery_fees ||
                  cartItems?.data?.delivery_fee ||
                  0
                }
                free_delivery={cartItems?.data?.free_delivery || false}
                tax={cartItems?.data?.tax || 0}
              />
            </div>
          </div>

          <CheckoutFixedBtn
            cartLessThanMin={
              cartItems?.data?.sub_total
                ? parseFloat(
                    cartItems?.data?.minimum_order_price?.toString() || ''
                  ) > parseFloat(cartItems?.data?.sub_total?.toString() || '')
                : parseFloat(
                    cartItems?.data?.minimum_order_price?.toString() || ''
                  ) > parseFloat(cartItems?.data?.subTotal?.toString())
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
    </MainContentLayout>
  );
};
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
