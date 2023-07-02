import { useRouter } from 'next/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { appVersion } from '../constants';
import { useAppSelector } from '@/redux/hooks';

type Props = {};

const AppFooter: FC<Props> = ({}): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <footer className={`w-full px-3 text-center text-xs bg-white`}>
      <p className=" font-bold">{t('rights_reserved')}</p>
      <p className=" py-1 pb-2 text-zinc-500">{t('powered_by_queue')}</p>
      <p className=" py-1 text-zinc-500 text-[8px]">v {appVersion}</p>
    </footer>
  );
};

export default AppFooter;
