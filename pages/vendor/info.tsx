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
import PaymentIcon from '@/appIcons/payment.svg';
import Knet from '@/appImages/knet.svg';
import CashOnDelivery from '@/appImages/cod.svg';
import Visa from '@/appImages/credit_card.svg';
import { useTranslation } from 'react-i18next';
import {
  convertColor,
  iconColor,
  imageSizes,
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

  function handleClosePopup() {
    SetShowModal(false);
  }
  const handleOpenPopup = () => {
    SetShowModal(true);
  };
  const [showModal, SetShowModal] = useState(false);
  // const VendorDetailsItem = ({ icon, text, content }: DetailsItem) => {
  //   return (
  //     <div className="flex justify-between px-4 py-6 m-3 shadow-md capitalize">
  //       <div className="flex justify-center items-center">
  //         {icon}
  //         <p
  //           className="px-2 font-semibold"
  //           suppressHydrationWarning={suppressText}
  //         >
  //           {t(text)}
  //         </p>
  //       </div>
  //       <div>
  //         <p suppressHydrationWarning={suppressText}>{t(content)}</p>
  //       </div>
  //     </div>
  //   );
  // };

  console.log('element', element);
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
        {/* <VendorDetailsItem
          icon={
            <Clock
              width={imageSizes.xs}
              height={imageSizes.xs}
              alt={t('work_hours')}
              className={`w-5 h-5 ${iconColor}`}
            />
          }
          text="work_hours"
          content={element.WorkHours}
        /> */}
        {/* <VendorDetailsItem
          icon={
            <DeliveryIcon
              width={imageSizes.xs}
              height={imageSizes.xs}
              alt={t('delivery_time')}
              className={`w-5 h-5 pt-1 ${iconColor}`}
            />
          }
          text="delivery_time"
          content={element.DeliveryTime}
        />
        <VendorDetailsItem
          icon={
            <PreOrderAvailabilityIcon
              width={imageSizes.xs}
              height={imageSizes.xs}
              alt={t('preorder_availability')}
              className={`w-6 h-6 ${iconColor}`}
            />
          }
          text="preorder_availability"
          content={element.Preorder_availability}
        /> */}
        <div className="px-4 py-6 shadow-md">
          <div className="flex justify-between pb-20 ps-3">
            <div className="flex items-center">
              {/* <PaymentIcon
                width={imageSizes.xs}
                height={imageSizes.xs}
                alt={t('payment_methods')}
                className={`w-6 h-6 ${iconColor}`}
              /> */}
              <p
                className="px-2 font-semibold"
                suppressHydrationWarning={suppressText}
              >
                {t('payment_methods')}
              </p>
            </div>
            <div className="flex items-center">
              {element.Payment_Methods.visa && (
                <div className="px-5">
                  {/* <Visa className={`h-8 w-12`} /> */}
                </div>
              )}
              {element.Payment_Methods.cash_on_delivery && (
                <div className="px-5">
                  {/* <CashOnDelivery className={`h-8 w-12`} /> */}
                </div>
              )}
              {element.Payment_Methods.knet && (
                <div className="px-5 ">
                  {/* <Knet className={`h-8 w-12`} /> */}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full py-8 px-4">
          <div className="py-5">
            <button className={`${submitBtnClass}`}>
              <div className="flex justify-center items-center">
                {/* <FeedbackIcon
                  className={`w-5 h-5 ${iconColor}`}
                  alt={t('feedback')}
                /> */}
                <p
                  className={`text-white px-2 ${submitBtnClass}`}
                  suppressHydrationWarning={suppressText}
                  onClick={handleOpenPopup}
                  style={{ backgroundColor: convertColor(color, 100) }}
                >
                  {t('leave_feedback')}
                </p>
              </div>
            </button>
          </div>
          <div className="flex justify-evenly items-center w-[90%] m-auto">
            {element.facebook && (
              <a href={element.facebook} target={'_blank'}>
                {/* <Facebook
                  className={`w-8 h-8  ${iconColor} pt-1`}
                  alt={t('facebook')}
                /> */}
              </a>
            )}
            {element.instagram && (
              <a href={element.instagram} target={'_blank'}>
                {/* <Instagram
                  className={`w-8 h-8  ${iconColor} pt-1`}
                  alt={t('instagram')}
                /> */}
              </a>
            )}
            {element.twitter && (
              <a href={element.twitter} target={'_blank'}>
                {/* <Twitter
                  className={`w-8 h-8  ${iconColor} pt-1`}
                  alt={t('twitter')}
                /> */}
              </a>
            )}
          </div>
        </div>
        {/* <Feedback
          isOpen={showModal}
          ariaHideApp={false}
          onRequestClose={handleClosePopup}
        /> */}
        <div className={`mt-[10%]`}>
          <PoweredByQ />
        </div>
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
