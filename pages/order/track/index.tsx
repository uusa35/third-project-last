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

const OrderTrack: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="orders"
    >
      <div className="flex flex-1 w-full flex-col justify-center items-start mt-8">
        <div className="flex flex-1 flex-col w-full border-b-8 border-gray-100 pb-8 px-3">
          <h1 className="text-xl text-extrabold">
            Order Received, We have got your order..
          </h1>
          <div className="flex flex-1 flex-row mt-2">
            <p className="text-md text-gray-400 mr-2">Estimated time :</p>{' '}
            <span>2:00-2:30 PM</span>
          </div>
          <div className="flex flex-1 w-full flex-row justify-between items-center h-1 my-6">
            <div className="w-1/3 bg-red-600 h-1"></div>
            <div className="w-1/3 bg-gray-200 h-1 mx-1.5"></div>
            <div className="w-1/3 bg-gray-200 h-1"></div>
          </div>
          <div className="flex flex-1 flex-row text-gray-400">
            <p>Order Id :</p>
            <p>#34234324</p>
          </div>
        </div>
      </div>
    </MainContentLayout>
  );
};

export default OrderTrack;

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
