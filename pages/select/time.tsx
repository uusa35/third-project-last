import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from '@/redux/hooks';
import { mainBtnClass } from '@/constants/*';
import moment from 'moment';
import { isUndefined } from 'lodash';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'moment/locale/ar';
import { suppressText } from '@/constants/*';

type Day = {
  day: string;
  date: string;
};
type Props = {
  url: string;
  days: Day[];
  selectedDay: Day;
  handleDaySelect: (day: Day) => void;
};

export default function index({ url }: Props) {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang, isRTL },
  } = useAppSelector((state) => state);
  console.log({ isRTL });
  const [sliderSettings, setSliderSettings] = useState<Settings>({
    dots: false,
    infinite: true,
    slidesToScroll: isRTL ? 1 : 4,
    initialSlide: isRTL ? 2 : 0,
    rtl: isRTL,
    slidesToShow: 4,
    autoplay: false,
  });
  const [isScheduled, setIsScheduled] = useState(false);
  moment.locale(lang);
  const today = moment();
  const days: Day[] = [];
  const daysInCurrentMonth = today.daysInMonth();

  for (let i = 0; i < 31; i++) {
    const day = moment().startOf('day').add(i, 'days');
    const isToday = i === 0 || day.isSame(today, 'day');
    const isTomorrow =
      i === 1 || day.isSame(today.clone().add(1, 'day'), 'day');
    const isWithinNextMonth =
      day.isSameOrAfter(today, 'day') &&
      day.isBefore(today.clone().add(1, 'month'));

    if (isToday) {
      days.push({ day: `${t('today')}`, date: day.format('DD MMM') });
    } else if (isTomorrow) {
      days.push({ day: `${t('tomorrow')}`, date: day.format('DD MMM') });
    } else if (isWithinNextMonth && day.date() <= daysInCurrentMonth) {
      days.push({ day: day.format('dddd'), date: day.format('DD MMM') });
    }
  }

  const hour = new Date();
  hour.setHours(0);
  hour.setMinutes(0);

  const hours = [...Array(24)].map((_, index) => {
    const newHour = new Date(hour.getTime());
    newHour.setHours(index);
    return newHour.toLocaleString(lang, {
      hour: '2-digit',
      hourCycle: 'h12',
      minute: '2-digit',
    });
  });

  const [selectedDay, setSelectedDay] = useState({ day: ``, date: `` });
  const [selectedHour, setSelectedHour] = useState(``);
  useEffect(() => {
    setSelectedDay({ day: days[0].day, date: days[0].date });
    setSelectedHour(`${hours[0]} - ${hours[1]}`);
  }, [isScheduled, lang]);
  useEffect(() => {
    setSliderSettings((prevSettings) => ({
      ...prevSettings,
      rtl: isRTL,
      slidesToScroll: isRTL ? 1 : 4,
      initialSlide: isRTL ? 2 : 0,
    }));
  }, [isRTL]);
  const handleRadioChange = (value: string) => {
    setIsScheduled(value === 'scheduled');
  };

  const handleDaySelect = ({ day, date }: { day: string; date: string }) => {
    setSelectedDay({ day, date });
    setSelectedHour(hours[0]);
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
  };

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
            {t('now_within_20_minutes')}
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
            {t('scheduled_order')}
          </label>
          {isScheduled && (
            <div>
              <Slider
                key={`slider-${isRTL}-${sliderSettings.slidesToScroll}-${sliderSettings.initialSlide}`}
                {...sliderSettings}
              >
                {days.map((day, index) => (
                  <div className="p-2 ps-0" key={index}>
                    <div
                      className={`w-[90px] h-20 px-2 flex flex-col justify-center items-center text-center rounded-lg ${
                        selectedDay.date === day.date && 'text-white'
                      }`}
                      style={{
                        backgroundColor: `${
                          selectedDay.date === day.date ? color : '#F5F5F5'
                        }`,
                      }}
                    >
                      <button
                        onClick={() =>
                          handleDaySelect({ day: day.day, date: day.date })
                        }
                      >
                        {day.day}
                      </button>
                      <div>
                        <span>{day.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>

              <div>
                {selectedDay && (
                  <div className="w-100">
                    {hours.map((hour, index) => {
                      const nextHour = index + 1;
                      const hourRange = `${hour} - ${
                        isUndefined(hours[nextHour])
                          ? hours[0]
                          : hours[nextHour]
                      }`;
                      return (
                        <label
                          key={index}
                          className="flex items-center w-full pt-2 pb-4"
                        >
                          <input
                            type="radio"
                            name="hour"
                            value={hour}
                            checked={selectedHour === hourRange}
                            onChange={() => setSelectedHour(hourRange)}
                            className="h-4 w-4 me-1"
                            style={{ accentColor: color }}
                          />
                          {hourRange}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center px-5">
          <button
            className={`${mainBtnClass} mb-5 ${!isScheduled ? 'mt-80' : ''}`}
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
              {isScheduled
                ? `${selectedDay.day} ${
                    selectedDay.day !== 'اليوم' && selectedDay.day !== 'today'
                      ? selectedDay.date
                      : ''
                  } ${selectedHour}`
                : `${t('now_within_20_minutes')}`}{' '}
            </span>
          </button>
        </div>
      </MainContentLayout>
    </Suspense>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);
