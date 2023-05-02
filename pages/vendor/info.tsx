import React from 'react';
import { useEffect, Suspense, useState } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { Vendor } from '@/types/index';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import MainHead from '@/components/MainHead';
import Clock from '@/appIcons/clock.svg';
import DeliveryIcon from '@/appIcons/delivery.svg';
import PreOrderAvailabilityIcon from '@/appIcons/availability.svg';
import ChatIcon from '@mui/icons-material/Chat';
import PaymentIcon from '@/appIcons/payment.svg';
import Knet from '@/appImages/knet.svg';
import CashOnDelivery from '@/appImages/cod.svg';
import Visa from '@/appImages/credit_card.svg';
import { useTranslation } from 'react-i18next';
import {
  appLinks,
  convertColor,
  iconColor,
  imageSizes,
  imgUrl,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import {
  setCurrentModule,
  resetShowFooterElement,
  setShowFooterElement,
  setUrl,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomImage from '@/components/CustomImage';
import Feedback from '@/components/Feedback';
import FeedbackIcon from '@/appIcons/feedback.svg';
import Facebook from '@/appIcons/facebook.svg';
import Twitter from '@/appIcons/twitter.svg';
import Instagram from '@/appIcons/instagram.svg';
import { themeColor } from '@/redux/slices/vendorSlice';
import PoweredByQ from '@/components/PoweredByQ';
import Link from 'next/link';
import TextTrans from '@/components/TextTrans';
import { ChevronRightOutlined, ChevronLeftOutlined } from '@mui/icons-material';
import { map } from 'lodash';

type Props = {
  element: Vendor;
  url: string;
};
type DetailsItem = {
  icon: any;
  text: string;
  content: any;
};
const VendorShow: NextPage<Props> = ({ element, url }) => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);
  const [showModal, SetShowModal] = useState(false);

  useEffect(() => {
    dispatch(setCurrentModule(element.name));
  }, [element]);

  useEffect(() => {
    dispatch(setCurrentModule(isRTL ? element.name_ar : element.name_en));
    dispatch(setShowFooterElement(`vendor_show`));
    if (url) {
      dispatch(setUrl(url));
    }
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);

  const handleClosePopup = () => {
    SetShowModal(false);
  };
  const handleOpenPopup = () => {
    SetShowModal(true);
  };

  if (!element) {
    return <div>loading</div>;
  }

  return (
    <Suspense>
      <MainHead
        title={element.name}
        description={element.desc}
        mainImage={`${element.logo}`}
        icon={`${element.logo}`}
      />
      <MainContentLayout url={url}>
        <Link
          scroll={true}
          href={appLinks.home.path}
          className={`flex flex-col flex-1 justify-center items-center px-6 py-3 my-3`}
        >
          <CustomImage
            src={`${imgUrl(element.logo)}`}
            alt={element.name}
            className={`w-16 h-16 object-cover shadow-md rounded-full border border-stone-200 bg-white`}
            width={imageSizes.sm}
            height={imageSizes.sm}
          />
          <TextTrans
            ar={element.name_ar}
            en={element.name_en}
            className="capitalize text-black text-md text-center my-3"
          />
          <TextTrans
            ar={element.desc}
            en={element.desc}
            className="capitalize text-gray-600 text-lg text-center"
            length={600}
          />
        </Link>

        <div className="flex flex-1 flex-col">
          {/* branches */}
          <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6 text-lg">
            <div
              className={`flex flex-row space-x-3 justify-center items-center`}
            >
              <DeliveryIcon
                width={imageSizes.sm}
                height={imageSizes.sm}
                alt={t('delivery_time')}
                className={`w-5 h-5 pt-1 ${iconColor}`}
              />
              <span>{t('branches')}</span>
            </div>
            {isRTL ? <ChevronLeftOutlined /> : <ChevronRightOutlined />}
          </div>
          {/* min_charge */}
          <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
            <div
              className={`flex flex-row space-x-3 justify-center items-center`}
            >
              <Clock
                width={imageSizes.xs}
                height={imageSizes.xs}
                alt={t('min_charge')}
                className={`w-5 h-5 ${iconColor}`}
              />
              <span className={`text-lg`}>{t('min_charge')}</span>
            </div>
            <div className={`text-lg`}>
              {10.0} {t(`kd`)}
            </div>
          </div>
          {/* working hours */}
          <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
            <div
              className={`flex flex-row space-x-3 justify-center items-center`}
            >
              <Clock
                width={imageSizes.xs}
                height={imageSizes.xs}
                alt={t('work_hours')}
                className={`w-5 h-5 ${iconColor}`}
              />
              <span className={`text-lg`}>{t('opening_hours')}</span>
            </div>
            <div className={`text-lg`}>{element.WorkHours}</div>
          </div>
          {/* min_charge */}
          <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
            <div
              className={`flex flex-row space-x-3 justify-center items-center`}
            >
              <Clock
                width={imageSizes.xs}
                height={imageSizes.xs}
                alt={t('min_charge')}
                className={`w-5 h-5 ${iconColor}`}
              />
              <span className={`text-lg`}>{t('min_charge')}</span>
            </div>
            <div className={`text-lg`}>
              {10.0} {t(`kd`)}
            </div>
          </div>
          {/* payment */}
          <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
            <div
              className={`flex flex-row space-x-3 justify-center items-center`}
            >
              <Clock
                width={imageSizes.xs}
                height={imageSizes.xs}
                alt={t('payment_options')}
                className={`w-5 h-5 ${iconColor}`}
              />
              <span className={`text-lg`}>{t('payment_options')}</span>
            </div>
            <div className="flex justify-center items-end">
              {element.Payment_Methods.visa && (
                <div className="">
                  <Visa className={`h-auto w-8`} />
                </div>
              )}
              {element.Payment_Methods.cash_on_delivery && (
                <div className="px-3">
                  <CashOnDelivery className={`h-auto w-8`} />
                </div>
              )}
              {element.Payment_Methods.knet && (
                <div className=" ">
                  <Knet className={`h-auto w-8`} />
                </div>
              )}
            </div>
          </div>
          {/* contactus */}
          <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-b-8 border-stone-100 p-6">
            <div
              className={`flex flex-row space-x-3 justify-center items-center`}
            >
              <Clock
                width={imageSizes.xs}
                height={imageSizes.xs}
                alt={t('contactus')}
                className={`w-5 h-5 ${iconColor}`}
              />
              <span className={`text-lg`}>{t('contactus')}</span>
            </div>
            <div className="flex justify-center items-end">
              {element.facebook && (
                <a href={element.facebook} target={'_blank'}>
                  <Facebook
                    className={`w-8 h-8  ${iconColor} pt-1`}
                    alt={t('facebook')}
                  />
                </a>
              )}
              {element.instagram && (
                <a href={element.instagram} target={'_blank'}>
                  <Instagram
                    className={`w-8 h-8  ${iconColor} pt-1`}
                    alt={t('instagram')}
                  />
                </a>
              )}
              {element.twitter && (
                <a href={element.twitter} target={'_blank'}>
                  <Twitter
                    className={`w-8 h-8  ${iconColor} pt-1`}
                    alt={t('twitter')}
                  />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col p-6">
          <div className="flex flex-1 flex-col justify-center items-center space-y-3 bg-gray-100 p-6 rounded-2xl">
            <span
              className={`text-black h-16 w-16 flex justify-center items-center border rounded-full bg-white`}
            >
              <ChatIcon className={`text-4xl text-gray-800`} />
            </span>

            <p
              suppressHydrationWarning={suppressText}
              className={`text-black py-4`}
            >
              {t('leave_feedback_desc')}
            </p>
            <button
              onClick={handleOpenPopup}
              className={`flex flex-col flex-1 w-1/2 justify-center items-center bg-white text-white rounded-2xl p-3 shadow-xl`}
            >
              <p
                suppressHydrationWarning={suppressText}
                className={`text-black`}
              >
                {t('leave_feedback')}
              </p>
            </button>
          </div>
        </div>
        <Feedback
          isOpen={showModal}
          ariaHideApp={false}
          onRequestClose={handleClosePopup}
        />
      </MainContentLayout>
    </Suspense>
  );
};

export default VendorShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
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
          url,
        },
      };
    }
);
