import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import { appLinks, imageSizes, mainBtnClass, suppressText } from '@/constants/*';
import PasswordImg from '@/appIcons/password.png';
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
import { checkPhone, loginSchema } from 'src/validations';
import { map, upperCase, upperFirst } from 'lodash';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import * as yup from 'yup';
import ShowPasswordIcon from '@/appIcons/show_password.svg';
import HidePasswordIcon from '@/appIcons/hide_password.svg';

type Props = {
  element: Vendor;
  url: string;
};

const UserPassword: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const color = useAppSelector(themeColor);
  const { customer } = useAppSelector((state) => state);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({});
  const excludedCountries = ['IL']; 
  const filteredCountries = getCountries().filter(country => !excludedCountries.includes(country));
  const togglePasswordVisibility = (id: string) => {
  setPasswordVisibility(prevState => ({
    ...prevState,
    [id]: !prevState[id]
  }));
};
const {
  handleSubmit,
  control,
  register,
  formState: { errors },
} = useForm({
  resolver: yupResolver(loginSchema(isResetPassword)),
  defaultValues: {
    phone: customer.phone ?? '',
    password: '',
    new_password: '',
    confirmation_password: ''
  },
});
 console.log({ errors, isResetPassword })

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  const [triggerLogin] = useLoginMutation();
  const onSubmit = async (body: any) => {
    if(isResetPassword) {

    }
    else {
        await triggerLogin({body: {
            phone: customer.phone,
            phone_country_code: customer.countryCode,
            UserAgent: customer.userAgent,
            password: body.password
          }, url}).then((r: any) => {
            console.log({ loginRes: r })
            if(r.error) {
                dispatch(
                    showToastMessage({
                      content: `the_password_you_entered_is_incorrect.`,
                      type: `error`,
                    })
                );
            }
            else {
                dispatch(setCustomer(r.data.data.user));
                dispatch(signIn(r.data.data.token));
                router.push('/');
            }
          });
    }
  };
  const handleForgetPassword = () => {
    setIsResetPassword(true);
  };
  
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader
      currentModule="enter_password"
    >
      {/*  no address case */}
      <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center">
        <div className="pt-8">
          <CustomImage
            alt={t('password')}
            src={PasswordImg}
            width={imageSizes.md}
            height={imageSizes.md}
          />
        </div>
        <div className="text-center">
          <h3 
            className="font-bold pb-2" 
            suppressHydrationWarning={suppressText}>
              {t('enter_your_password_to_continue')}
          </h3>
          <span 
            className="text-[#877D78] text-sm lowercase" 
            suppressHydrationWarning={suppressText}>
              {upperFirst(`${t('please_enter_your_password_or_forget_password.')}`)}
          </span>
        </div>
          <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="w-full px-4"
          >
            {!isResetPassword && ( 
                <>
                  <div className="relative pb-4 mt-5">
                    <label className="text-gray-500" htmlFor='password'>{t('your_password')}</label>
                    <input 
                      type={passwordVisibility['password'] ? 'text' : 'password'}
                      id="password"  
                      {...register('password')}
                      className="block px-2.5 pb-2.5 pt-3 w-full text-black bg-gray-50 border-b-[2px] appearance-none focus:outline-none focus:ring-0  peer" 
                      style={{ borderBottomColor: '#e5e7eb', caretColor: color }}
                      onFocus={(e) => e.target.style.borderBottomColor = color }
                      onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb' }
                      placeholder=" " 
                    />
                    <div 
                      className="absolute bottom-7 right-2 cursor-pointer"
                      onClick={() => togglePasswordVisibility('password')}
                    >
                      {passwordVisibility['password'] ? <ShowPasswordIcon /> : <HidePasswordIcon />}
                    </div>
                  </div>
                    {errors?.password?.message && (
                        <div className={`text-sm text-red-600 w-full text-start pt-2 ps-2`}>
                        {errors?.password?.message && (
                            <p suppressHydrationWarning={suppressText}>
                            {t('password_is_required')}
                            </p>
                        )}
                        </div>
                    )}
                    <button className="capitalize text-gray-500" onClick={handleForgetPassword}>{t('forget_password?')}</button>
                </> 
            )}
            {isResetPassword && (
              <>
                <div className="relative pb-4 mt-5">
                  <label className="text-gray-500" htmlFor="new_password">
                    {t('new_password')}
                  </label>
                  <input
                    type={passwordVisibility['new_password'] ? 'text' : 'password'}
                    id="new_password"
                    {...register('new_password')}
                    className="block px-2.5 pb-2.5 pt-3 w-full text-black bg-gray-50 border-b-[2px] appearance-none focus:outline-none focus:ring-0  peer"
                    style={{ borderBottomColor: '#e5e7eb', caretColor: color }}
                    onFocus={(e) => e.target.style.borderBottomColor = color}
                    onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb'}
                    placeholder=" "
                  />
                  <div
                    className="absolute bottom-7 right-2 cursor-pointer"
                    onClick={() => togglePasswordVisibility('new_password')}
                  >
                    {passwordVisibility['new_password'] ? <ShowPasswordIcon /> : <HidePasswordIcon />}
                  </div>
                </div>
                {errors?.new_password?.message && (
                  <div className="text-sm text-red-600 w-full text-start pt-2 ps-2">
                    <p suppressHydrationWarning={suppressText}>
                      {t('new_password_is_required')}
                    </p>
                  </div>
                )}

                <div className="relative pb-4 mt-5">
                  <label className="text-gray-500" htmlFor="confirmation_password">
                    {t('confirm_password')}
                  </label>
                  <input
                    type={passwordVisibility['confirmation_password'] ? 'text' : 'password'}
                    id="confirmation_password"
                    {...register('confirmation_password')}
                    className="block px-2.5 pb-2.5 pt-3 w-full text-black bg-gray-50 border-b-[2px] appearance-none focus:outline-none focus:ring-0  peer"
                    style={{ borderBottomColor: '#e5e7eb', caretColor: color }}
                    onFocus={(e) => e.target.style.borderBottomColor = color}
                    onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb'}
                    placeholder=" "
                  />
                  <div
                    className="absolute bottom-7 right-2 cursor-pointer"
                    onClick={() => togglePasswordVisibility('confirmation_password')}
                  >
                    {passwordVisibility['confirmation_password'] ? <ShowPasswordIcon /> : <HidePasswordIcon />}
                  </div>
                </div>
                {errors?.confirmation_password?.message && (
                  <div className="text-sm text-red-600 w-full text-start pt-2 ps-2">
                    <p suppressHydrationWarning={suppressText}>
                      {t('confirm_password_is_required')}
                    </p>
                  </div>
                )}
              </>
            )}
            <button
              className={`${mainBtnClass} flex flex-row justify-center items-center my-4`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
              type="submit"
            >
             {isResetPassword ? t('save') : t('continue')}
            </button>
          </form>
      </div>
    </MainContentLayout>
  );
};

export default UserPassword;

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