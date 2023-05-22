import React, { ReactNode } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import OfficeIcon from '@/appIcons/office_checkout.svg';
import HouseIcon from '@/appIcons/house_checkout.svg';
import ApartmentIcon from '@/appIcons/apartment_checkout.svg';
import AddressIcon from '@/appIcons/address_checkout.svg';
import RemarksIcon from '@/appIcons/remarks_checkout.svg';
import ContactsIcon from '@/appIcons/contacts_checkout.svg';
import ClockIcon from '@/appIcons/time_checkout.svg';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { appLinks, suppressText } from '@/constants/*';
import Link from 'next/link';

type Props = {
  OrderStatus?: boolean;
};

export default function OrderDetails({ OrderStatus = false }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang, otherLang },
    customer: {
      name,
      phone,
      notes,
      address: { type: address_type },
    },
    searchParams: { method },
  } = useAppSelector((state) => state);

  const DetailComponent = ({
    icon,
    p1,
    p2,
    p3 = '',
    editPath = '#',
    onclick = () => {},
  }: {
    icon: ReactNode;
    p1: string;
    p2: string;
    p3?: string;
    editPath?: string;
    onclick?: () => void;
  }) => {
    return (
      <div
        onClick={() => onclick()}
        className="flex justify-between items-center gap-x-2 py-2 text-xs cursor-pointer"
      >
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
        {OrderStatus ? (
          <></>
        ) : // <Link href={editPath}>
        //   <p suppressHydrationWarning={suppressText}>{t('edit')}</p>
        // </Link>
        router.locale === 'en' ? (
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
        onclick={() =>
          method === 'delivery'
            ? router.push(appLinks.addressCreate.path)
            : router.push(appLinks.selectBranch.path)
        }
        icon={
          method === 'pickup' ? (
            <AddressIcon />
          ) : (
            {
              [0]: <ApartmentIcon />,
              ['HOUSE']: <HouseIcon />,
              [2]: <ApartmentIcon />,
              [3]: <OfficeIcon />,
            }[address_type as string]
          )
        }
        p1={method === 'delivery' ? 'your_address' : 'branch_address'}
        p2={
          method === 'delivery'
            ? {
                [0]: '',
                ['HOUSE']: 'house',
                [2]: 'apartment',
                [3]: 'office',
              }[address_type as number]
            : ''
        }
        p3="Kuwait city,25 El-Gallal St , building 2 ,floor 2 , office 1"
        editPath={OrderStatus ? `${appLinks.cart.path}` : '#'}
      />
      <DetailComponent
        onclick={() => {
          router.push(appLinks.mobileVerification.path);
        }}
        icon={<ContactsIcon />}
        p1="contacts_info"
        p2={`${name} , ${phone}`}
        editPath={OrderStatus ? `${appLinks.cart.path}` : '#'}
      />

      <DetailComponent
        onclick={() => router.push(appLinks.selectTime.path)}
        icon={<ClockIcon />}
        p1={
          {
            ['delivery']: 'delivery_time',
            ['pickup']: 'pickup_time',
          }[method as string]
        }
        p2="Today 11:00 AM - 2:00 AM"
        editPath={OrderStatus ? `${appLinks.cart.path}` : '#'}
      />

      <DetailComponent
        // onclick={() => router.push(appLinks.addressCreate.path)}
        icon={<RemarksIcon />}
        p1="special_remarks"
        p2={`${notes ? notes : 'no_notes_added'}`}
        editPath={OrderStatus ? `${appLinks.cart.path}` : '#'}
      />
    </div>
  );
}
