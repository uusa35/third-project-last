import { AddressTypes, UserAddressFields } from '@/types/index';
import {
  CottageOutlined,
  BusinessOutlined,
  WorkOutlineTwoTone,
} from '@mui/icons-material';
import ApartmentIcon from '@/appIcons/apartment.svg';
import OfficeIcon from '@/appIcons/office.svg';
import HomeActive from '@/appIcons/home_active.svg';
import ApartmentActive from '@/appIcons/apartment_active.svg';
import OfficeActive from '@/appIcons/office_active.svg';
import {
  HomeIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { FC, useEffect, useMemo, useState } from 'react';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  useCreateAddressMutation,
  useLazyGetAddressesQuery,
} from '@/redux/api/addressApi';
import { AppQueryResult } from '@/types/queries';
import { difference, filter, first, isNull, lowerCase, map } from 'lodash';
import { useRouter } from 'next/router';
import { appLinks } from '@/constants/*';
import { setCustomerAddressType } from '@/redux/slices/customerSlice';

type Props = {
  currentAddressType: AddressTypes;
  userId: string;
  url: string;
};
const MainAddressTabs: FC<Props> = ({ currentAddressType, userId, url }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [remainingTypes, setRemainingTypes] = useState<[AddressTypes] | null>(
    null
  );
  const [allTypes, setAllTypes] = useState<
    {
      id: string | null;
      type: AddressTypes;
      icon: any;
      edit: boolean;
    }[]
  >([
    { id: null, type: 'HOUSE', icon: <HomeIcon />, edit: false },
    { id: null, type: 'APARTMENT', icon: <BuildingOffice2Icon />, edit: false },
    { id: null, type: 'OFFICE', icon: <BriefcaseIcon />, edit: false },
  ]);

  const [triggerGetAddresses, { data: addresses, isSuccess }] =
    useLazyGetAddressesQuery<{
      data: AppQueryResult<UserAddressFields[]>;
      isLoading: boolean;
    }>();

  useMemo(() => {
    triggerGetAddresses({ url }, false).then((r: any) => {
      if (r && r.data && r.data.data) {
        const types: [AddressTypes] | any = difference(
          map(allTypes, 'type'),
          map(r.data.data, 'type')
        );
        if (types && types.length > 0) {
          setRemainingTypes(types);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const updated = map(allTypes, (a) => {
        if (isNull(remainingTypes) || remainingTypes.length <= 3) {
          const currentAddress: any = first(
            filter(addresses.data, (c) => c.type === a.type)
          );
          return {
            ...a,
            id: currentAddress ? currentAddress.id : null,
            edit: true,
          };
        } else {
          return a;
        }
      });
      setAllTypes(updated);
    }
  }, [remainingTypes]);

  const handleCreateAddress = (type: AddressTypes) => {
    return router
      .replace(appLinks.createAuthAddress(userId, lowerCase(type)))
      .then((r) => dispatch(setCustomerAddressType(type)));
  };

  const handleEditAddress = (type: AddressTypes, addressId: string) => {
    return router
      .replace(appLinks.editAuthAddress(userId, addressId, lowerCase(type)))
      .then((r) => dispatch(setCustomerAddressType(type)));
  };

  if (!isSuccess) return null;
  // console.log('reamining', remainingTypes);
  // console.log('allTypes', allTypes);
  return (
    <div className="flex mx-3 flex-row justify-center items-start mb-4">
      {map(allTypes, (a, i) => (
        <button
          key={i}
          onClick={() =>
            a.edit && !isNull(a.id)
              ? handleEditAddress(a.type, a.id)
              : handleCreateAddress(a.type)
          }
          className={`flex flex-1 flex-col border justify-center items-center p-3 rounded-md capitalize ${
            i === 1 && `mx-2`
          }`}
          style={{ borderColor: currentAddressType === a.type && color }}
        >
          <HomeIcon
            className={`w-8 h-8 `}
            color={currentAddressType === a.type ? color : `text-stone-400`}
          />
          <p>{t(a.type)}</p>
        </button>
      ))}
    </div>
  );
};

export default MainAddressTabs;
