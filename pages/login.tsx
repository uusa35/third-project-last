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
import { appLinks, imageSizes, mainBtnClass, suppressText } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import GuestOrderModal from '@/components/modals/GuestOrderModal';
import { useEffect, useState } from 'react';
import { startCase } from 'lodash';
import PhoneInput, { getCountryCallingCode, parsePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import SaveAddressIcon from '@/appIcons/save_address.svg';
import SaveContactInfo from '@/appIcons/save_contact_info.svg';
import ReOrderIcon from '@/appIcons/re-order_icon.svg';
import TrackOrderIcon from '@/appIcons/track_order_icon.svg';
import { useCheckPhoneMutation, useLoginMutation, useVerifyCodeMutation } from '@/redux/api/authApi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import { setCountryCode, setCustomer, signIn } from '@/redux/slices/customerSlice';

type Props = {
  element: Vendor;
  url: string;
};
const schema = yup
  .object({
    phone: yup.number().min(10000000000).max(999999999999),
  })
  .required();
const GuestMobile: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const color = useAppSelector(themeColor);
  const { customer: { countryCode, phone }} = useAppSelector((state) => state);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: phone ?? ``
    },
  });
  const [triggerCheckPhone] = useCheckPhoneMutation();
  const [triggerLogin] = useLoginMutation();
  
  const onSubmit = async (data: any) => {
    const parsedPhoneNumber = parsePhoneNumber(`+${data.phone}`);
    const userPhone = parsedPhoneNumber ? parsedPhoneNumber?.nationalNumber : ``;
    const userCountryCode = `+${parsedPhoneNumber?.countryCallingCode}`;
    await triggerCheckPhone({body: {
      phone: userPhone,
      phone_country_code: userCountryCode,
    }, url}).then(async (r: any) => {
      if(r.error) {
        router.push(appLinks.otpVerification.path)
      }
      else {
        await triggerLogin({body: {
          phone: userPhone,
          phone_country_code: userCountryCode,
        }, url}).then((r: any) => {
          dispatch(setCustomer(r.data.data.user));
          dispatch(signIn(r.data.data.token));
          router.back();
        });
      }
      dispatch(setCountryCode(`+${parsedPhoneNumber?.countryCallingCode}`));
      dispatch(setCustomer({phone: userPhone}));
    });
  };
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
          className="w-1/2 xl:w-1/3 h-auto object-contain"
        />
        <p className="text-lg font-extrabold">{t('verify_ur_mobile')}</p>
        <p className="text-md text-gray-600">
          {t('u_will_receive_a_one_time_password_shortly')}
        </p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4">
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
              <Controller
                name="phone"
                control={control}
                rules={{
                  validate: (value) => isValidPhoneNumber(value)
                }}
                render={({ field: { onChange } }) => (
                  <PhoneInput
                    onChange={onChange}
                    defaultCountry="KW"
                    id="phone"
                    className="focus:outline-none mt-2 border-b border-gray-100 pb-3"
                  style={{ borderBottomColor: '#e5e7eb' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#3f3f46')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                  />
                )}
              />
              {errors?.phone?.message && (
                <div className={`text-sm text-red-800`}>
                  {errors?.phone?.message && (
                    <p suppressHydrationWarning={suppressText}>
                      {t('phone_number_must_be_between_8_and_15_number')}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 flex flex-col space-y-4">
              <div className="flex flex-row items-center">
                <div>
                  <SaveAddressIcon className="text-gray-600 h-6" />
                </div>
                <div className="px-3">{t('save_ur_address')}</div>
              </div>
              {/*  user info  */}
              <div className="flex flex-row items-center">
                <div>
                  <SaveContactInfo className="text-gray-600 h-6" />
                </div>
                <div className="px-3">{t('save_ur_contact_information')}</div>
              </div>
              {/*  re-order  */}
              <div className="flex flex-row items-center">
                <div>
                  <ReOrderIcon className="text-gray-600 h-6" />
                </div>
                <div className="px-3">{t('one_tap_re_order')}</div>
              </div>
              {/*  track  */}
              <div className="flex flex-row items-center">
                <div>
                  <TrackOrderIcon className="text-gray-600 h-6" />
                </div>
                <div className="px-3">{t('track_order')}</div>
              </div>
            </div>
            <button
              className={`${mainBtnClass} flex flex-row justify-center items-center my-4`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
              type="submit"
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
          </form>
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
