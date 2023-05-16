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
import { filter, isEmpty, kebabCase, lowerCase } from 'lodash';
import React, { useEffect } from 'react';
import EmptyCart from '@/appImages/empty_cart.png';
import { appLinks, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';
import Link from 'next/link';
import { themeColor } from '@/redux/slices/vendorSlice';
import CartProduct from '@/components/widgets/product/CartProduct';
import PromoCode from '@/components/cart/PromoCode';
import PaymentSummary from '@/components/PaymentSummary';
import CheckoutFixedBtn from '@/components/CheckoutFixedBtn';
import SaleNotification from '@/components/cart/SaleNotification';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import ContentLoader from '@/components/skeletons';
import { resetPromo, setPromocode } from '@/redux/slices/cartSlice';

type Props = { url: string };

export default function Cart({ url }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    customer: { userAgent },
    searchParams: { method },
    Cart: { enable_promocode, promocode },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const destID = useAppSelector(destinationId);
  const color = useAppSelector(themeColor);

  const [triggerAddToCart] = useAddToCartMutation();
  const [triggerCheckPromoCode] = useLazyCheckPromoCodeQuery();

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
      UserAgent: userAgent,
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
      area_branch: destID,
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
      area_branch: destID,
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
      area_branch: destID,
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
    console.log('promo', value);
    /*
    check if area or branch exists
    check if promo val is not empty or undef
    if user is logged in or guest   ===> later
    */
    if (!destID) {
      // open pickup deliver model
    } else if (!value) {
      // enter your promocode
      dispatch(
        showToastMessage({
          content: 'enter a promocode',
          type: `info`,
        })
      );
    } else {
      triggerCheckPromoCode({
        userAgent: userAgent,
        PromoCode: value,
        url,
        area_branch: destObj,
      }).then((r: any) => {
        if (r.data && r.data.status && r.data.promoCode) {
          // promoCode Success case
          dispatch(setPromocode(r.data.promoCode));

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

  const handelContinue = () => {};

  /*
  apply promo code ====> api modification
  tempid and area_branch in cart req , remove , inc and dec
  */

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
        ) : isSuccess ? (
          <div>
            {/* <SaleNotification /> */}
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
        ) : (
          <div>
            <ContentLoader type="ProductCart" sections={2} />
            <ContentLoader type="Promocode" sections={1} />
            <ContentLoader type="PaymentSummary" sections={1} />
          </div>
        )}
      </div>
      <CheckoutFixedBtn url={url} />
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
