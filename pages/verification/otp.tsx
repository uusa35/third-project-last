import CustomImage from '@/components/CustomImage';
import MainHead from '@/components/MainHead'
import MainContentLayout from '@/layouts/MainContentLayout'
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { wrapper } from '@/redux/store';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import OtpVerify from '@/appImages/otp_verify.png';
import { appLinks, imageSizes, mainBtnClass, suppressText } from '@/constants/*';
import { upperFirst } from 'lodash';
import OtpInput from 'react18-input-otp';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  url: string;
}

export default function OtpVerifications({ url }: Props) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const color = useAppSelector(themeColor);

  
  const handleChangeOtp = (enteredOtp: string) => {
    setOtp(enteredOtp);
    console.log({enteredOtp})
};


  const handleVerify = () => {
    if(otp.length === 4) {
      router.push(`${appLinks.accountInfo.path}`);
    }
  }


  return (
    <Fragment>
      <MainHead
        title={t('otp_verification')}
        description={`${t('otp_verification')}`}
      />
       <MainContentLayout url={url} showBackBtnHeader currentModule="otp_verification">
        <div className="flex justify-center p-5">
          <div>
            <div className="flex justify-center">
              <CustomImage 
                src={OtpVerify} 
                alt='otp verification' 
                width={imageSizes.sm} 
                height={imageSizes.sm}  
              />
            </div>
            <div className="text-center">
              <h3 
                className="font-bold" 
                suppressHydrationWarning={suppressText}>
                  {t('confirmation_your_number')}
              </h3>
              <p 
                className="text-zinc-500 w-[90%] mx-auto" 
                suppressHydrationWarning={suppressText}>
                  {upperFirst(`${t('please_enter_the_4-digit_code_that_was_sent_to_the_number')}`)}
                  <span className="text-black px-2">phone number here</span>
              </p>
            </div>
            <div className="w-[80%] mx-auto flex justify-between text-center">
              <span className="text-zinc-500" suppressHydrationWarning={suppressText}>{t('you_ll_receive_code_in_0100')}</span>
              <button className="underline capitalize" suppressHydrationWarning={suppressText}>
                {t('resend')}
              </button>
            </div>
            <div className="d-flex justify-content-center">
              <OtpInput 
                    value={otp} 
                    onChange={handleChangeOtp} 
                    numInputs={4} 
                    successStyle="success"
                    inputStyle={{
                      backgroundColor: '#F5F5F5',
                      width: '70px',
                      height: '70px',
                      margin: '10px',
                      borderRadius: '10px',
                      caretColor: '#DC2626',
                      fontSize: '30px',
                      outline: 'none',
                      borderColor: 'transparent'
                    }}
                    containerStyle={{
                      justifyContent: 'center'
                    }}
              />
            </div>
            <button 
              className={`mt-5 mb-20 ${mainBtnClass}`}
              style={{ backgroundColor: color }} 
              suppressHydrationWarning={suppressText}
              onClick={handleVerify}
            >
              {t('verify')}
            </button>
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