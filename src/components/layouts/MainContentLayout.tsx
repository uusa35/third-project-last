import { FC, ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import OffLineWidget from '@/widgets/OffLineWidget';
import NoInternet from '@/appImages/no_internet.png';
import NextNProgress from 'nextjs-progressbar';
import { themeColor } from '@/redux/slices/vendorSlice';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { isUndefined } from 'lodash';
import { scrollClass, suppressText } from '@/constants/*';
// import ScrollToTopButton from '@/components/ScrollToTopButton';
const AppHeader = dynamic(() => import(`@/components/AppHeader`), {
  ssr: false,
});
const AppFooter = dynamic(() => import(`@/components/AppFooter`), {
  ssr: false,
});
const SideMenu = dynamic(() => import(`@/components/SideMenu`), {
  ssr: false,
});

type Props = {
  children: ReactNode | undefined;
  url?: string;
  backHome?: boolean;
  hideBack?: boolean;
  showMotion?: boolean;
  backRoute?: string | null;
  backChildren?: ReactNode | undefined;
  handleSubmit?: (element?: any) => void | undefined | Promise<any>;
  handleIncreaseProductQty?: () => void;
  handleDecreaseProductQty?: () => void;
  productCurrentQty?: number | undefined;
  productOutStock?: boolean | undefined;
};

const MainContentLayout: FC<Props> = ({
  children,
  backHome = false,
  hideBack = false,
  backRoute = null,
  backChildren,
  showMotion = true,
  handleSubmit,
  handleIncreaseProductQty,
  handleDecreaseProductQty,
  productCurrentQty,
  productOutStock,
  url,
}): JSX.Element => {
  const {
    appSetting: { showHeader, url: appUrl, showFooterElement },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const [isOnline, setIsOnline] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  useEffect(() => {
    if (appUrl !== url && !isUndefined(url)) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col justify-start items-start w-full lg:w-2/4 xl:w-1/3 relative`}
      suppressHydrationWarning={suppressText}
    >
      <SideMenu />
      {showHeader && <AppHeader backHome={backHome} backRoute={backRoute} backChildren={backChildren} />}
      <main
        className={`w-full ${
          showFooterElement === `home` ? `mb-0` : `mb-[20%]`
        } relative rounded-t-full min-h-screen `}
        style={{ height: '100%' }}
      >
        {isOnline ? (
          children
        ) : (
          <OffLineWidget
            message={`network_is_not_available_please_check_your_internet`}
            img={`${NoInternet.src}`}
          />
        )}
      </main>
      {/* <ScrollToTopButton /> */}
      {/* <AppFooter
        handleSubmit={handleSubmit}
        handleIncreaseProductQty={handleIncreaseProductQty}
        handleDecreaseProductQty={handleDecreaseProductQty}
        productCurrentQty={productCurrentQty}
        productOutStock={productOutStock}
      /> */}
      <NextNProgress
        color={color}
        startPosition={0.3}
        stopDelayMs={200}
        height={5}
        showOnShallow={true}
        options={{
          // template: `<div class="bar" role="progressbar" aria-role="Changing page" style="background-color: ${color}"></div>`,
          // barSelector: '[role="progressbar"]',
          showSpinner: false,
        }}
      />
    </motion.div>
  );
};

export default MainContentLayout;
