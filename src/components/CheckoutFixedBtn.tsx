import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { suppressText } from '../constants';
import ScheduelStatusIcon from '@/appIcons/status_home_scheduel.svg';
import PrepareStatusIcon from '@/appIcons/status_home_prepare.svg';
import DeliveryStatusIcon from '@/appIcons/status_home_delivery.svg';
import ArrowUpStatusIcon from '@/appIcons/status_home_up_arrow.svg';

type Props = {
  // active
  // msg above the btn
  // price
  // qty
};

export default function CheckoutFixedBtn({}: Props) {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  return (
    <div>
      <div className="h-28"></div>
      {/* sticky fooer */}
      <div className="fixed bottom-0 w-full lg:w-2/4 xl:w-1/3  border-t bg-white text-white  p-5">
        {/* checkout btn */}
        <div
          className="flex items-center gap-x-2 justify-between rounded-full w-full py-2 px-4"
          style={{ backgroundColor: color }}
        >
          <div className="flex items-center gap-x-3">
            <div
              suppressHydrationWarning={suppressText}
              className="flex items-center justify-center rounded-full w-8 h-8 bg-red-800"
            >
              12
            </div>
            <div suppressHydrationWarning={suppressText}>
              {t('go_to_checkout')}
            </div>
          </div>

          <div suppressHydrationWarning={suppressText}>120 {t('kwd')}</div>
        </div>

        {/* order status  btn*/}
        <div
          className="flex items-center gap-x-2 justify-between rounded-full text-white w-full py-2 px-4 my-3"
          style={{ backgroundColor: color }}
        >
          <div className="flex items-center gap-x-2">
            <div>
              <DeliveryStatusIcon />
            </div>
            <div>
              <p suppressHydrationWarning={suppressText} className="">
                Order Ready For Deliver
              </p>
              <p suppressHydrationWarning={suppressText} className="text-xs">
                Estimated Time 2:00-2:30 PM
              </p>
            </div>
          </div>
          <div>
            <ArrowUpStatusIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
