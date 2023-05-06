import React, { ReactNode } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import OfficeIcon from '@/appIcons/office_checkout.svg';
import RemarksIcon from '@/appIcons/remarks_checkout.svg';
import ContactsIcon from '@/appIcons/contacts_checkout.svg';
import ClockIcon from '@/appIcons/time_checkout.svg';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { suppressText } from '@/constants/*';

type Props = {};

export default function OrderDetails({}: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang, otherLang },
  } = useAppSelector((state) => state);

  const DetailComponent = ({
    icon,
    p1,
    p2,
    p3 = '',
  }: {
    icon: ReactNode;
    p1: string;
    p2: string;
    p3?: string;
  }) => {
    return (
      <div className="flex justify-between items-center gap-x-2 py-2 text-xs">
        <div className="flex gap-x-3">
          {icon}
          <div>
            <p
              suppressHydrationWarning={suppressText}
              className="text-[#B7B1AE] pb-1"
            >
              {t(p1)}
            </p>
            <p suppressHydrationWarning={suppressText} className="font-bold">
              {t(p2)}
            </p>
            <p
              suppressHydrationWarning={suppressText}
              className="text-[#1A1615]"
            >
              {p3}
            </p>
          </div>
        </div>
        {router.locale === 'en' ? (
          <KeyboardArrowRight className="text-[#A5A5A5]" />
        ) : (
          <KeyboardArrowLeft className="text-[#A5A5A5]" />
        )}
      </div>
    );
  };

  return (
    <div>
      <DetailComponent
        icon={<OfficeIcon />}
        p1="your_address"
        p2="office"
        p3="Kuwait city,25 El-Gallal St , building 2 ,floor 2 , office 1"
      />
      <DetailComponent
        icon={<ContactsIcon />}
        p1="contacts_info"
        p2="Mohaned tark , +966 000 000 00"
      />

      <DetailComponent
        icon={<ClockIcon />}
        p1="delivery_time"
        p2="Today 11:00 AM - 2:00 AM"
      />

      <DetailComponent
        icon={<RemarksIcon />}
        p1="special_remarks"
        p2="Ring No 3 on left"
      />
    </div>
  );
}
