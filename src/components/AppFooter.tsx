import { useRouter } from 'next/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {};

const AppFooter: FC<Props> = ({}): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  console.log(router.pathname)

  return (
    <footer className={`w-full px-3 text-center text-xs bg-white`}>
      <p className=" font-bold">{t('rights_reserved')}</p>
      <p className=" py-1 pb-2 text-zinc-500">{t('powered_by_queue')}</p>
    </footer>
  );
};

export default AppFooter;
