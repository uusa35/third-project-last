import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { FC, ReactNode, Suspense, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';
import { appLinks, setLang, suppressText } from '../constants';
import Link from 'next/link';
import { ShoppingBagOutlined } from '@mui/icons-material';
import { setLocale } from '@/redux/slices/localeSlice';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { useTranslation } from 'react-i18next';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { themeColor } from '@/redux/slices/vendorSlice';
import { West, East } from '@mui/icons-material';

type Props = {
  backHome: boolean;
  backRoute?: string | null;
  offset: number;
};

const BackBtn: FC<Props> = ({
  backHome,
  backRoute = null,
  offset
}): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    appSetting: { currentModule },
    locale: { lang, otherLang },
  } = useAppSelector((state) => state);

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

  return (
    <Suspense>
      <div
        className={`${
          offset < 80 ? `block` : `hidden`
        } flex w-full my-3 justify-evenly items-center rounded-md py-4 px-4`}
      >
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
            className={`text-md capitalize truncate overflow-hidden max-w-md font-semibold`}
            suppressHydrationWarning={suppressText}
            style={{ maxWidth: '20ch', textOverflow: 'truncate' }}
          >
            {t(currentModule)}
          </span>
        </div>
      </div>
    </Suspense>
  );
};

export default BackBtn;
