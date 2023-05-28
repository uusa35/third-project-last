import { FC, ReactNode, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import {
  alexandriaFont,
  appLinks,
  arboriaFont,
  gessFont,
  scrollClass,
  setLang,
  suppressText,
} from '@/constants/*';
import { setLocale } from '@/redux/slices/localeSlice';
import { useLazyGetVendorQuery } from '@/redux/api/vendorApi';
import MainAsideLayout from './MainAsideLayout';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';
import { setVendor } from '@/redux/slices/vendorSlice';
import ToastAppContainer from '../ToastAppContainer';
import moment from 'moment';
import * as yup from 'yup';
import { useLazyCreateTempIdQuery } from '@/redux/api/CustomerApi';
import { setUserAgent } from '@/redux/slices/customerSlice';
import { isNull } from 'lodash';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import ContentLoader from '../skeletons';

type Props = {
  children: ReactNode | undefined;
  showCart?: boolean;
};

type Handler = (...evts: any[]) => void;

const MainLayout: FC<Props> = ({ children }): JSX.Element => {
  const {
    appSetting: { url, sideMenuOpen },
    locale,
    searchParams: { destination, method },
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const desObject = useAppSelector(destinationHeaderObject);
  const desID = useAppSelector(destinationId);

  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();

  const [triggerCreateTempId, { isSuccess: tempIdSuccess }] =
    useLazyCreateTempIdQuery();

  // vendor..................................

  useEffect(() => {
    getVendor();
  }, [url, , method, destination, desID]);

  const getVendor = () => {
    triggerGetVendor(
      {
        lang: locale.lang,
        url,
        destination: desObject,
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
  }, [vendorSuccess, tempIdSuccess, url]);

  const setAppDefaults = async () => {
    console.log('userAgent', userAgent, isNull(userAgent), url);

    if (isNull(userAgent) && url) {
      await triggerCreateTempId({ url }).then((r: any) => {
        if (r && r.data && r.data.Data && r.data.Data.Id) {
          dispatch(setUserAgent(r.data.Data?.Id));
        }
      });
    }
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
    moment.locale(router.locale);
    yup.setLocale({
      mixed: {
        required: 'validation.required',
      },
      number: {
        min: ({ min }) => ({ key: 'validation.min', values: { min } }),
        max: ({ max }) => ({ key: 'validation.max', values: { max } }),
      },
      string: {
        email: 'validation.email',
        min: ({ min }) => ({ key: `validation.min`, values: min }),
        max: ({ max }) => ({ key: 'validation.max', values: max }),
        matches: 'validation.matches',
      },
    });
    setLang(router.locale);
  }, [router.locale]);

  useEffect(() => {
    const handleRouteChangeStart: Handler = (url, { shallow }) => {
      console.log({ url });
      dispatch(hideSideMenu());
    };
    const handleChangeComplete: Handler = (url, { shallow }) => {
      if (sideMenuOpen) {
        dispatch(hideSideMenu());
      }
    };

    const handleRouteChangeError = (err, url) => {
      console.log(err, url);
      if (err.cancelled) {
        console.log(`Route to ${url} was cancelled!`);
      }
    };

    const handleHashChangeStart: Handler = (url) => {
      console.log({ url });
    };

    const handleHashChangeComplete: Handler = (url, { shallow }) => {
      console.log({ url });
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
    router.events.on('hashChangeStart', handleHashChangeStart);
    router.events.on('hashChangeComplete', handleHashChangeComplete);
    window.addEventListener('hashchange', handleHashChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleChangeComplete);
      window.removeEventListener('hashchange', handleHashChangeStart);
    };
  }, [router.pathname]);

  // useEffect(() => {
  //   console.log(
  //     'path name',
  //     'hash',
  //     window.location.hash,
  //     'window path',
  //     window.location.pathname,
  //     'window href',
  //     window.location.href,
  //     'router pathnm',
  //     router.pathname
  //   );
  //   if (window.location.href.includes('#')) {
  //     router.push(appLinks.home.path);
  //   }
  // }, [window.location.href]);

  return (
    <div
      dir={router.locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${router.locale === 'ar' ? alexandriaFont : alexandriaFont}
        flex-col justify-start items-start grow lg:flex lg:flex-row flex flex-row h-screen capitalize`}
    >
      {children}
      <ToastAppContainer />
      <div
        className={`hidden lg:block flex flex-row w-full h-screen lg:w-2/4 xl:w-2/3 fixed ${scrollClass} ${
          router.locale === 'ar' ? 'left-0' : 'right-0'
        }`}
        suppressHydrationWarning={suppressText}
      >
        {vendorSuccess && vendorElement && vendorElement.Data ? (
          <MainAsideLayout url={url} element={vendorElement.Data} />
        ) : (
          <ContentLoader type="AsideSkelton" sections={1} />
        )}
      </div>
    </div>
  );
};

export default MainLayout;
