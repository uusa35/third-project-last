import React from 'react';
import Salenotification from '@/appIcons/sale_notification.svg';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import { suppressText } from '@/constants/*';
import { LinearProgress } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';

type Props = {};

export default function SaleNotification({}: Props) {
  const { t } = useTranslation();
  const {
    searchParams: { method },
  } = useAppSelector((state) => state);
  return (
    <>{method ==='delivery'&&
<div>
      <div className="bg-[#F5F5F5] text-xs py-4 px-3">
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <Salenotification />
            <div>
              {/* <p className="font-bold" suppressHydrationWarning={suppressText}>
                {t('save_on_orders_above')}
              </p> */}
              <p
                className="text-[#544A45]"
                suppressHydrationWarning={suppressText}
              >
                Add 18 KD to your cart to free delivery !
              </p>
            </div>
          </div>
          <Close />
        </div>
      </div>
      <LinearProgress variant="determinate" value={(100 * 18) / 20} />
    </div>
    }</>
    
  );
}
