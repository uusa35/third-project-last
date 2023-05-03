import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
// active 
// msg above the btn
// price 
// qty
};

export default function CheckoutFixedBtn({}: Props) {
  const { t } = useTranslation();
  const { color } = useAppSelector(themeColor);
  return (
    <div>
      <div className="h-28"></div>
      {/* sticky fooer */}
      <div className="fixed bottom-0 w-full lg:w-2/4 xl:w-1/3  border-t bg-white text-white  p-5">
        {/* checkout btn */}
        <div
          className="flex items-center gap-x-2 justify-between rounded-full w-full py-2 px-4"
          style={{ color }}
        >
          <div className="flex items-center gap-x-3">
            <div className="flex items-center justify-center rounded-full w-8 h-8 bg-red-800">
              12
            </div>
            <div>{t('go_to_checkout')}</div>
          </div>

          <div>120 {t('kwd')}</div>
        </div>
      </div>
    </div>
  );
}
