import { FC, ReactNode, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import {
  arboriaFont,
  gessFont,
  setLang,
} from '@/constants/*';
import { setLocale } from '@/redux/slices/localeSlice';

type Props = {
  children: ReactNode | undefined;
  showCart?: boolean;
};

type Handler = (...evts: any[]) => void;

const MainLayout: FC<Props> = ({ children }): JSX.Element => {
  const {
    appSetting: { sideMenuOpen, url, previousUrl, method },
    customer: { userAgent },
    locale,
    branch,
    area,
    branch: { id: branch_id },
    area: { id: area_id },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (router.locale !== locale.lang) {
      dispatch(setLocale(router.locale));
    }
    if (router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale);
    }
    setLang(router.locale);
  }, [router.locale]);

  return (
    <div
      dir={router.locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${
        router.locale === 'ar' ? gessFont : arboriaFont
      } flex-col justify-start items-start grow  lg:flex lg:flex-row flex flex-row h-screen  capitalize`}
    >
      {children}
    </div>
  );
};

export default MainLayout;