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
import Slider from 'react-slick';

type Props = {};

export default function UpcomingOrders({}: Props) {
  const { t } = useTranslation();
  const {
    locale: { lang },
    appSetting: { url },
  } = useAppSelector((state) => state);
  const desObject = useAppSelector(destinationHeaderObject);

  const { data, isSuccess, isLoading } = useGetUpcomingOrdersQuery(
    {
      lang,
      destination: desObject,
      url,
    },
    { refetchOnMountOrArgChange: true }
  );

  var settings = {
    // dots: true,
    // className: 'slider variable-width flex',
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    // variableWidth: true,
    centerMode: true,
    centerPadding: '50px 0px 0px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          //   infinite: true,
          //   dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: '30px 0px 0px',
          //   initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '10px 0px 0px',
        },
      },
    ],
  };

  if (!isSuccess) {
    return <p>loading</p>;
  }

  console.log({ data });

  return (
    <div className="px-4 mt-7">
      <p
        className={`${alexandriaFontBold} mb-3 mt-5 text-lg`}
        suppressHydrationWarning={suppressText}
      >
        {t('your_upcoming_order')}
      </p>
      <Slider {...settings}>
        {data.data.map((order) => (
          <div className="px-2">
            <div className={`border-2 border-[#E8E5E3] rounded-md p-5 w-full`}>
              <div className="flex justify-between gap-x-2 text-[#544A45] text-xs border-b border-dashed border-[#E8E5E3] pb-3 mb-3">
                <p
                  className={`${alexandriaFont}`}
                  suppressHydrationWarning={suppressText}
                >
                  {order.created_at}
                </p>
                <p
                  className={`${alexandriaFontSemiBold}`}
                  suppressHydrationWarning={suppressText}
                >
                  {order.total} {t("kd")}
                </p>
              </div>

              <div className="flex justify-between gap-2 flex-wrap md:flex-nowrap">
                <div className="flex gap-x-2">
                  <div>
                    {order.order_type === 'pickup_later' ||
                    order.order_type === 'pickup_now' ? (
                      <PreparingIcon />
                    ) : (
                      <DeliveryIcon />
                    )}
                  </div>

                  <div
                    className={`text-[#544A45] text-xs ${alexandriaFontLight}`}
                  >
                    <p
                      className={`${alexandriaFontMeduim}`}
                      suppressHydrationWarning={suppressText}
                    >
                      {order.order_status}
                    </p>
                    <p suppressHydrationWarning={suppressText}>
                      {t('order_id')} : #{order.order_code}
                    </p>
                    <p suppressHydrationWarning={suppressText}>
                      {t('estimated_time')} {order.estimated_time}
                    </p>
                  </div>
                </div>
                <div className="flex md:block justify-end w-full md:w-auto">
                  <button
                    className={`whitespace-nowrap bg-[#F3F2F2] text-[#1A1615] h-fit rounded-full px-2 text-xxs ${alexandriaFontSemiBold}`}
                  >
                    {t('track_order')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
