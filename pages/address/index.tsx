import MainLayout from '@/layouts/MainLayout';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { UserAddressFields, Vendor } from '@/types/index';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import NoAddresses from '@/appImages/no_address.svg';
import {
  appLinks,
  imageSizes,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import Link from 'next/link';
import { useLazyGetAddressesQuery } from '@/redux/api/addressApi';
import { useEffect, useState } from 'react';
import { AppQueryResult } from '@/types/queries';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { isEmpty, isObject, isUndefined, map } from 'lodash';
import { setCustomerAddress } from '@/redux/slices/customerSlice';
import { useRouter } from 'next/router';

type Props = {
  element: Vendor;
  url: string;
};

const AddressIndex: NextPage<Props> = ({
  element,
  url,
}): React.ReactElement => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { customer: { id, countryCode, name, phone }} = useAppSelector((state) => state);
  const [triggerGetAddresses, { data: addresses, isLoading }, isSuccess] =
    useLazyGetAddressesQuery<{
      data: AppQueryResult<UserAddressFields[]>;
      isLoading: boolean;
    }>();

    useEffect(() => {
      if(url) {
        dispatch(setUrl(url));
      }
      triggerGetAddresses({ url, user_id: id }, false);
    }, []);

    const handelDisplayAddress = (address) => {
      if (address && !isUndefined(address) && isObject(address)) {
        const addressValues = !isUndefined(address) && Object.values(address)
          .filter(value => value !== null); 
    
        const allAddress = addressValues ? addressValues.join(', ') : ''; 
    
        return allAddress;
      }
    };

    const showHideEditBtn = (address) => {
      if (selectedAddress === address) {
        setSelectedAddress(null); // Hide the edit button if already shown
      } else {
        setSelectedAddress(address); // Show the edit button for the clicked address
      }
    };

    const handleEdit = (address) => {
      dispatch(setCustomerAddress(address));
      router.push(`${appLinks.addressCreate.path}`);
    }
    console.log({addresses: addresses?.Data?.address})
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader
      currentModule="my_addresses"
    >
      <div className="relative h-[100vh]">
      {isSuccess && !isEmpty(addresses?.Data?.address) ? (
        <div>
          {map(addresses?.Data?.address, (address) => (
            <div className="flex flex-col w-auto justify-start items-start mx-4 space-y-4" key={address.id}>
            <div className="flex flex-1 flex-col w-auto border-b rounded-md p-3 overflow-hidden w-full text-sm">
              <div className={`flex flex-1 flex-row justify-between items-start`}>
                <div>
                  <h5 className="font-semibold pb-2">{address.type}</h5>
                  <div className="text-zinc-600">
                    <p>
                      {handelDisplayAddress(address?.address)}
                    </p>
                    <p>{name}</p>
                    <p>{countryCode}{phone}</p>
                  </div>
                </div>
                <div
                  className="flex items-center space-x-4"
                >
                  <div className="relative">
                    <div>
                      <EllipsisVerticalIcon className="h-8" onClick={() => showHideEditBtn(address)} />
                    </div>
                    
                    {selectedAddress === address && (
                      <div className="pe-5 absolute top-full left-1/2 transform -translate-x-[100%] bg-white rounded-lg py-2 px-4 shadow-md">
                      <button onClick={() => handleEdit(address)}>{t('edit')}</button>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
           </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center mx-4">
          <NoAddresses className="w-auto h-auto object-contain " />
          <p className="text-md text-extrabold">{t('no_address')}</p>
          <p className="text-md text-extrabold">{t('no_address_des')}</p>
        </div>
      )}
      <div className="absolute bottom-14 p-2 w-full">
        <Link
          href={`${appLinks.addressCreate.path}`}
          className={`${mainBtnClass} flex flex-row justify-center items-center`}
          style={{ backgroundColor: color }}
          suppressHydrationWarning={suppressText}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <p className="w-fit text-md text-center mx-2">
            {t('add_address')}
          </p>
        </Link>
      </div>
      </div>
    </MainContentLayout>
  );
};

export default AddressIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      const { data: element, isError } = await store.dispatch(
        vendorApi.endpoints.getVendor.initiate({ lang: locale, url })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.Data || !url) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          url,
        },
      };
    }
);
