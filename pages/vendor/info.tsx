import React from 'react';
import { useEffect, Suspense, useState } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { Vendor } from '@/types/index';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import MainHead from '@/components/MainHead';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Knet from '@/appIcons/knet.svg';
import CashOnDelivery from '@/appIcons/cash_checkout.svg';
import Visa from '@/appIcons/credit_checkout.svg';
import { useTranslation } from 'react-i18next';
import OurBranchesIcon from '@/appIcons/our_branches.svg';
import MinChargeIcon from '@/appIcons/min_charge.svg';
import PayemtOptionsIcon from '@/appIcons/payment_options.svg';
import ContactUsIcon from '@/appIcons/info_contactus.svg';
import FeedbackIcon from '@/appIcons/feedback.svg';
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
import Facebook from '@/appIcons/messenger.svg';
import Twitter from '@/appIcons/twitter.png';
import Instagram from '@/appIcons/instgram.svg';
import { themeColor } from '@/redux/slices/vendorSlice';
import PoweredByQ from '@/components/PoweredByQ';
import Link from 'next/link';
import TextTrans from '@/components/TextTrans';
import { ChevronRightOutlined, ChevronLeftOutlined } from '@mui/icons-material';
import { isUndefined, map, upperFirst } from 'lodash';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import ContentLoader from '@/components/skeletons';
import FeedbackModal from '@/components/modals/FeedbackModal';

type Props = {
  url: string;
  element: Vendor
};
type DetailsItem = {
  icon: any;
  text: string;
  content: any;
};
const VendorShow: NextPage<Props> = ({ url, element }) => {
  const {
    locale: { isRTL, lang },
    vendor
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);
  const [showModal, SetShowModal] = useState(false);
  const desObject = useAppSelector(destinationHeaderObject);
   
    useEffect(() => {
      if (url) {
        dispatch(setUrl(url));
      }
    }, []);
  

  const handleClosePopup = () => {
    SetShowModal(false);
  };
  const handleOpenPopup = () => {
    SetShowModal(true);
  };
  return (
    <Suspense>
      <MainHead
        title={element.name}
        description={element.desc}
        mainImage={`${element.logo}`}
        icon={`${element.logo}`}
        phone={element.phone}
        twitter={element.twitter}
        facebook={element.facebook}
        instagram={element.instagram}
      />
      <MainContentLayout url={url} showBackBtnHeader currentModule="info">
        {vendor ? <>
          <Link
            scroll={true}
            href={appLinks.home.path}
            className={`flex flex-col flex-1 justify-center items-center px-6 py-3 my-3`}
          >
            <CustomImage
              src={`${vendor?.logo}`}
              alt={vendor?.name}
              className={`w-16 h-16 object-cover shadow-md rounded-full border border-stone-200 bg-white`}
              width={imageSizes.sm}
              height={imageSizes.sm}
            />
            <TextTrans
              ar={vendor?.name_ar}
              en={vendor?.name_en}
              className="capitalize text-black text-md text-center my-3"
            />
            <TextTrans
              ar={vendor?.desc}
              en={vendor?.desc}
              className="text-sm text-center"
              length={600}
            />
          </Link>

          <div className="flex flex-1 flex-col">
            {/* branches */}
            <Link href={`${appLinks.selectBranch.path}`} className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6 text-lg">
              <div
                className={`flex flex-row space-x-3 justify-center items-center`}
              >
                <OurBranchesIcon />
                <span className="text-lg px-2">{t('our_branches')}</span>
              </div>
              {isRTL ? <ChevronLeftOutlined /> : <ChevronRightOutlined />}
            </Link>
            {/* min_charge */}
            <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
              <div
                className={`flex flex-row space-x-3 justify-center items-center`}
              >
                <MinChargeIcon />
                <span className="text-lg px-2">{t('min_order_with_delivery')}</span>
              </div>
              <div className={`text-lg`}>
                {vendor?.delivery?.minimum_order_price} {t(`kwd`)}
              </div>
            </div>
            {/* working hours */}
            <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
              <div
                className={`flex flex-row space-x-3 justify-center items-center`}
              >
                <AccessTimeIcon />
                <span className="text-lg px-2">{t('opening_hours')}</span>
              </div>
              <div className={`text-lg`}>{vendor?.WorkHours}</div>
            </div>
            {/* payment */}
            <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
              <div
                className={`flex flex-row space-x-3 justify-center items-center`}
              >
                <PayemtOptionsIcon />
                <span className="text-lg px-2">{t('payment_options')}</span>
              </div>
              <div className="flex justify-center">
                {vendor?.Payment_Methods.visa && (
                  <div className="">
                    <Visa className={`h-auto w-8`} />
                  </div>
                )}
                {vendor?.Payment_Methods.cash_on_delivery && (
                  <div className="px-3">
                    <CashOnDelivery className={`h-auto w-8`} />
                  </div>
                )}
                {vendor?.Payment_Methods.knet && (
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
                <ContactUsIcon />
                <span className="text-lg px-2">{t('contact_us')}</span>
              </div>
              <div className="flex justify-center items-end">
                {vendor?.facebook && (
                  <a href={vendor?.facebook} target={'_blank'} className="px-2">
                    <Facebook />
                  </a>
                )}
                {vendor?.instagram && (
                  <a href={vendor?.instagram} target={'_blank'} className="px-2">
                    <Instagram />
                  </a>
                )}
                {vendor?.twitter && (
                  <a href={vendor?.twitter} target={'_blank'} className="px-2">
                    <CustomImage
                      src={Twitter.src}
                      alt="twitter"
                      width={22}
                      height={22}
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col p-6">
            <div className="flex flex-1 flex-col justify-center items-center space-y-3 bg-gray-100 p-6 rounded-2xl">
            <FeedbackIcon />

              <p
                suppressHydrationWarning={suppressText}
                className={`text-black py-4`}
              >
                {t('leave_feedback_desc')}
              </p>
              <button
                onClick={handleOpenPopup}
                className={`flex flex-col flex-1 w-1/2 justify-center items-center bg-gray-50 rounded-3xl p-3 shadow-xl`}
              >
                <p
                  suppressHydrationWarning={suppressText}
                  className={`text-black`}
                >
                  {upperFirst(`${t('leave_a_feedback')}`)}
                </p>
              </button>
            </div>
          </div>
          <FeedbackModal
            isOpen={showModal}
            ariaHideApp={false}
            onRequestClose={handleClosePopup}
          />
        </> : <ContentLoader type="VendorInfo" sections={1} />}
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

