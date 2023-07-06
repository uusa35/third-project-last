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
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { appLinks, mainBtnClass, suppressText } from '@/constants/*';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useCreateAddressMutation,
  useLazyGetAddressesByIdQuery,
  useLazyGetAddressesQuery,
  useUpdateAddressMutation,
} from '@/redux/api/addressApi';
import { addressSchema } from 'src/validations';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  setCustomerAddress,
  setCustomerAddressType,
  setNotes,
} from '@/redux/slices/customerSlice';
import {
  filter,
  first,
  isNull,
  kebabCase,
  lowerCase,
  parseInt,
  toUpper,
  upperCase,
} from 'lodash';
import { useRouter } from 'next/router';
import { themeColor } from '@/redux/slices/vendorSlice';
import { AppQueryResult } from '@/types/queries';
import ApartmentIcon from '@/appIcons/apartment.svg';
import OfficeIcon from '@/appIcons/office.svg';
import HomeActive from '@/appIcons/home_active.svg';
import ApartmentActive from '@/appIcons/apartment_active.svg';
import OfficeActive from '@/appIcons/office_active.svg';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';

type Props = {
  element: Vendor;
  url: string;
  userId: string;
};

const AddressCreate: NextPage<Props> = ({
  element,
  url,
  userId,
}): React.ReactElement => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    locale: { isRTL },
    customer,
    searchParams: { method, destination },
    cart: { promocode },
  } = useAppSelector((state) => state);
  const desObject = useAppSelector(destinationHeaderObject);
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  const [currentAddresses, setCurrentAddresses] = useState<any>(null);
  const [currentAddressType, setCurrentAddressType] = useState<
    'HOUSE' | 'APARTMENT' | 'OFFICE'
  >(customer?.address?.type ?? 'HOUSE');
  const refForm = useRef<any>();
  const [triggerCreateOrUpdateAddress, { isLoading: AddAddressLoading }] =
    useCreateAddressMutation();
  const [triggerGetAddresses, { data: addresses, isLoading }, isSuccess] =
    useLazyGetAddressesQuery<{
      data: AppQueryResult<UserAddressFields[]>;
      isLoading: boolean;
    }>();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(addressSchema(method, t)),
    defaultValues: {
      method,
      address_type: currentAddress?.address?.type ?? 'HOUSE',
      longitude: ``,
      latitude: ``,
      customer_id: userId.toString(),
      phone: customer.phone,
      name: customer.name,
      block: currentAddress?.address.block,
      street: currentAddress?.address.street,
      house_no: currentAddress?.address.house_no,
      floor_no: currentAddress?.address.floor_no,
      building_no: currentAddress?.address.building_no,
      office_no: currentAddress?.address.office_no,
      city: currentAddress?.address.city ?? destination?.name,
      area: currentAddress?.address.area ?? destination?.name,
      avenue: currentAddress?.address.avenue,
      paci: currentAddress?.address.paci,
      additional: currentAddress?.address.additional,
      notes: currentAddress?.address.notes,
    },
  });
  const { data: cartItems } = useGetCartProductsQuery({
    userAgent: customer.userAgent,
    area_branch: desObject,
    url,
    PromoCode: promocode,
  });
  
  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
      triggerGetAddresses({ url }).then((r: any) => {
        if (r.data) {
          setCurrentAddresses(r.data.data);
          const current = first(
            filter(r.data.data, (a) => a.type === currentAddressType)
          );
          if (current?.address) {
            setCurrentAddress(current);
          }
        }
      });
    }
  }, []);

  useMemo(() => {
    setValue('address_type', currentAddressType);
    dispatch(setCustomerAddressType(currentAddressType));
    if (currentAddresses) {
      const address = first(
        filter(currentAddresses, (a) => a.type === toUpper(currentAddressType))
      );
      if (address) {
        setCurrentAddress(address);
      }
    }
  }, [currentAddressType]);

  const handleSaveAddress = async (body: any) => {
    await triggerCreateOrUpdateAddress({
      body: {
        address_type: upperCase(body.address_type),
        longitude: body.longitude,
        latitude: body.latitude,
        customer_id: userId.toString(),
        address: {
          block: body.block,
          street: body.street,
          house_no: body.house_no,
          avenue: body.avenue,
          paci: body.paci,
          floor_no: body.floor_no,
          building_no: body.building_no,
          office_no: body.office_no,
          additional: body.additional,
          notes: body.notes,
        },
      },
      url,
    }).then((r: any) => {
      if (r.data && r.data.status) {
        dispatch(
          showToastMessage({
            content: `address_saved_successfully`,
            type: `success`,
          })
        );
        // dispatch(setCustomerAddress(r.data.Data));
        setCurrentAddress(r.data.Data);
        if (body.notes) {
          dispatch(setNotes(body.notes));
        }
        if (cartItems && cartItems.data && cartItems?.data?.Cart.length > 0) {
          router.push(`${appLinks.checkout.path}`);
        } else {
          router.push(`${appLinks.home.path}`);
        }
      } else {
        if (r.error && r.error.data?.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg[`address`][0])),
              type: `error`,
            })
          );
        }
      }
    });
  };

  const onSubmit = async (body: any) => {
    if (destination.method === 'pickup') {
      // await checkTimeAvailability();
    } else {
      await handleSaveAddress(body);
    }
  };

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="address_details"
    >
      <div className="flex flex-1 flex-col h-full mt-8">
        <div className="flex mx-3 flex-row justify-center items-start mb-4">
          <button
            onClick={() => setCurrentAddressType('HOUSE')}
            className={`flex flex-1 flex-col border justify-center items-center p-3 rounded-md capitalize `}
            style={{ borderColor: currentAddressType === 'HOUSE' && color }}
          >
            <HomeIcon
              className={`w-8 h-8 `}
              color={currentAddressType === 'HOUSE' ? color : `text-stone-400`}
            />
            <p>{t('house')}</p>
          </button>
          <button
            onClick={() => setCurrentAddressType('APARTMENT')}
            className={`flex flex-1 flex-col border justify-center items-center p-3 rounded-md capitalize mx-3`}
            style={{ borderColor: currentAddressType === 'APARTMENT' && color }}
          >
            <BuildingOffice2Icon
              className={`w-8 h-8 `}
              color={
                currentAddressType === 'APARTMENT' ? color : `text-stone-400`
              }
            />
            <p>{t('apartment')}</p>
          </button>
          <button
            onClick={() => setCurrentAddressType('OFFICE')}
            className={`flex flex-1 flex-col border justify-center items-center p-3 rounded-md capitalize`}
            style={{ borderColor: currentAddressType === 'OFFICE' && color }}
          >
            <BriefcaseIcon
              className={`w-8 h-8 `}
              color={currentAddressType === 'OFFICE' ? color : `text-stone-400`}
            />
            <p>{t('office')}</p>
          </button>
        </div>

        {/*  form  */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-1 flex-col justify-start items-start m-3 space-y-4`}
        >
          {/* <input type="hidden" {...register('customer_id')} /> */}

          {/*  phone  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="phone"
              className="block text-sm font-medium text-gray-900"
            >
              {t('phone_no')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                {...register('phone')}
                suppressHydrationWarning={suppressText}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('phone_no')}`}
              />
            </div>
          </div>

          {/*  full_name  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-900"
            >
              {t('full_name')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                suppressHydrationWarning={suppressText}
                {...register('name')}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('full_name')}`}
              />
            </div>
          </div>
          {/*  city / area   */}
          <div
            className="w-full"
            onClick={() => router.push(appLinks.selectArea(`user`))}
          >
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="city_and_area"
              className="block text-sm font-medium text-gray-900"
            >
              {t('city_and_area')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                suppressHydrationWarning={suppressText}
                {...register('city')}
                name="city_and_area"
                disabled
                id="city_and_area"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6 disabled:bg-white"
                placeholder={`${t('city_and_area')}`}
                onFocus={() => router.push(appLinks.selectArea(`user`))}
              />
              <div
                className={`${
                  isRTL ? `left-0` : `right-0`
                } pointer-events-none absolute inset-y-0  flex items-center`}
              >
                {isRTL ? (
                  <ChevronLeftIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronRightIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
            {errors?.city?.message && (
              <span
                className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                suppressHydrationWarning={suppressText}
              >
                {t('city_is_required')}
              </span>
            )}
            {errors?.method?.message && (
              <span
                className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                suppressHydrationWarning={suppressText}
              >
                {t('city_is_required')}
              </span>
            )}
          </div>

          {/*  street  */}
          <div className="w-full">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="street"
              className="block text-sm font-medium text-gray-900"
            >
              {t('street')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                {...register('street')}
                defaultValue={currentAddress?.address?.street}
                suppressHydrationWarning={suppressText}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('street')}`}
              />
            </div>
            {errors?.street?.message && (
              <span
                className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                suppressHydrationWarning={suppressText}
              >
                {t('street_is_required')}
              </span>
            )}
          </div>

          {/*  house_no  */}
          {currentAddressType === 'HOUSE' && (
            <div className="w-full ">
              <label
                suppressHydrationWarning={suppressText}
                htmlFor="house_no"
                className="block text-sm font-medium text-gray-900"
              >
                {t('house_no')}*
              </label>
              <div className="relative rounded-md">
                <input
                  {...register('house_no')}
                  suppressHydrationWarning={suppressText}
                  defaultValue={currentAddress?.address?.house_no}
                  className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                  placeholder={`${t('house_no')}`}
                />
              </div>
              {errors?.house_no?.message && (
                <span
                  className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('house_no_is_required')}
                </span>
              )}
            </div>
          )}

          {/*  building_no  */}
          {currentAddressType !== 'HOUSE' && (
            <div className="w-full ">
              <label
                suppressHydrationWarning={suppressText}
                htmlFor="building_no"
                className="block text-sm font-medium text-gray-900"
              >
                {t('building_no')}*
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  {...register('building_no')}
                  suppressHydrationWarning={suppressText}
                  defaultValue={currentAddress?.address?.building_no}
                  className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                  placeholder={`${t('building_no')}`}
                />
              </div>
              {errors?.building_no?.message && (
                <span
                  className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('building_no_is_required')}
                </span>
              )}
            </div>
          )}

          {/*  floor_no  */}
          {/*  apartment_no  */}
          {currentAddressType === 'APARTMENT' && (
            <>
              {/*  floor_no  */}
              <div className="w-full ">
                <label
                  suppressHydrationWarning={suppressText}
                  htmlFor="floor_no"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t('floor_no')}*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    {...register('floor_no')}
                    suppressHydrationWarning={suppressText}
                    defaultValue={currentAddress?.address?.floor_no}
                    className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                    placeholder={`${t('floor_no')}`}
                  />
                </div>
                {errors?.floor_no?.message && (
                  <span
                    className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('floor_no_is_required')}
                  </span>
                )}
              </div>

              {/*  apartment_no  */}
              <div className="w-full ">
                <label
                  suppressHydrationWarning={suppressText}
                  htmlFor="apartment_no"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t('apartment_no')}*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    {...register('apartment_no')}
                    suppressHydrationWarning={suppressText}
                    defaultValue={currentAddress?.address?.apartment_no}
                    className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                    placeholder={`${t('apartment_no')}`}
                  />
                </div>
                {errors?.apartment_no?.message && (
                  <span
                    className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('apartment_no_is_required')}
                  </span>
                )}
              </div>
            </>
          )}

          {currentAddressType === 'OFFICE' && (
            <>
              {/*  office_no  */}
              <div className="w-full ">
                <label
                  suppressHydrationWarning={suppressText}
                  htmlFor="office_no"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t('office_no')}*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    {...register('office_no')}
                    suppressHydrationWarning={suppressText}
                    defaultValue={currentAddress?.address?.office_no}
                    className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                    placeholder={`${t('office_no')}`}
                  />
                </div>
                {errors?.office_no?.message && (
                  <span
                    className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('office_no_is_required')}
                  </span>
                )}
              </div>
            </>
          )}

          {/*  notice  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="notice"
              className="block text-sm font-medium text-gray-900"
            >
              {t('notice')}{' '}
              <span className="text-[10px]">({t('optional')})</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                {...register('notes')}
                suppressHydrationWarning={suppressText}
                defaultValue={currentAddress?.address?.notes}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('notice')}`}
              />
            </div>
            {errors?.notes?.message && (
              <span
                className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                suppressHydrationWarning={suppressText}
              >
                {t('notes')}
              </span>
            )}
          </div>

          {/*  other_phone  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="other_phone"
              className="block text-sm font-medium text-gray-900"
            >
              {t('other_phone_no')}{' '}
              <span className="text-[10px]">({t('optional')})</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                {...register('other_phone')}
                suppressHydrationWarning={suppressText}
                defaultValue={currentAddress?.address?.other_phone}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('other_phone_no')}`}
              />
            </div>
          </div>

          <div className="flex flex-1 justify-center items-end w-full">
            <button
              type="submit"
              className={`${mainBtnClass}`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
            >
              <p className="text-md">{t('save_address')}</p>
            </button>
          </div>
        </form>
      </div>
    </MainContentLayout>
  );
};

export default AddressCreate;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale, query }) => {
      const url = req.headers.host;
      // if (query.userId) {
      //   return {
      //     notFound: true,
      //   };
      // }
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
          userId: query.userId,
          url,
        },
      };
    }
);
