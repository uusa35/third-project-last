import { appLinks } from '@/constants/*';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AsideFooter() {
  const { t } = useTranslation();
  return (
    <div
      className={`absolute bottom-0 text-white  text-xs md:text-sm xl:text-md flex flex-1 w-full flex-row justify-between items-center p-4`}
    >
      <div
        className={`flex flex-row gap-x-3 items-center underline underline-offset-2`}
      >
        <Link href={appLinks.returnPolicy.path}>{t('return_policy')}</Link>
        <Link href={appLinks.shippingPolicy.path}>{t('shipping_policy')}</Link>
        <Link href={appLinks.privacyPolicy.path}>{t('privacy_policy')}</Link>
      </div>
      <div className={`flex flex-1 flex-row justify-end items-center`}>
        <Link href={`/`}>{t('powered_by_queue')}</Link>
      </div>
    </div>
  );
}
