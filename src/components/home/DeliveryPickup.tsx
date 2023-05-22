import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useState } from 'react';
import DeliveryIcon from '@/appIcons/delivery animation.json';
import PickupIcon from '@/appIcons/pick up animation.json';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRouter } from 'next/router';
import TextTrans from '../TextTrans';
import { suppressText } from '@/constants/*';
import { Player } from '@lottiefiles/react-lottie-player';
import { setAreaBranchModelStatus } from '@/redux/slices/modelsSlice';
import ChangeMoodModal from '../modals/ChangeMoodModal';

type Props = { url: string };

function DeliveryPickup({ url }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    searchParams: { method, destination },
    customer: {
      prefrences: { type: prefType, date, time },
    },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();

  return (
    <div className="px-4">
      {(method === 'pickup' || method === 'delivery') && (
        <div className="flex gap-x-2 text-sm cursor-pointer">
          {method === 'pickup' && (
            <Player
              src={PickupIcon}
              className="player w-10 h-10 bg-blue-100 rounded-full"
              style={{
                borderRadius: '100%',
                backgroundColor: '#F3F2F2',
                padding: '8px',
              }}
              loop={true}
              autoplay={true}
            />
          )}
          {method === 'delivery' && (
            <Player
              src={DeliveryIcon}
              className="player w-10 h-10 bg-blue-100 rounded-full"
              style={{
                borderRadius: '100%',
                backgroundColor: '#F3F2F2',
                padding: '8px',
              }}
              loop={true}
              autoplay={true}
            />
          )}

          <div className="flex items-end justify-between w-full">
            {method === 'pickup' && (
              <div>
                <p className="text-xs" suppressHydrationWarning={suppressText}>
                  {
                    {
                      ['pickup_now']: t('pickup_now'),
                      ['pickup_later']: `${t('pickup_later')} ${date} ${time}`,
                      ['']: t('pickup_from'),
                    }[prefType as string]
                  }
                </p>
                <div className="flex items-center">
                  <TextTrans
                    ar={destination.name_ar}
                    en={destination.name_en}
                  />
                  <p suppressHydrationWarning={suppressText}>
                    {' '}
                    , {destination.location}
                  </p>
                </div>
              </div>
            )}

            {method === 'delivery' && (
              <div>
                <p className="text-xs" suppressHydrationWarning={suppressText}>
                  {
                    {
                      ['delivery_now']: t('delivery_now'),
                      ['delivery_later']: t('delivery_later'),
                      ['']: t('deliver_to'),
                    }[prefType as string]
                  }
                </p>
                <TextTrans ar={destination.name_ar} en={destination.name_en} />
              </div>
            )}

            <div
              className="flex items-center"
              onClick={() => dispatch(setAreaBranchModelStatus(true))}
            >
              <p
                suppressHydrationWarning={suppressText}
                style={{ color: color }}
                className="font-bold text-sm"
              >
                {t('change')}
              </p>

              {router.locale === 'en' ? (
                <KeyboardArrowRight
                  style={{ color: color, fontSize: 16, textAlign: 'center' }}
                />
              ) : (
                <KeyboardArrowLeft
                  style={{ color: color, fontSize: 16, textAlign: 'center' }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <ChangeMoodModal url={url} />
    </div>
  );
}

export default DeliveryPickup;
