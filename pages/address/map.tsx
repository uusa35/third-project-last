import ElementMap from '@/components/address/ElementMap';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import { NextPage } from 'next';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';

type Props = {
  element: Vendor;
  url: string;
};

const AddressMap: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="addresses"
    >
      <div className="flex flex-1 flex-col min-h-screen">
        <div className="flex flex-row h-auto py-6 px-4 justify-start items-center">
          <MapPinIcon className={`w-6 h-6 text-red-600 `} />
          <div className="flex flex-1 flex-col px-4 space-y-2">
            <p>area</p>
            <p>Mansoura</p>
          </div>
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
        <ElementMap lat="30.1302444" lng="31.279598" />
        <div className="flex h-auto w-full flex-col flex-1 justify-start items-start  px-4 py-4 space-y-2">
          <h1>{t(`delivery_address`)}</h1>
          <p className={`text-gray-600`}>Saudi Arabia , Ryad</p>
          <div className="flex flex-1 w-full">
            <button
              disabled
              className={`flex justify-center items-center w-full h-14 mt-[10%] rounded-3xl bg-red-600 disabled:bg-stone-400 p-3 px-8 text-white`}
            >
              {t(`sorry_we_do_not_delivery_here`)}
            </button>
          </div>
        </div>
      </div>
    </MainContentLayout>
  );
};

export default AddressMap;

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
