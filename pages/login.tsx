import MainLayout from '@/layouts/MainLayout';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import {
  ArrowPathIcon,
  BuildingOfficeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import NoAddresses from '@/appImages/no_address.svg';
import MobileImg from '@/appImages/mobile.png';
import { imageSizes, mainBtnClass, suppressText } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import GuestOrderModal from '@/components/modals/GuestOrderModal';
import { useState } from 'react';
import { startCase } from 'lodash';
import PhoneInput from 'react-phone-number-input';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  element: Vendor;
  url: string;
};

const GuestMobile: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const color = useAppSelector(themeColor);
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="addresses"
    >
      {/*  no address case */}
      <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center">
        <CustomImage
          alt={t('mobile')}
          src={MobileImg.src}
          className="w-1/2 xl:w-1/3 h-auto object-contain "
        />
        <p className="text-lg font-extrabold">{t('verify_ur_mobile')}</p>
        <p className="text-md text-gray-600">
          {t('u_will_receive_a_one_time_password_shortly')}
        </p>
        <div className="w-full px-4">
          {/* phone */}
          <div className="pt-6 pb-5">
            <label
              htmlFor="phone"
              className="text-gray-500"
              suppressHydrationWarning={suppressText}
            >
              <div>{t('phone_number')}</div>

              <div>
                {/* {errors?.phone?.message && (
                  <p
                    className={`text-base text-red-800 font-semibold py-2 capitalize`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('phone_is_required')}
                  </p>
                )} */}
              </div>
            </label>
            <PhoneInput
              defaultCountry="KW"
              type="text"
              name="phone_auth"
              placeholder={`${startCase(`${t('enter_your_name')}`)}`}
              onChange={(e) => console.log(e)}
              className="focus:outline-none mt-2 border-b border-gray-100 pb-3"
              style={{ borderBottomColor: '#e5e7eb' }}
              onFocus={(e) => (e.target.style.borderBottomColor = '#3f3f46')}
              onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
            />
          </div>
          <div className="px-6 flex flex-col space-y-4">
            <div className="flex flex-row space-x-3 items-center">
              <div>
                <BuildingOfficeIcon className="text-gray-600 h-6 h-6" />
              </div>
              <div>{t('save_ur_address')}</div>
            </div>
            {/*  user info  */}
            <div className="flex flex-row space-x-3 items-center">
              <div>
                <UserIcon className="text-gray-600 h-6 h-6" />
              </div>
              <div>{t('save_ur_contact_information')}</div>
            </div>
            {/*  re-order  */}
            <div className="flex flex-row space-x-3 items-center">
              <div>
                <ArrowPathIcon className="text-gray-600 h-6 h-6" />
              </div>
              <div>{t('one_tap_re_order')}</div>
            </div>
            {/*  track  */}
            <div className="flex flex-row space-x-3 items-center">
              <div>
                <ArrowPathIcon className="text-gray-600 h-6 h-6" />
              </div>
              <div>{t('track_order')}</div>
            </div>
          </div>
          <button
            className={`${mainBtnClass} flex flex-row justify-center items-center my-4`}
            style={{ backgroundColor: color }}
            suppressHydrationWarning={suppressText}
          >
            {t('send_otp')}
          </button>
          <button
            className={`flex flex-row justify-center items-center w-full my-4 text-black text-center capitalize underline`}
            suppressHydrationWarning={suppressText}
            onClick={() => setIsOpen(true)}
          >
            {t('or_continue_as_guest')}
          </button>
        </div>
        <GuestOrderModal
          url={url}
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
        />
      </div>
    </MainContentLayout>
  );
};

export default GuestMobile;

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
