import CustomImage from "@/components/CustomImage";
import MainHead from "@/components/MainHead";
import MainContentLayout from "@/layouts/MainContentLayout";
import { wrapper } from "@/redux/store";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AccountInfoImg from '@/appImages/account_info.png';
import { appLinks, imageSizes, mainBtnClass, suppressText } from "@/constants/*";
import { upperFirst } from "lodash";
import { useAppDispatch } from "@/redux/hooks";
import { setCurrentModule } from "@/redux/slices/appSettingSlice";
import { useRouter } from "next/router";

type Props = {
  url: string;
}

export default function AccountInfo({ url }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(setCurrentModule('account_info'));
  }, []);

  const handleSubmit = () => {
    router.push(`${appLinks.AddressMap.path}`);
  }
  
  return (
    <Fragment>
      <MainHead
        title={t('account_info')}
        description={`${t('account_info')}`}
      />
       <MainContentLayout url={url}>
        <div>
        <div className="h-1 bg-red-600 w-full"></div>
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
                className="text-zinc-500 w-[90%] mx-auto" 
                suppressHydrationWarning={suppressText}>
                  {upperFirst(`${t('enter_your_name_and_email_to_end')}`)}
              </p>
            </div>
            <form>
            <div className="relative">
                <input 
                    type="text" 
                    name="full name" 
                    id="full name"  
                    className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[1px] border-gray-200 appearance-none focus:outline-none focus:ring-0  peer" placeholder=" " />
                <label 
                    htmlFor="full_name"  
                    className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full text-start"
                    suppressHydrationWarning={suppressText}
                >
                    {t('full_name')}
                </label>
            </div>
            <div className="relative">
                  <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[1px] border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer" placeholder=" " />
                  <label 
                      htmlFor="email" 
                      className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full text-start"
                      suppressHydrationWarning={suppressText}
                  >
                  {t('your_email_optional')}
                  </label>
              </div>
            </form>
            <button 
              className={`mt-5 ${mainBtnClass}`} 
              suppressHydrationWarning={suppressText}
              onClick={handleSubmit}
            >
              {t('submit')}
            </button>
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