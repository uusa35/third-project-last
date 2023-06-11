import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { mainBtnClass, toEn } from '@/constants/*';
import moment from 'moment';
import { isArray, isEmpty, isUndefined, map, reverse } from 'lodash';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'moment/locale/ar';
import { suppressText } from '@/constants/*';
import { useLazyGetVendorQuery } from '@/redux/api/vendorApi';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { useLazyGetTimingsQuery } from '@/redux/api/cartApi';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { setPreferences } from '@/redux/slices/customerSlice';
import { Router, useRouter } from 'next/router';
import ContentLoader from '@/components/skeletons';

// check availability in case no date will return else will just navigate to checkout.
type Day = {
  day: string;
  date: string;
};
type Props = {
  url: string;
  days: Day[];
  selectedDay: Day;
  handleDaySelect: (day: Day) => void;
  method: 'pickup | delivery';
};

const Time: NextPage<Props> = ({ url, method }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const color = useAppSelector(themeColor);
  const desObject = useAppSelector(destinationHeaderObject);
  const {
    locale: { lang, isRTL },
    searchParams: { destination_type },
  } = useAppSelector((state) => state);
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();
  const [triggerGetTimings, { data: timings, isSuccess: timingsSuccess }] =
    useLazyGetTimingsQuery();
  const [sliderSettings, setSliderSettings] = useState<Settings>({
    dots: false,
    infinite: false,
    slidesToScroll: isRTL ? 1 : 4,
    initialSlide: isRTL ? 2 : 0,
    rtl: isRTL,
    slidesToShow: 4,
    autoplay: false,
  });
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState({ day: ``, date: `` });
  const [isBtnEnabled, setIsBtnEnabled] = useState<boolean>(true);
  const [selectedHour, setSelectedHour] = useState<string | undefined>(
    undefined
  );
  const [type, setType] = useState<
    'delivery_now' | 'delivery_later' | 'pickup_now' | 'pickup_later'
  >('delivery_now');
  moment.locale(lang);
  const today = moment();
  const days: Day[] = [];
  const daysInCurrentMonth = today.daysInMonth();

  useEffect(() => {
    triggerGetVendor(
      {
        lang,
        url,
        destination: desObject,
      },
      false
    );
    if (!isEmpty(method) && method === 'delivery') {
      setType('delivery_now');
    } else if (!isEmpty(method) && method === 'pickup') {
      setType('pickup_now');
    }
  }, []);

  for (let i = 0; i < 31; i++) {
    const day = moment().startOf('day').add(i, 'days');
    const isToday = i === 0 || day.isSame(today, 'day');
    const isTomorrow =
      i === 1 || day.isSame(today.clone().add(1, 'day'), 'day');
    const isWithinNextMonth =
      day.isSameOrAfter(today, 'day') &&
      day.isBefore(today.clone().add(1, 'month'));

    if (isToday) {
      days.push({ day: `${t('today')}`, date: day.format('DD MMM Y') });
    } else if (isTomorrow) {
      days.push({ day: `${t('tomorrow')}`, date: day.format('DD MMM Y') });
    } else if (isWithinNextMonth && day.date() <= daysInCurrentMonth) {
      days.push({ day: day.format('dddd'), date: day.format('DD MMM Y') });
    }
  }

  useEffect(() => {
    setSelectedDay({ day: days[0].day, date: days[0].date });
    if (isScheduled) {
      setIsBtnEnabled(false);
      if (!isEmpty(method) && method === 'delivery') {
        setType('delivery_later');
      } else if (!isEmpty(method) && method == 'pickup') {
        setType('pickup_later');
      }
    } else {
      setIsBtnEnabled(true);
      setSelectedHour(moment().format('HH:mm a').toString());
      if (!isEmpty(method) && method === 'delivery') {
        setType('delivery_now');
      } else if (!isEmpty(method) && method === 'pickup') {
        setType('pickup_now');
      }
    }
  }, [isScheduled]);

  useEffect(() => {
    triggerGetTimings(
      {
        type,
        date: toEn(moment(selectedDay?.date).format('YYYY-MM-DD')),
        area_branch: desObject,
        url,
      },
      false
    ).then((r) => {
      if (r?.error && r.error.data) {
        setIsBtnEnabled(false);
        setSelectedHour(undefined);
        dispatch(
          showToastMessage({ type: 'error', content: `no_timings_available` })
        );
      } else if (r && r.data && r.data.Data) {
        setIsBtnEnabled(true);
        if (
          r.data.Data === 'OPEN' &&
          (type === 'delivery_now' || type === 'pickup_now')
        ) {
          setSelectedHour(moment().format('HH:mm a').toString());
        } else {
          setSelectedHour(r.data.Data[0]);
        }
      }
    });
  }, [selectedDay]);

  useEffect(() => {
    if (!isUndefined(selectedHour)) {
      setIsBtnEnabled(true);
    }
  }, [selectedHour]);

  const handleRadioChange = (value: string) => {
    setIsScheduled(value === 'scheduled');
  };

  const handleDaySelect = ({ day, date }: { day: string; date: string }) => {
    setSelectedDay({ day, date });
  };

  const handleClick = () => {
    dispatch(
      setPreferences({
        date: toEn(moment(selectedDay?.date).format('YYYY-MM-DD')),
        time: selectedHour,
        type,
      })
    );
    // put other scenario here if you want
    router.back();
  };

  if (!vendorSuccess)
    return (
      <MainContentLayout>
        <ContentLoader type="AreaBranch" sections={8} />
      </MainContentLayout>
    );

  return (
    <Suspense>
      <MainHead
        title={t('scheduled_order')}
        description={`${t('scheduled_order')}`}
      />
      <MainContentLayout
        url={url}
        showBackBtnHeader
        currentModule="select_time"
      >
        <div className="p-5 w-full overflow-x-hidden">
          <label className="flex items-center w-full pt-2 pb-4 border-b-2 border-gray-100">
            <input
              id="now"
              name="time"
              type="radio"
              value="now"
              checked={!isScheduled}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="h-4 w-4 me-1"
              style={{ accentColor: color }}
              suppressHydrationWarning={suppressText}
            />
            <span className={`font-bold mx-4`}>
              {`${t('now_within')} ${
                vendorElement?.Data?.delivery?.delivery_time
              } ${t('minutes')}`}
            </span>
          </label>
          <label className="flex items-center w-full py-4">
            <input
              type="radio"
              name="time"
              value="scheduled"
              checked={isScheduled}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="h-4 w-4 me-1"
              style={{ accentColor: color }}
              suppressHydrationWarning={suppressText}
            />
            <span className={`font-bold mx-4`}>{t('scheduled_order')}</span>
          </label>
          {isScheduled && (
            <div className={`overflow-x-auto flex flex-row`}>
              {map(days, (day, index) => (
                <div className="p-2 ps-0" key={index}>
                  <div
                    className={`w-[96px] h-20 p-2 flex flex-col justify-center items-center text-center rounded-lg capitlalize ${
                      selectedDay.date === day.date && 'text-white'
                    }`}
                    style={{
                      backgroundColor: `${
                        selectedDay.date === day.date ? color : '#F5F5F5'
                      }`,
                    }}
                  >
                    <button
                      className="capitalize flex flex-col justify-center items-center"
                      onClick={() =>
                        handleDaySelect({ day: day.day, date: day.date })
                      }
                    >
                      <span className="flex text-md">{day.day}</span>
                      <span className="flex flex-row text-md">
                        {moment(day.date).format('DD MMM')}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isScheduled && (
            <div>
              {timings && timingsSuccess && isArray(timings.Data) && (
                <div className="w-100 space-y-4 mt-4">
                  {map(timings.Data, (time, i) => (
                    <label key={i} className="flex items-center w-full">
                      <input
                        type="radio"
                        name="hour"
                        value={time}
                        checked={selectedHour === time}
                        onChange={() => setSelectedHour(time)}
                        className="h-4 w-4 me-1"
                        style={{ accentColor: color }}
                      />
                      <span className="mx-2">{time}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* {`${t('now_within')} ${
                vendorElement?.Data?.delivery?.delivery_time
              } ${t('minutes')}`} */}
        <div className="flex justify-center px-5">
          <button
            onClick={() => handleClick()}
            className={`${mainBtnClass} mb-5`}
            disabled={!isBtnEnabled}
            style={{
              backgroundColor: color,
              color: `white`,
            }}
          >
            <span suppressHydrationWarning={suppressText}>{t('set_time')}</span>
            <span
              className="px-1 inline-block"
              suppressHydrationWarning={suppressText}
            >
              {isScheduled && timings && timings.Data && !isEmpty(timings?.Data)
                ? `${selectedDay.day} ${
                    selectedDay.day !== 'اليوم' && selectedDay.day !== 'today'
                      ? selectedDay.date
                      : ''
                  } ${selectedHour ?? ``}`
                : `${t('now_within')} ${
                    vendorElement?.Data?.delivery?.delivery_time
                  } ${t('minutes')}`}
            </span>
          </button>
        </div>
      </MainContentLayout>
    </Suspense>
  );
}
export default Time;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      console.log('query', query.method !== 'pickup');
      const { method }: any = query;
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      if (method === `pickup` || method === `delivery`) {
        return {
          props: {
            url: req.headers.host,
            method: query.method,
          },
        };
      } else {
        return { notFound: true }; 
      }
    }
);
