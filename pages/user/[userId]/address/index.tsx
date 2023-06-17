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
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useLazyGetAddressesQuery,
} from '@/redux/api/addressApi';
import { useEffect, useState } from 'react';
import { AppQueryResult } from '@/types/queries';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { isEmpty, isObject, isUndefined, map } from 'lodash';
import {
  setCustomerAddress,
  setCustomerAddressType,
} from '@/redux/slices/customerSlice';
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
  const {
    customer: { id, countryCode, name, phone },
  } = useAppSelector((state) => state);
  const [triggerGetAddresses, { data: addresses, isLoading }, isSuccess] =
    useLazyGetAddressesQuery<{
      data: AppQueryResult<UserAddressFields[]>;
      isLoading: boolean;
    }>();
  const { refetch: refetchAddresses } = useGetAddressesQuery<{
    refetch: () => void;
  }>({ url });
  const [triggerDeleteAddress] = useDeleteAddressMutation();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    triggerGetAddresses({ url }, false).then((res) =>
      console.log({ addressRes: res })
    );
  }, []);

  const handelDisplayAddress = (address) => {
    if (address && !isUndefined(address) && isObject(address)) {
      const addressValues =
        !isUndefined(address) &&
        Object.values(address).filter((value) => value !== null);

      const allAddress = addressValues ? addressValues.join(', ') : '';

      return allAddress;
    }
  };

  const showHideEditBtn = (address) => {
    if (selectedAddress === address) {
      setSelectedAddress(null);
    } else {
      setSelectedAddress(address);
    }
  };

  const handleEdit = (address: any) => {
    dispatch(setCustomerAddress(address));
    console.log('address', address);
    dispatch(setCustomerAddressType(address.type));
    router.push(appLinks.createAuthAddress(id));
  };

  const handleDelete = async (address: any) => {
    await triggerDeleteAddress({
      params: {
        address_id: address.id,
        address_type: address.type,
      },
      url,
    }).then((r) => {
      console.log({ deleteAddress: r });
      refetchAddresses();
    });
  };

  if (!isSuccess) return <></>;
  console.log({ addresses });

  return (
    <MainContentLayout url={url} showBackBtnHeader currentModule="my_addresses">
      <div className="relative h-[100vh]">
        {isSuccess && !isEmpty(addresses?.data?.address) ? (
          <div>
            {map(addresses?.data?.address, (address) => (
              <div
                className="flex flex-col w-auto justify-start items-start mx-4 space-y-4"
                key={address.id}
              >
                <div className="flex flex-1 flex-col w-auto border-b rounded-md p-3 w-full text-sm">
                  <div
                    className={`flex flex-1 flex-row justify-between items-start`}
                  >
                    <div>
                      <h5 className="font-semibold pb-2">{address.type}</h5>
                      <div className="text-zinc-600">
                        <p>{handelDisplayAddress(address?.address)}</p>
                        <p>{name}</p>
                        <p>
                          {countryCode}
                          {phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div>
                          <EllipsisVerticalIcon
                            className="h-8"
                            onClick={() => showHideEditBtn(address)}
                          />
                        </div>

                        {selectedAddress === address && (
                          <div className="pe-5 absolute top-full left-1/2 transform -translate-x-[100%] bg-white rounded-lg py-2 px-4 shadow-md">
                            <button
                              onClick={() => handleEdit(address)}
                              className="py-2 border-b-[1px] border-stone-200 w-full capitalize"
                            >
                              {t('edit')}
                            </button>
                            <button
                              onClick={() => handleDelete(address)}
                              className="text-red-600 py-2 capitalize"
                            >
                              {t('delete')}
                            </button>
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
            <p className="text-md text-extrabold text-center w-full lg:w-[80%]">
              {t('no_address_des')}
            </p>
          </div>
        )}
        <div className="relative -bottom-10 p-2 w-full">
          <Link
            href={`${appLinks.createAuthAddress(id)}`}
            className={`${mainBtnClass} flex flex-row justify-center items-center`}
            style={{ backgroundColor: color }}
            suppressHydrationWarning={suppressText}
          >
            <PlusSmallIcon className="w-6 h-6" />
            <p className="w-fit text-md text-center mx-2">{t('add_address')}</p>
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
