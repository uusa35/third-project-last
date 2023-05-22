import MainLayout from '@/layouts/MainLayout';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import { CottageOutlined, BusinessOutlined, WorkOutlineTwoTone } from '@mui/icons-material';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { useAppSelector } from '@/redux/hooks';
import { suppressText } from '@/constants/*';

type Props = {
  element: Vendor;
  url: string;
};

const AddressCreate: NextPage<Props> = ({
  element,
  url,
}): React.ReactElement => {
  const { t } = useTranslation();
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="address_details"
    >
      <div className="flex flex-1 flex-col h-full mt-8">
        <div className="flex mx-3 flex-row justify-center items-start">
          <button className="flex flex-1 flex-col border justify-center items-center p-3 rounded-md capitalize ">
            <CottageOutlined fontSize="large" />
            <p>{t('house')}</p>
          </button>
          <button className="flex flex-1 flex-col border justify-center items-center p-3 rounded-md capitalize mx-3">
            <BusinessOutlined fontSize="large" />
            <p>{t('apartment')}</p>
          </button>
          <button className="flex flex-1 flex-col border justify-center items-center p-3 rounded-md capitalize">
            <WorkOutlineTwoTone fontSize="large" />
            <p>{t('office')}</p>
          </button>
        </div>

        {/*  form  */}
        <div
          className={`flex flex-1 flex-col justify-start items-start m-3 space-y-6`}
        >
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
                type="text"
                suppressHydrationWarning={suppressText}
                name="phone"
                id="phone"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('phone')}`}
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
                type="text"
                name="full_name"
                id="full_name"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('full_name')}`}
              />
            </div>
          </div>

          {/*  city_and_area  */}
          <div className="w-full ">
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
                name="city_and_area"
                id="city_and_area"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('city_and_area')}`}
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
          </div>

          {/*  street  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="street"
              className="block text-sm font-medium text-gray-900"
            >
              {t('street')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                suppressHydrationWarning={suppressText}
                name="street"
                id="street"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('street')}`}
              />
            </div>
          </div>

          {/*  house_no  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="house_no"
              className="block text-sm font-medium text-gray-900"
            >
              {t('house_no')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                suppressHydrationWarning={suppressText}
                name="house_no"
                id="house_no"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('house_no')}`}
              />
            </div>
          </div>

          {/*  office  */}
          {/*  building_no  */}
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
                type="text"
                suppressHydrationWarning={suppressText}
                name="building_no"
                id="building_no"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('building_no')}`}
              />
            </div>
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
                type="text"
                suppressHydrationWarning={suppressText}
                name="floor_no"
                id="floor_no"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('floor_no')}`}
              />
            </div>
          </div>

          {/*  appartment_no  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="appartment_no"
              className="block text-sm font-medium text-gray-900"
            >
              {t('appartment_no')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                suppressHydrationWarning={suppressText}
                name="appartment_no"
                id="appartment_no"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('apartment_no')}`}
              />
            </div>
          </div>

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
                type="text"
                suppressHydrationWarning={suppressText}
                name="office_no"
                id="office_no"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('office_no')}`}
              />
            </div>
          </div>

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
                type="text"
                suppressHydrationWarning={suppressText}
                name="notice"
                id="notice"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('notice')}`}
              />
            </div>
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
                type="text"
                suppressHydrationWarning={suppressText}
                name="other_phone"
                id="other_phone"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 sm:text-sm sm:leading-6"
                placeholder={`${t('other_phone_no')}`}
              />
            </div>
          </div>

          <div className="flex flex-1 justify-center items-end w-full">
            <button
              className={`flex flex-1 flex-row w-auto space-x-3 rounded-3xl bg-red-600 p-3 px-8 text-white justify-center items-end`}
            >
              <p className="text-md">{t('save_address')}</p>
            </button>
          </div>
        </div>
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
