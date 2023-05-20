import React from 'react';
import CustomImage from '../CustomImage';
import Link from 'next/link';
import { appLinks, suppressText } from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import EmptyCartImage from '@/appImages/empty_cart.svg';

type Props = {};

export default function EmptyCart({}: Props) {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  return (
    <div className="flex flex-col items-center justify-center p-5">
      {/* <EmptyCartImage /> */}
      {/* <CustomImage
        src={EmptyCartImage.src}
        alt="empty_cart"
        className="w-2/3 h-auto my-5 px-3"
        width={100}
        height={100}
      /> */}
      <div className="capitalize text-center">
        <p suppressHydrationWarning={suppressText} className="font-bold pb-1">
          {t('your_cart_is_empty')}
        </p>
        <p
          suppressHydrationWarning={suppressText}
          className="text-[#544A45] text-sm mb-5"
        >
          {t('add_some_items_to_your_cart')}
        </p>

        <Link
          href={appLinks.home.path}
          scroll={true}
          className={`w-full text-sm px-4 py-2 text-white rounded-full`}
          style={{ backgroundColor: color }}
        >
          {t('continue_shopping')}
        </Link>
      </div>
    </div>
  );
}
