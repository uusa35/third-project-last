import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useState } from 'react';
import DeliveryIcon from '@/appIcons/delivery animation.json';
import PickupIcon from '@/appIcons/pick up animation.json';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRouter } from 'next/router';
import ChangeMoodModal from '../modals/ChangeMoodModal';
import TextTrans from '../TextTrans';
import { suppressText } from '@/constants/*';
import { Player } from '@lottiefiles/react-lottie-player';
import { setAreaBranchModelStatus } from '@/redux/slices/modelsSlice';

type Props = {};

function DeliveryPickup({}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    searchParams: { method, destination },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();

  const [openPickupDeliveryModal, setOpenPickupDeliveryModal] = useState(false);

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
                <p className='text-xs' suppressHydrationWarning={suppressText}>{t('pickup_from')}</p>
                <TextTrans ar={destination.name_ar} en={destination.name_en} />
              </div>
            )}

            {method === 'delivery' && (
              <div>
                <p className='text-xs' suppressHydrationWarning={suppressText}>{t('deliver_now_to')}</p>
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
      {/* {method === 'delivery' && (
        <div className="flex gap-x-2 text-sm cursor-pointer">
          <DeliveryIcon />
          <div className="flex items-end justify-between w-full">
            <div>
              <p>deliver now to</p>
              <p>jhdkjfkjsdhkjj</p>
            </div>
            <div
              className="flex items-center"
              onClick={() => setOpenPickupDeliveryModal(true)}
            >
              <p style={{ color: color }} className="font-bold">
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
      )} */}
    </div>
  );
}

export default DeliveryPickup;
