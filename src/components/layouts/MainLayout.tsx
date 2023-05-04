import { FC, ReactNode, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import {
  arboriaFont,
  gessFont,
  scrollClass,
  setLang,
  suppressText,
} from '@/constants/*';
import { setLocale } from '@/redux/slices/localeSlice';
import { useLazyGetVendorQuery } from '@/redux/api/vendorApi';
import MainAsideLayout from './MainAsideLayout';
import { destinationObject } from '@/redux/slices/searchParamsSlice';
import { setVendor } from '@/redux/slices/vendorSlice';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';

type Props = {
  children: ReactNode | undefined;
  showCart?: boolean;
};

type Handler = (...evts: any[]) => void;

const MainLayout: FC<Props> = ({ children }): JSX.Element => {
  const {
    appSetting: { sideMenuOpen, url, previousUrl },
    locale,
    searchParams: { destination, method },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const desObject = useAppSelector(destinationObject);
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();


    // vendor..................................

  useEffect(() => {
    getVendor();
  }, [url]);

  const getVendor = () => {
    triggerGetVendor(
      {
        lang: locale.lang,
        url,
        ...desObject,
      },
      false
    );
  };

  // useEffect(() => {
  //   getVendor();
  //   if (vendorSuccess && vendorElement && vendorElement.Data) {
  //     if (vendorElement?.Data?.delivery_pickup_type === 'pickup') {
  //       dispatch(setCartMethod('pickup'));
  //       dispatch(removeArea());
  //     } else if (vendorElement?.Data?.delivery_pickup_type === 'delivery') {
  //       dispatch(setCartMethod('delivery'));
  //       dispatch(removeBranch());
  //     }
  //   }
  // }, [branch.id, area.id, method]);

  useEffect(() => {
    setAppDefaults();
  }, [vendorSuccess]);

  const setAppDefaults = () => {
    // if (isNull(userAgent) && url) {
    //   await triggerCreateTempId({ url }).then((r: any) => {
    //     if (r && r.data && r.data.Data && r.data.Data.Id) {
    //       dispatch(setUserAgent(r.data.Data?.Id));
    //     }
    //   });
    // }
    if (vendorSuccess && vendorElement && vendorElement.Data) {
      dispatch(setVendor(vendorElement.Data));
    }
  };


  // locale ......................................
  useEffect(() => {
    if (router.locale !== locale.lang) {
      dispatch(setLocale(router.locale));
    }
    if (router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale);
    }
    setLang(router.locale);
  }, [router.locale]);

  useEffect(() => {
    if (router.locale !== locale.lang) {
      dispatch(setLocale(router.locale));
    }
    if (router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale);
    }
    // moment.locale(router.locale);
    // yup.setLocale({
    //   mixed: {
    //     required: 'validation.required',
    //   },
    //   number: {
    //     min: ({ min }) => ({ key: 'validation.min', values: { min } }),
    //     max: ({ max }) => ({ key: 'validation.max', values: { max } }),
    //   },
    //   string: {
    //     email: 'validation.email',
    //     min: ({ min }) => ({ key: `validation.min`, values: min }),
    //     max: ({ max }) => ({ key: 'validation.max', values: max }),
    //     matches: 'validation.matches',
    //   },
    // });
    setLang(router.locale);
  }, [router.locale]);

  // routing..................................

  useEffect(() => {
    const handleRouteChange: Handler = (url, { shallow }) => {
      dispatch(hideSideMenu());
    };
    const handleChangeComplete: Handler = (url, { shallow }) => {
      if (sideMenuOpen) {
        dispatch(hideSideMenu());
      }
    };

    const handleRouteChangeError = (err: any) => {
      // return router.replace(router.asPath);
    };

    router.events.on('routeChangeError', handleRouteChangeError);
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', handleChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.pathname]);

  return (
    <div
      dir={router.locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${router.locale === 'ar' ? gessFont : arboriaFont}
        flex-col justify-start items-start grow lg:flex lg:flex-row flex flex-row h-screen capitalize`}
    >
      {children}

      <div
        className={`hidden lg:block flex flex-row w-full h-screen lg:w-2/4 xl:w-2/3 fixed ${scrollClass} ${
          router.locale === 'ar' ? 'left-0' : 'right-0'
        }`}
        suppressHydrationWarning={suppressText}
      >
        {vendorSuccess && vendorElement && vendorElement.Data && (
          <MainAsideLayout element={vendorElement.Data} />
        )}
      </div>
    </div>
  );
};

export default MainLayout;
