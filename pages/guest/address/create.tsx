import MainLayout from '@/layouts/MainLayout';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import HomeIcon from '@mui/icons-material/Home';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { appLinks, mainBtnClass, suppressText } from '@/constants/*';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCreateAddressMutation } from '@/redux/api/addressApi';
import { addressSchema } from 'src/validations';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { setCustomerAddress } from '@/redux/slices/customerSlice';
import { kebabCase, lowerCase } from 'lodash';
import { useRouter } from 'next/router';
import { themeColor } from '@/redux/slices/vendorSlice';
import { CottageOutlined, BusinessOutlined, WorkOutlineTwoTone } from '@mui/icons-material';

type Props = {
  element: Vendor;
  url: string;
};

const AddressCreate: NextPage<Props> = ({
  element,
  url,
}): React.ReactElement => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentAddressType, setCurrentAddressType] = useState<
    'home' | 'office' | 'appartment'
  >('home');
  const {
    locale: { isRTL },
    customer,
    searchParams: { method, destination },
  } = useAppSelector((state) => state);
  const refForm = useRef<any>();
  const [triggerAddAddress, { isLoading: AddAddressLoading }] =
    useCreateAddressMutation();
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
      address_type: 1,
      longitude: ``,
      latitude: ``,
      customer_id: customer.id?.toString(),
      phone: customer.phone,
      name: customer.name,
      block: customer.address.block ?? ``,
      street: customer.address.street ?? ``,
      house_no: customer.address.house_no ?? ``,
      floor_no: customer.address.floor_no ?? ``,
      building_no: customer.address.building_no ?? ``,
      office_no: customer.address.office_no ?? ``,
      city: customer.address.city ?? destination?.name,
      area: customer.address.area ?? destination?.name,
      avenue: customer.address.avenue,
      paci: customer.address.paci,
      additional: customer.address.additional,
    },
  });

  useMemo(() => {
    setValue(
      'address_type',
      currentAddressType === 'appartment'
        ? 2
        : currentAddressType === 'office'
        ? 3
        : 1
    );
  }, [currentAddressType]);

  const handelSaveAddress = async (body: any) => {
    await triggerAddAddress({
      body: {
        address_type: body.address_type,
        longitude: body.longitude,
        latitude: body.latitude,
        customer_id: body.customer_id,
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
        dispatch(setCustomerAddress(r.data.Data));
        router.push(`${appLinks.checkout.path}`);
        // checkTimeAvailability();
      } else {
        if (r.error) {
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
      await handelSaveAddress(body);
    }
  };

  console.log(errors);
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="addresses"
    >
      <div className="flex flex-1 flex-col h-full mt-8">
        <div className="flex mx-3 flex-row justify-center items-start mb-4">
          <button
            onClick={() => setCurrentAddressType('home')}
            className={`flex flex-1 flex-col border ${
              currentAddressType === 'home' && `border-red-600`
            } justify-center items-center p-3 rounded-md capitalize `}
          >
            <CottageOutlined fontSize="large"className={`${
              currentAddressType === 'home' && `text-red-600`
            }`} />
            <p>{t('house')}</p>
          </button>
          <button
            onClick={() => setCurrentAddressType('appartment')}
            className={`flex flex-1 flex-col border ${
              currentAddressType === 'appartment' && `border-red-600`
            } justify-center items-center p-3 rounded-md capitalize mx-3`}
          >
            <BusinessOutlined fontSize="large" className={`${
              currentAddressType === 'appartment' && `text-red-600`
            }`} />
            <p>{t('apartment')}</p>
          </button>
          <button
            onClick={() => setCurrentAddressType('office')}
            className={`flex flex-1 flex-col border ${
              currentAddressType === 'office' && `border-red-600`
            } justify-center items-center p-3 rounded-md capitalize`}
          >
            <WorkOutlineTwoTone fontSize="large" className={`${
              currentAddressType === 'office' && `text-red-600`
            }`} />
            <p>{t('office')}</p>
          </button>
        </div>

        {/*  form  */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-1 flex-col justify-start items-start m-3 space-y-4`}
        >
          <input type="hidden" {...register('customer_id')} />

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
            onClick={() => router.push(appLinks.selectArea.path)}
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
                onFocus={() => router.push(appLinks.selectArea.path)}
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
          {currentAddressType === 'home' && (
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

          {/*  appartment  */}
          {/*  building_no  */}
          {currentAddressType === 'appartment' && (
            <>
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

              {/*  appartment_no  */}
              <div className="w-full ">
                <label
                  suppressHydrationWarning={suppressText}
                  htmlFor="appartment_no"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t('apartment_no')}*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    {...register('appartment_no')}
                    suppressHydrationWarning={suppressText}
                    className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                    placeholder={`${t('apartment_no')}`}
                  />
                </div>
                {errors?.appartment_no?.message && (
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

          {currentAddressType === 'office' && (
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
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('notice')}`}
              />
            </div>
            {errors?.notes?.message && (
              <span
                className={`text-sm text-red-800 font-semibold pt-1 capitalize`}
                suppressHydrationWarning={suppressText}
              >
                {t('notes_is_required')}
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
