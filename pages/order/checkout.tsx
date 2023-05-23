import MainContentLayout from '@/layouts/MainContentLayout';
import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from '@/appIcons/location.jpg';
import Image from 'next/image';
import OrderDetails from '@/components/checkout/OrderDetails';
import { useTranslation } from 'react-i18next';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { ServerCart } from '@/types/index';
import { wrapper } from '@/redux/store';
import CartProduct from '@/components/widgets/product/CartProduct';
import AddIcon from '@/appIcons/add_checkout.svg';
import Link from 'next/link';
import { appLinks, suppressText } from '@/constants/*';
import CashIcon from '@/appIcons/cash_checkout.svg';
import CreditIcon from '@/appIcons/credit_checkout.svg';
import KnetIcon from '@/appIcons/knet.svg';
import { isEmpty, isNull, map } from 'lodash';
import PaymentSummary from '@/components/PaymentSummary';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import ElementMap from '@/components/address/ElementMap';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import { useRouter } from 'next/router';
import { useLazyCreateOrderQuery } from '@/redux/api/orderApi';
import EmptyCart from '@/components/cart/EmptyCart';
// import WhenClosedModal from '@/components/modals/WhenClosedModal';

type Props = {
  url: string;
};

export default function checkout({ url }: Props) {
  const { t } = useTranslation();
  const {
    customer: {
      prefrences,
      userAgent,
      id: customer_id,
      notes,
      address: { id: addressID, longitude, latitude },
    },
    searchParams: { method, destination },
    Cart: { enable_promocode, promocode },
  } = useAppSelector((state) => state);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const destObj = useAppSelector(destinationHeaderObject);
  const destID = useAppSelector(destinationId);
  const color = useAppSelector(themeColor);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'visa' | 'knet' | 'cash_on_delivery' | null
  >(null);
  const [openStoreClosedModal, setOpenClosedStore] = useState(false);
  const [triggerCreateOrder, { isLoading }] = useLazyCreateOrderQuery();

  // payment methoda array to map
  const paymentMethods: {
    id: 'visa' | 'knet' | 'cash_on_delivery';
    src: any;
    name: string;
  }[] = [
    { id: 'cash_on_delivery', src: <CashIcon />, name: 'cash_on_delivery' },
    { id: 'visa', src: <CreditIcon />, name: 'credit_card' },
    { id: 'knet', src: <KnetIcon />, name: 'pay_by_knet' },
  ];

  // seturl
  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  // map marker
  const LocationMarker = ({ icon, longitude, latitude }: any) => {
    console.log('longitude,latitude', longitude, latitude);
    return <Image src={icon} alt="map marker" width={30} height={30} />;
  };

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

  const handleCreateOrder = async () => {
    if (isNull(customer_id)) {
      // show guest modal or sign in page later
    } else if (!addressID && method === `delivery`) {
      router.push(appLinks.addressCreate.path);
    }
    if (isNull(selectedPaymentMethod)) {
      dispatch(
        showToastMessage({
          content: 'please_select_payment_method',
          type: `error`,
        })
      );
    }
    if (
      !isNull(customer_id) &&
      !isNull(selectedPaymentMethod) &&
      selectedPaymentMethod &&
      !isNull(userAgent)
    ) {
      console.log({ method }, prefrences.date, prefrences.time,prefrences.type);
      await triggerCreateOrder({
        params: {
          user_id: customer_id,
          ...(method === `delivery` ? { address_id: addressID } : {}),
          order_type: prefrences.type,
          // order_type: method === `delivery` ? 'delivery_now' : 'pickup_now',
          UserAgent: userAgent,
          Messg: notes,
          PaymentMethod: selectedPaymentMethod,
          PromoCode: promocode,
          Date: prefrences.date,
          Time: prefrences.time,
        },
        area_branch: destObj,
        url,
      }).then((r: any) => {
        if (r.data) {
          if (r.data.status) {
            if (selectedPaymentMethod === 'cash_on_delivery') {
              router.replace(appLinks.orderSuccess(r.data.data.order_id));
              dispatch(
                showToastMessage({
                  content: `order_created_successfully`,
                  type: `success`,
                })
              );
            } else {
              window.open(r.data.Data, '_self');
            }
          } else {
            router.replace(appLinks.orderFailure(r.data.data.order_id));
          }
        } else {
          if (r.error && r.error.data && r.error.data.msg) {
            dispatch(
              showToastMessage({
                content: r.error.data.msg,
                type: `error`,
              })
            );
            if(r?.error?.data?.msg?.includes("CLOSE")) {
              setOpenClosedStore(true);
            }
          }
        }
      });
    }
  };

  if (!isSuccess) {
    <p>loading</p>;
  }

  return (
    <MainContentLayout showBackBtnHeader={true} currentModule="checkout">
      {isSuccess &&
        cartItems?.data &&
        cartItems?.data &&
        cartItems?.data?.Cart &&
        (isEmpty(cartItems?.data?.Cart) ? (
          <EmptyCart />
        ) : (
          <>
            {/* map */}
            {/* <ElementMap lat={59.955413} lng={30.337844} height={'10rem'}/> */}
            <div className={`w-full h-[10rem]`}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
                  language: 'en',
                  region: 'US',
                }}
                defaultCenter={{
                  lat: 59.955413,
                  lng: 30.337844,
                }}
                defaultZoom={11}
              >
                <LocationMarker
                  latitude={
                    method
                      ? method === 'delivery'
                        ? latitude // customer address
                        : destination.lat // branch address
                      : 59.955413
                  }
                  longitude={
                    method
                      ? method === 'delivery'
                        ? longitude // customer address
                        : destination.lang // branch address
                      : 59.955413
                  }
                  icon={MapMarker}
                />
              </GoogleMapReact>
            </div>
            {/* orderDetails */}
            <div className="p-5 border-b-4">
              <OrderDetails />
            </div>
            {/* items */}
            <div className=" p-5 border-b-4">
              <p
                suppressHydrationWarning={suppressText}
                className="font-bold mb-3"
              >
                {t('order_items')}
              </p>
              {cartItems?.data?.Cart?.map((product) => (
                <CartProduct product={product} checkoutProduct={true} />
              ))}

              <Link
                href={appLinks.home.path}
                className="flex items-center gap-x-1 rounded-full border border-[#E30015] text-[#E30015] w-fit text-xs py-1 px-3  mt-3"
              >
                <AddIcon />
                <p suppressHydrationWarning={suppressText}>{t('add_items')}</p>
              </Link>
            </div>

            {/* payment methods */}
            <div className="p-5 border-b-4">
              <p
                suppressHydrationWarning={suppressText}
                className="font-bold mb-3"
              >
                {t('payment_method')}
              </p>
              <div>
                {map(paymentMethods, (m, i) => {
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedPaymentMethod(m.id);
                      }}
                      className="flex items-center gap-x-2 text-sm mb-3"
                    >
                      <input
                        checked={selectedPaymentMethod === m.id}
                        type="radio"
                        name="paymentMethod"
                      />
                      {m.src}
                      <p suppressHydrationWarning={suppressText} className="">
                        {t(m.name)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* summary */}
            <div className="p-3">
              <PaymentSummary data={cartItems.data} />
              <button
                onClick={() => handleCreateOrder()}
                className="w-full rounded-full py-2 my-4 text-white"
                style={{ backgroundColor: color }}
              >
                {t('place_order')}
              </button>
            </div>
          </>
        ))}
      <WhenClosedModal 
        isOpen={openStoreClosedModal} 
        onRequestClose={() => setOpenClosedStore(false)} 
        />
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
