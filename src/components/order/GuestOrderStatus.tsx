import React, { FC, ReactNode } from 'react';
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

const GuestOrderStatus:FC<Props> = ({ order }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang, otherLang },
    searchParams: { method }
  } = useAppSelector((state) => state);

  const handelDisplayAddress = () => {
    if (order?.customer && !isUndefined(order?.customer?.address) && isObject(order?.customer.address?.address)) {
      const addressValues = !isUndefined(order.customer?.address) && Object.values(order.customer.address?.address)
        .filter(value => value !== null); 
  
      const allAddress = addressValues ? addressValues.join(', ') : ''; 
  
      return allAddress;
    }
  };
  
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
              className="text-[#B7B1AE] pb-1 uppercase flex justify-between items-center"
            >
              <span>{t(p1)}</span>
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
      {isObject(order?.customer.address?.address) && (
        <DetailComponent
          icon={<OfficeIcon />}
          p1={order?.orderType === 'delivery' ? 'your_address' : 'branch_address'}
          p2={order?.orderType === 'delivery' ? order?.customer?.address?.address?.type : order.branch_address}
          p3={handelDisplayAddress()}
        />
      )}
      <DetailComponent
        icon={<ContactsIcon />}
        p1="contact_info"
        p2={`${order.customer.name}, ${order.customer.phone}`}
      />

      <DetailComponent
        icon={<ClockIcon />}
        p1={order.orderType === 'delivery' ? 'delivery_time' : 'pickup_time'}
        p2={order.delivery_date_time.replace(",", " ")}
      />
    </div>
  );
}
export default GuestOrderStatus;
