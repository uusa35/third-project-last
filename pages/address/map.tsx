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
import TextTrans from '@/components/TextTrans';
import Link from 'next/link';
import { appLinks } from '@/constants/*';
import { isAuthenticated } from '@/redux/slices/customerSlice';
import MapIcon from '@/appIcons/map_icon.svg';

type Props = {
  element: Vendor;
  url: string;
};

const AddressMap: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const {
    locale: { isRTL },
    customer: { id },
    searchParams: { destination, destination_type, method },
  } = useAppSelector((state) => state);
  const isAuth = useAppSelector(isAuthenticated);
  const { t } = useTranslation();
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="set_delivery_location"
    >
      <div className="flex flex-1 flex-col min-h-screen">
        <div className="flex flex-row h-auto py-6 px-4 justify-start items-center">
          <MapPinIcon className={`w-6 h-6 text-red-600 `} />
          <Link
            href={appLinks.selectArea.path}
            className="flex flex-1 flex-col px-4 space-y-2"
          >
            <p>{destination_type && t(`${destination_type}`)}</p>
            <TextTrans ar={destination?.name_ar} en={destination?.name_en} />
          </Link>
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
          <TextTrans
            ar={destination?.name_ar}
            en={destination?.name_en}
            className={`text-gray-600`}
          />
          <div className="flex flex-1 w-full">
            <Link
              href={
                method === 'delivery'
                  ? isAuth && id
                    ? appLinks.createAuthAddress(id)
                    : 'else'
                  : appLinks.cart.path
              }
              className={`flex justify-center items-center w-full h-14 mt-[10%] rounded-3xl bg-red-600 disabled:bg-stone-400 p-3 px-8 text-white`}
            >
              {t(`deliver_here`)}
            </Link>
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
