import MainContentLayout from '@/layouts/MainContentLayout';
import React, { useState } from 'react';
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
import { suppressText } from '@/constants/*';
import CashIcon from '@/appIcons/cash_checkout.svg';
import CreditIcon from '@/appIcons/credit_checkout.svg';
import { map } from 'lodash';
import PaymentSummary from '@/components/PaymentSummary';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import ElementMap from '@/components/address/ElementMap';

type Props = {
  url: string;
};

export default function checkout({ url }: Props) {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const paymentMethods: {
    id: 'visa' | 'knet' | 'cash_on_delivery';
    src: any;
    name: string;
  }[] = [
    { id: 'cash_on_delivery', src: <CashIcon />, name: 'cash_on_delivery' },
    { id: 'visa', src: <CreditIcon />, name: 'credit_card' },
    { id: 'knet', src: <CashIcon />, name: 'pay_by_knet' },
  ];

  const LocationMarker = ({ icon }: any) => (
    <Image src={icon} alt="map marker" width={30} height={30} />
  );

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
    <MainContentLayout showBackBtnHeader={true} currentModule="checkout">
      {isSuccess && cartItems?.data && cartItems?.data && (
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
                lat={59.955413}
                lng={30.337844}
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
            {cartItems?.data?.Cart.map((product) => (
              <CartProduct product={product} checkoutProduct={true} />
            ))}

            <Link
              href={'#'}
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
            <PaymentSummary />
            <button
              className="w-full rounded-full py-2 my-4 text-white"
              style={{ backgroundColor: color }}
            >
              {t('place_order')}
            </button>
          </div>
        </>
      )}
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
