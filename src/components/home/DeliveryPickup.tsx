import { useAppSelector } from '@/redux/hooks';
import React, { useState } from 'react';
import DeliveryIcon from '@/appIcons/delivery_home.svg';
import PickupIcon from '@/appIcons/pickup_home.svg';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRouter } from 'next/router';
import ChangeMoodModal from '../modals/ChangeMoodModal';

type Props = {};

function DeliveryPickup({}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    searchParams: { method },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);

  const [openPickupDeliveryModal, setOpenPickupDeliveryModal] = useState(false);

  return (
    <div className="px-4">
      {method === 'pickup' && (
        <div className="flex gap-x-2 text-sm cursor-pointer">
          <PickupIcon />
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
      )}
      {method === 'delivery' && (
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
      )}

      <ChangeMoodModal
        isOpen={openPickupDeliveryModal}
        onRequestClose={() => setOpenPickupDeliveryModal(false)}
      />
    </div>
  );
}

export default DeliveryPickup;
