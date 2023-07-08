import MainLayout from '@/layouts/MainLayout';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { UserAddressFields, Vendor } from '@/types/index';
import {
  EllipsisVerticalIcon,
  PlusSmallIcon,
} from '@heroicons/react/24/outline';
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
import {
  addressApi,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useLazyGetAddressesQuery,
} from '@/redux/api/addressApi';
import { useEffect, useState } from 'react';
import { Address, AppQueryResult } from '@/types/queries';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  difference,
  first,
  isEmpty,
  isNull,
  isObject,
  isUndefined,
  map,
  toLower,
} from 'lodash';
import { setCustomer, setCustomerAddress } from '@/redux/slices/customerSlice';
import { useRouter } from 'next/router';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';

type Props = {
  element: Vendor;
  url: string;
};

const AddressSelectionIndex: NextPage<Props> = ({
  element,
  url,
}): React.ReactElement => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const {
    customer: {
      id,
      countryCode,
      name,
      phone,
      token: { api_token },
      address: { id: addressId },
    },
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const [triggerGetAddresses, { data: addresses, isLoading, isSuccess }] =
    useLazyGetAddressesQuery<{
      data: AppQueryResult<UserAddressFields[]>;
      isLoading: boolean;
      isSuccess: boolean;
    }>();
  const [triggerDeleteAddress] = useDeleteAddressMutation();
  const [nextType, setNextType] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    triggerGetAddresses({ url }, false).then((r: any) => {
      const allTypes = ['HOUSE', 'OFFICE', 'APARTMENT'];
      if (r && r.data && r.data.data) {
        const remaingType = first(
          difference(allTypes, map(r.data.data, 'type'))
        );
        if (remaingType) {
          setNextType(remaingType);
        }
      }
    });
  }, []);

  const handelDisplayAddress = (address: any) => {
    if (address && !isUndefined(address) && isObject(address)) {
      const addressValues =
        !isUndefined(address) &&
        Object.values(address).filter((value) => value !== null);

      const allAddress = addressValues ? addressValues.join(', ') : '';

      return allAddress;
    }
  };

  const handleSelectAddress = (address: Address) => {
    dispatch(setCustomerAddress(address));
    // redirection here
  };

  if (!isSuccess) return <></>;

  return (
    <MainContentLayout url={url} showBackBtnHeader currentModule="my_addresses">
      <div className="relative h-[100vh] mt-4 ">
        {addresses?.data && !isEmpty(addresses?.data) ? (
          <div>
            <div className={`mx-4 mb-4`}>
              <h1 className="text-md md:text-lg font-extrabold">
                {t('select_address')}
              </h1>
            </div>
            {map(addresses?.data, (address: Address) => (
              <button
                onClick={() => handleSelectAddress(address)}
                className="flex flex-col w-auto justify-start items-start mx-4 space-y-4 rounded-lg mb-4 border"
                style={{ borderColor: color }}
                key={address.id}
              >
                <div className="flex flex-1 flex-col w-auto border-b rounded-md p-3 overflow-hidden w-full text-sm">
                  <div
                    className={`flex flex-1 flex-row justify-between items-start p-2`}
                  >
                    <div>
                      <div
                        className={`flex w-full flex-row justify-between items-center pb-2`}
                      >
                        <div>
                          <h5 className="font-semibold pb-2">{address.type}</h5>
                        </div>
                        <div>
                          {address.id == addressId ? (
                            <RadioButtonChecked style={{ color }} />
                          ) : (
                            <RadioButtonUnchecked style={{ color }} />
                          )}
                        </div>
                      </div>

                      <div className="text-zinc-400 text-left">
                        <p>{handelDisplayAddress(address.address)}</p>
                        <p>{name}</p>
                        <p>{address.address.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center mx-4">
            <NoAddresses className="w-auto h-auto object-contain " />
            <p className="text-md text-extrabold">{t('no_address')}</p>
            <p className="text-md text-extrabold text-center w-full lg:w-[80%]">
              {t('no_address_des')}
            </p>
          </div>
        )}

        <div className="relative -bottom-10 p-2 w-full">
          <Link
            href={`${appLinks.createAuthAddress(id)}`}
            className={`${mainBtnClass} flex flex-row justify-center items-center bg-gray-200`}
            suppressHydrationWarning={suppressText}
          >
            <PlusSmallIcon className="w-6 h-6 text-black" />
            <p className="w-fit text-md text-center mx-2 text-black">
              {t('add_new_address')}
            </p>
          </Link>
        </div>
      </div>
    </MainContentLayout>
  );
};

export default AddressSelectionIndex;

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
