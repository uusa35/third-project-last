import {
  alexandriaFont,
  alexandriaFontBold,
  alexandriaFontLight,
  alexandriaFontMeduim,
  alexandriaFontSemiBold,
  suppressText,
} from '@/constants/*';
import { useGetUpcomingOrdersQuery } from '@/redux/api/orderApi';
import { useAppSelector } from '@/redux/hooks';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { AppQueryResult, UpcomingOrders } from '@/types/queries';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DeliveryIcon from '@/appIcons/order_status_delivery.svg';
import PreparingIcon from '@/appIcons/order_status_preparing.svg';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

type Props = {};

export default function UpcomingOrders({}: Props) {
  const { t } = useTranslation();
  const {
    locale: { lang },
    appSetting: { url },
  } = useAppSelector((state) => state);
  const desObject = useAppSelector(destinationHeaderObject);

  const { data, isSuccess, isLoading } = useGetUpcomingOrdersQuery<{
    data: AppQueryResult<UpcomingOrders[]>;
    isSuccess: boolean;
    isLoading: boolean;
  }>({
    lang,
    destination: desObject,
    url,
  });
  return (
    <div className="px-4 my-3">
      <p
        className={`${alexandriaFontBold} mb-3 mt-5 text-lg`}
        suppressHydrationWarning={suppressText}
      >
        Your Upcoming Order
      </p>

      <div className={`border-2 border-[#E8E5E3] rounded-md p-5`}>
        <div className="flex items-center justify-between text-[#544A45] text-xs border-b border-dashed border-[#E8E5E3] pb-3 mb-3">
          <p
            className={`${alexandriaFont}`}
            suppressHydrationWarning={suppressText}
          >
            25 Jan,2023 - 9:55PM
          </p>
          <p
            className={`${alexandriaFontSemiBold}`}
            suppressHydrationWarning={suppressText}
          >
            65.00 KD
          </p>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-x-2">
            <DeliveryIcon />
            <div className={`text-[#544A45] text-xs ${alexandriaFontLight}`}>
              <p
                className={`${alexandriaFontMeduim}`}
                suppressHydrationWarning={suppressText}
              >
                25 Jan,2023 - 9:55PM
              </p>
              <p suppressHydrationWarning={suppressText}>
                25 Jan,2023 - 9:55PM
              </p>
              <p suppressHydrationWarning={suppressText}>65.00 KD</p>
            </div>
          </div>
          <button
            className={`bg-[#F3F2F2] text-[#1A1615] h-fit rounded-full px-2 text-xs ${alexandriaFontSemiBold}`}
          >
            {t('track_order')}
          </button>
        </div>
      </div>
    </div>
  );
}
