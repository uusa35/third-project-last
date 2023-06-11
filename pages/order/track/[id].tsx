import ElementMap from '@/components/address/ElementMap';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { OrderTrack, Vendor } from '@/types/index';
import { NextPage } from 'next';
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { CottageOutlined, SendOutlined } from '@mui/icons-material';
import { orderApi, useLazyTrackOrderQuery } from '@/redux/api/orderApi';
import { useEffect, useState } from 'react';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  appLinks,
  googleMapUrl,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import NoAddresses from '@/appImages/no_address.svg';
import Link from 'next/link';
import { filter, isEmpty, isNull, map } from 'lodash';
import TextTrans from '@/components/TextTrans';

type Props = {
  element: Vendor;
  order_code: string;
  url: string;
};

const OrderTrack: NextPage<Props> = ({
  element,
  url,
  order_code,
}): React.ReactElement => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [triggerTrackOrder, { data: order, isSuccess }] =
    useLazyTrackOrderQuery();
  const [currentOrder, setCurrentOrder] = useState<null | OrderTrack>(null);

  useEffect(() => {
    triggerTrackOrder({ order_code, url }).then((r) => {
      if (r.error) {
        dispatch(
          showToastMessage({ type: 'error', content: r.error.data?.msg })
        );
      } else {
        setCurrentOrder(r.data?.data);
      }
    });
  }, []);

  const handleDisplayAddress = (address: {}) => {
    const currentAddress = filter(
      map(
        address,
        (value, key) => key !== `type` && value !== null && `${key} : ${value}`
      ),
      (a) => a
    );
    return currentAddress.toString();
  };

  console.log('current', currentOrder);

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="track_order"
      showHelpBtn={true}
    >
      {isNull(currentOrder) || !isSuccess ? (
        <div className="flex flex-col space-y-4 absolute bottom-0 w-full border-t border-gray-200 p-4">
          <button
            className={`flex flex-row w-full justify-center items-center space-x-3 rounded-3xl bg-red-600 p-3 py-4 text-white capitlaize`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p className="text-md text-center">{t('add_order')}</p>
          </button>
          <button
            className={`flex flex-row w-full justify-center items-center space-x-3 rounded-3xl bg-white p-3 py-4 text-red-600 border border-red-600 capitalize`}
          >
            <p className="text-md text-center">{t('cancel order')}</p>
          </button>
          <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center mx-4">
            <NoAddresses className="w-auto h-auto object-contain " />
            <p className="text-md text-extrabold">{t('no_address')}</p>
            <p className="text-md text-extrabold">{t('no_address_des')}</p>
            <Link
              href={`${appLinks.addressCreate.path}`}
              className={`${mainBtnClass} flex flex-row justify-center items-center`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <p className="w-fit text-md text-center mx-2">
                {t('add_new_address')}
              </p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 w-full flex-col justify-center items-start mt-8">
          <div className="flex flex-1 flex-col w-full border-b-8 border-gray-100 pb-6 px-3">
            <h1 className="text-2xl font-bold">
              {t('order_received_we_have_got_ur_order')}...
            </h1>
            <div className="flex flex-1 flex-row mt-2">
              <p className="text-md text-gray-400 mr-2">
                {t('estimated_time')} :
              </p>{' '}
              <span className="font-bold ms-2">
                {currentOrder?.estimated_time}
              </span>
            </div>
            {/* order id  */}
            <div className="flex flex-1 w-full flex-row justify-between items-center h-1 my-6 gap-2">
              {currentOrder && currentOrder.order_status === 'pending' && (
                <>
                  <div className="w-1/3 bg-red-600 h-1"></div>
                  <div className="w-1/3 bg-gray-200 h-1 "></div>
                  <div className="w-1/3 bg-gray-200 h-1 "></div>
                </>
              )}
              {currentOrder && currentOrder.order_status === 'on_progress' && (
                <>
                  <div className="w-1/3 bg-red-600 h-1"></div>
                  <div className="w-1/3 bg-red-600 h-1 "></div>
                  <div className="w-1/3 bg-gray-200 h-1 "></div>
                </>
              )}
              {currentOrder && currentOrder.order_status === 'complete' && (
                <>
                  <div className="w-1/3 bg-red-600 h-1"></div>
                  <div className="w-1/3 bg-red-600 h-1 "></div>
                  <div className="w-1/3 bg-red-600 h-1 "></div>
                </>
              )}
            </div>
            <div className="flex flex-1 flex-row text-gray-400">
              <p>{t('order_id')} :</p>
              <p>#{currentOrder?.order_code}</p>
            </div>
          </div>
          {/*  Pick up (Branch)  */}
          <div className="flex flex-1 flex-col w-full px-3 border-b-8 border-gray-100 py-6">
            <div className="capitlize text-xl mb-4 font-bold">
              {t('pickup_from')}
            </div>
            <div className="flex w-full flex-row justify-between items-center ">
              <div className={`p-2 bg-gray-100 rounded-full`}>
                <MapPinIcon className="h-6 w-6 text-black" />
              </div>
              <div className="flex flex-1 w-full flex-col mx-3">
                <p className="flex flex-1 text-gray-400">
                  {t('branch_address')}
                </p>
                {/* <p>{handleDisplayAddress(currentOrder.address)}</p> */}
              </div>
              {currentOrder &&
                currentOrder.latitude &&
                currentOrder.longitude && (
                  <div className="flex ">
                    <a
                      target="blank"
                      href={googleMapUrl(
                        currentOrder.latitude,
                        currentOrder.longitude
                      )}
                      className="btn bg-gray-100 p-3 flex justify-center items-center rounded-full text-xs"
                    >
                      <div>{t('get_direction')}</div>
                      <div>
                        <SendOutlined
                          className={`h-3 w-3 text-black ms-2 ${
                            isRTL ? `rotate-180` : null
                          }`}
                        />
                      </div>
                    </a>
                  </div>
                )}
            </div>
          </div>
          {/*  Delivery (Address)  */}
          {currentOrder && currentOrder?.address && (
            <div className="flex flex-1 flex-col w-full px-3 border-b-8 border-gray-100 py-6">
              <div className="capitlize text-xl mb-4 font-bold">
                {t('delivery_location')}
              </div>
              <div className="flex w-full flex-row justify-between items-center ">
                <div className={`p-2 bg-gray-100 rounded-full`}>
                  <BuildingOfficeIcon className="h-6 w-6 text-black" />
                </div>
                <div className="flex flex-1 w-full flex-col mx-3">
                  <p className="flex flex-1 text-black">
                    {t(currentOrder?.address.type)}
                  </p>
                  <p>{handleDisplayAddress(currentOrder.address)}</p>
                </div>
                {currentOrder.latitude && currentOrder.longitude && (
                  <div className="flex ">
                    <a
                      target="blank"
                      href={googleMapUrl(
                        currentOrder.latitude,
                        currentOrder.longitude
                      )}
                      className="btn bg-gray-100 p-3 flex justify-center items-center rounded-full text-xs"
                    >
                      <div>{t('get_direction')}</div>
                      <div>
                        <SendOutlined
                          className={`h-3 w-3 text-black ms-2 ${
                            isRTL ? `rotate-180` : null
                          }`}
                        />
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* your order */}
          <div className="flex flex-1 flex-col w-full px-3 border-b-8 border-gray-100 pb-6">
            <div className="capitlize text-xl my-4 font-bold">
              {t('ur_order')}
            </div>
            {/*  item */}
            {currentOrder &&
              currentOrder.products &&
              map(currentOrder.products, (p) => (
                <div className="flex w-full flex-row justify-between items-start">
                  <div className="flex flex-col  space-y-2">
                    <div className="text-lg font-bold">
                      <TextTrans
                        ar={`${p.item_ar} x${p.quantity}`}
                        en={`${p.item_en} x${p.quantity}`}
                      />
                    </div>
                    {!isEmpty(p.addon) &&
                      map(p.addon, (a) => (
                        <TextTrans
                          className={`text-gray-400`}
                          ar={`${a.name_ar} x${a.quantity}`}
                          en={`${a.name_en} x${a.quantity}`}
                        />
                      ))}
                  </div>
                  <div>
                    {p.price} {t('kd')}
                  </div>
                </div>
              ))}
          </div>
          {/* Payment details */}
          <div className="flex flex-1 flex-col w-full px-3 pb-6">
            <div className="capitlize text-xl my-4 font-bold">
              {t('payment_details')}
            </div>
            {/*  item */}
            <div className="flex w-full flex-row justify-between items-start">
              <div className="flex flex-col  w-full space-y-2">
                <div className="flex flex-row justify-start items-center space-x-4">
                  <BanknotesIcon className="h-6 w-6 me-2" />
                  <div className="text-lg font-bold">
                    {t('cash_on_delivery')}
                  </div>
                </div>
                {/* subtotal */}
                <div className="flex flex-row justify-between items-center">
                  <div className="">{t('sub_total')}</div>
                  <div className="">
                    {currentOrder?.subtotal} {t('kd')}
                  </div>
                </div>

                {/* delivery_fees */}
                <div className="flex flex-row justify-between items-center">
                  <div className="">{t('delivery_fees')}</div>
                  <div className="">
                    {currentOrder?.delivery_fees} {t('kd')}
                  </div>
                </div>
                {/* total */}
                <div className="flex flex-row justify-between items-center">
                  <div className="text-lg font-bold">{t('total')}</div>
                  <div className="text-lg font-bold">
                    {currentOrder?.total} {t('kd')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainContentLayout>
  );
};

export default OrderTrack;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale, query }) => {
      const url = req.headers.host;
      if (!query.id) {
        return {
          notFound: true,
        };
      }
      const { data: element, isError } = await store.dispatch(
        vendorApi.endpoints.getVendor.initiate({ lang: locale, url })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.Data || !url) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          order_code: query.id,
          url,
        },
      };
    }
);
