import CustomImage from "@/components/CustomImage";
import MainHead from "@/components/MainHead";
import MainContentLayout from "@/layouts/MainContentLayout";
import { wrapper } from "@/redux/store";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AccountInfoImg from '@/appImages/account_info.png';
import { appLinks, imageSizes, mainBtnClass, suppressText } from "@/constants/*";
import { upperFirst } from "lodash";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentModule, setUrl } from "@/redux/slices/appSettingSlice";
import { useRouter } from "next/router";
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRegisterMutation } from "@/redux/api/authApi";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { customerInfoSchema } from "src/validations";
import { setCustomer, signIn } from "@/redux/slices/customerSlice";

type Props = {
  url: string;
}
export default function AccountInfo({ url }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const color = useAppSelector(themeColor);
  const { customer: { phone, name, email, countryCode } } = useAppSelector((state) => state);
  const [triggerRegister] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(customerInfoSchema),
    defaultValues: {
      id: null,
      name: name ?? ``,
      email: email ?? ``,
      phone,
    },
  });

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  const onSubmit = async (body: any) => {
    await triggerRegister({
      body: {
        phone,
        name: body.name,
        ...(body.email && { email: body.email }),
        phone_country_code: countryCode
      },
      url,
    }).then((r: any) => {
      dispatch(setCustomer(r.data.data.user));
      dispatch(signIn(r.data.data.token));
      router.push(`${appLinks.addressMap.path}`);
    });
  }

  return (
    <Fragment>
      <MainHead
        title={t('account_info')}
        description={`${t('account_info')}`}
      />
       <MainContentLayout url={url} showBackBtnHeader currentModule="account_info">
        <div>
        <div className="text-center w-full p-5">
          <div>
            <div className="flex justify-center">
              <CustomImage 
                src={AccountInfoImg} 
                alt='account info' 
                width={imageSizes.md} 
                height={imageSizes.md}   
              />
            </div>
            <div className="text-center">
              <h3 
                className="font-bold" 
                suppressHydrationWarning={suppressText}>
                  {upperFirst(`${t('complete_your_account_info')}`)}
              </h3>
              <p 
                className="text-[#877D78] lowercase w-[90%] mx-auto" 
                suppressHydrationWarning={suppressText}>
                  {upperFirst(`${t('enter_your_name_and_email_to_end')}`)}
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative pb-4">
                  <input 
                      type="text" 
                      id="name"  
                      {...register('name')}
                      className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[2px] appearance-none focus:outline-none focus:ring-0  peer" 
                      style={{ borderBottomColor: '#e5e7eb', caretColor: color }}
                      onFocus={(e) => e.target.style.borderBottomColor = color }
                      onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb' }
                      placeholder=" " 
                    />
                  <label 
                      htmlFor="name"  
                      className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full text-start rtl:ps-4"
                      suppressHydrationWarning={suppressText}
                  >
                      {t('fill_name')}
                  </label>
              </div>
              {errors?.name?.message && (
                <div className={`text-sm text-red-600 w-full text-start pt-2 ps-2`}>
                  {errors?.name?.message && (
                    <p suppressHydrationWarning={suppressText}>
                      {t('name_is_required')}
                    </p>
                  )}
                </div>
              )}
              <div className="relative mt-5">
                <input 
                    type="email" 
                    id="email"
                    {...register('email')} 
                    className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[2px] border-gray-200 appearance-none focus:outline-none focus:ring-0  peer" placeholder=" " 
                    style={{ borderBottomColor: '#e5e7eb', caretColor: color }}
                    onFocus={(e) => e.target.style.borderBottomColor = color }
                    onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb'}
                />
                <label 
                    htmlFor="email" 
                    className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full text-start rtl:ps-4"
                    suppressHydrationWarning={suppressText}
                >
                {t('your_email_optional')}
                </label>
              </div>
              <button 
                className={`mt-5 ${mainBtnClass}`} 
                style={{
                  backgroundColor: color
                }}
                suppressHydrationWarning={suppressText}
                type="submit"
              >
                {t('submit')}
              </button>
            </form>
          </div>
        </div>
        </div>
       </MainContentLayout>
    </Fragment>
  )
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