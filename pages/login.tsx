import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import { appLinks, imageSizes, mainBtnClass, suppressText } from '@/constants/*';
import MobileImg from '@/appImages/mobile.png';
import CustomImage from '@/components/CustomImage';
import GuestOrderModal from '@/components/modals/GuestOrderModal';
import PhoneInput, { parsePhoneNumber, isValidPhoneNumber, getCountries } from 'react-phone-number-input';
import SaveAddressIcon from '@/appIcons/save_address.svg';
import SaveContactInfo from '@/appIcons/save_contact_info.svg';
import ReOrderIcon from '@/appIcons/re-order_icon.svg';
import TrackOrderIcon from '@/appIcons/track_order_icon.svg';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { useCheckPhoneMutation, useLoginMutation } from '@/redux/api/authApi';
import { themeColor } from '@/redux/slices/vendorSlice';
import { setCustomer, signIn } from '@/redux/slices/customerSlice';
import { checkPhone } from 'src/validations';
import { map, upperCase, upperFirst } from 'lodash';
import { setUrl } from '@/redux/slices/appSettingSlice';

type Props = {
  element: Vendor;
  url: string;
};

const GuestMobile: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const color = useAppSelector(themeColor);
  const { customer } = useAppSelector((state) => state);
  const signInAdvantages = [
    { id: 1, icon: <SaveAddressIcon />, text: 'save_your_addresses'},
    { id: 2, icon: <SaveContactInfo />, text: 'save_your_contact_information'},
    { id: 3, icon: <ReOrderIcon />, text: 'one-tap_re-ordering'},
    { id: 4, icon: <TrackOrderIcon />, text: 'tracking_orders'}
  ];
  const excludedCountries = ['IL']; 
  const filteredCountries = getCountries().filter(country => !excludedCountries.includes(country));
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkPhone),
    defaultValues: {
      phone: customer.phone ?? ``
    },
  });

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  const [triggerCheckPhone] = useCheckPhoneMutation();
  const [triggerLogin] = useLoginMutation();
  const onSubmit = async (body: any) => {
    const parsedPhoneNumber = parsePhoneNumber(`+${body.phone}`);
    const userPhone = parsedPhoneNumber ? parsedPhoneNumber?.nationalNumber : ``;
    const userCountryCode = `+${parsedPhoneNumber?.countryCallingCode}`;
    await triggerCheckPhone({body: {
      phone: userPhone,
      phone_country_code: userCountryCode,
    }, url}).then(async (r: any) => {
      if(r.error) {
        router.push(appLinks.otpVerification.path);
      }
      else {
        await triggerLogin({body: {
          phone: userPhone,
          phone_country_code: userCountryCode,
          UserAgent: customer.userAgent
        }, url}).then((r: any) => {
          dispatch(setCustomer(r.data.data.user));
          dispatch(signIn(r.data.data.token));
          router.back();
        });
      }
      dispatch(
        setCustomer({
          countryCode: `+${parsedPhoneNumber?.countryCallingCode}`,
          phone: userPhone,
        })
      );
    });
  };
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader
      currentModule="your_number"
    >
      {/*  no address case */}
      <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center">
        <div className="pt-8">
          <CustomImage
            alt={t('mobile')}
            src={MobileImg}
            width={imageSizes.md}
            height={imageSizes.md}
          />
        </div>
        <div className="text-center">
          <h3 
            className="font-bold pb-2" 
            suppressHydrationWarning={suppressText}>
              {t('verify_your_mobile_number')}
          </h3>
          <span 
            className="text-[#877D78] text-sm lowercase" 
            suppressHydrationWarning={suppressText}>
              {upperFirst(`${t('you_ll_receive_a_one_time_password_shortly.')}`)}
          </span>
        </div>
          <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="w-full px-4"
          >
            <div className="pt-3 pb-5">
              <label
                htmlFor="phone"
                className="text-zinc-500 text-sm"
                suppressHydrationWarning={suppressText}
              >
                {t('phone_number')}
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
                    countries={filteredCountries}
                  />
                )}
              />
              {errors?.phone?.message && (
                <div className={`text-sm text-red-600 pt-3`}>
                  {errors?.phone?.message && (
                    <p suppressHydrationWarning={suppressText}>
                      {t('phone_number_must_be_between_9_and_15_number')}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="px-4">
              {map(signInAdvantages, (advantage) => (
                <div className="flex pb-3" key={advantage.id}>
                  {advantage.icon}
                  <span className="px-3 text-sm text-zinc-800" suppressHydrationWarning={suppressText}>{t(advantage.text)}</span>
              </div>
              ))}
            </div>
            <button
              className={`${mainBtnClass} flex flex-row justify-center items-center my-4`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
              type="submit"
            >
             {t('send')} {' '} {upperCase(`${t('otp')}`)}
            </button>
          </form>
          <button 
              className="w-full underline text-center pb-10" 
              suppressHydrationWarning={suppressText}
              onClick={() => setIsOpen(true)}
            >
              {upperFirst(`${t('or_continue_as_guest')}`)} 
          </button>
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
