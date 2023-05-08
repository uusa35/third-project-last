import { FC, Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { debounce, isNull } from 'lodash';
import { setLang, suppressText } from '@/constants/*';
import Backbtn from '@/appIcons/backbtn.svg';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from '@/redux/hooks';
import { West, East } from '@mui/icons-material';

type Props = {
  backHome?: boolean;
  backRoute?: string | null;
  currentModule?:string;
};
type CurrentModule = 'your_number' | 'otp_verification' | 'account_info';

type ModuleWidths = {
  [key in CurrentModule]: string;
};

const AppHeader: FC<Props> = ({ backHome = false, backRoute = null, currentModule='home' }) => {
  // const [offset, setOffset] = useState(0);
  const router = useRouter();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang, otherLang },
  } = useAppSelector((state) => state);
  const moduleWidths: ModuleWidths = {
    your_number: 'w-1/3',
    otp_verification: 'w-2/3',
    account_info: 'w-full',
  };
  
  
  const widthClass: string = moduleWidths[currentModule as CurrentModule] || '';
  const handleGoHome = () => {
    router.push(`/`, ``, {
      locale: lang,
      scroll: false,
    });
  };
  const handleBack = async () => {
    if (backHome) {
      handleGoHome();
    } else if (!isNull(backRoute)) {
      router.push(`${backRoute}`, undefined, {
        locale: lang,
        scroll: false,
      });
    } else {
      await setLang(lang).then(() => {
        router.back();
      });
    }
  };
  // const {
  //   appSetting: { currentModule },
  // } = useAppSelector((state) => state);

  // const [isHome, setIsHome] = useState(
  //   router.pathname === '/' || router.pathname === '/home'
  // );

  // useEffect(() => {
  //   const onScroll = () => setOffset(window.pageYOffset);
  //   window.addEventListener('scroll', onScroll, { passive: true });
  //   return () => {
  //     window.removeEventListener('scroll', debounce(onScroll, 400));
  //   };
  // }, [router.pathname]);

  return (
    <header
      className={`relative sticky top-0 z-50 w-full capitalize bg-white border-b-2`}
      suppressHydrationWarning={suppressText}
    >
      <div className={`flex items-center py-3 px-2`}>
      <button
          onClick={() => handleBack()}
          className={`flex justify-start items-center pt-1`}
        >
          {router.locale === 'en' ? (
            <West />
          ) : (
            <East />
          )}
      </button>
      <div className={`flex flex-1 justify-center items-center pt-1`}>
        <span
          className={`text-md capitalize truncate font-bold`}
          suppressHydrationWarning={suppressText}
          style={{ maxWidth: '20ch', textOverflow: 'truncate' }}
        >
          {t(currentModule)}
        </span>
      </div>
      </div>
      <div className={`h-[2px] absolute -bottom-[2px] ${widthClass}`} style={{backgroundColor: color}}></div>
    </header>
  );
};

export default AppHeader;
