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
import { appLinks, suppressText } from '@/constants/*';
import Link from 'next/link';
import { Order } from '@/types/index';
import { filter, isEmpty, isObject, isUndefined, map } from 'lodash';

type Props = {
  order: Order
};

export default function GuestOrderStatus({ order }: Props) {
  const handelDisplayAddress = () => {
    if (order?.customer && !isUndefined(order?.customer?.address) && isObject(order?.customer.address?.address)) {
      const addressValues = !isUndefined(order.customer?.address) && Object.values(order.customer.address?.address)
        .filter(value => value !== null); 
  
      const allAddress = addressValues ? addressValues.join(', ') : ''; 
  
      return allAddress;
    }
    else {
      const addressValues  = order?.customer?.address?.address;
      return addressValues;
    }
  };
  
  

  console.log({ order })
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
    p3 = ''
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
      </div>
    );
  };

  return (
    <div>
      <DetailComponent
        icon={<OfficeIcon />}
        p1="your_address"
        p2={order?.customer?.address?.address?.type}
        p3={handelDisplayAddress()}
      />
      <DetailComponent
        icon={<ContactsIcon />}
        p1="contact_info"
        p2={`${order.customer.name}, ${order.customer.phone}`}
      />

      <DetailComponent
        icon={<ClockIcon />}
        p1="delivery_time"
        p2={order.delivery_date_time.replace(",", " ")}
      />
    </div>
  );
}
