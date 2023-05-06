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
  MapIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { SendOutlined } from '@mui/icons-material';

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
        <div className="flex flex-1 flex-col w-full border-b-8 border-gray-100 pb-6 mb-6 px-3">
          <h1 className="text-xl text-extrabold">
            Order Received, We have got your order..
          </h1>
          <div className="flex flex-1 flex-row mt-2">
            <p className="text-md text-gray-400 mr-2">Estimated time :</p>{' '}
            <span>2:00-2:30 PM</span>
          </div>
          {/* order id  */}
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
        <div className="flex flex-1 flex-col w-full px-3 border-b-8 border-gray-100 pb-6">
          <div className="capitlize text-xl mb-4">Pick up from</div>
          <div className="flex w-full flex-row justify-between items-center ">
            <div className={`p-1 bg-gray-100 rounded-full`}>
              <MapPinIcon className="h-5 w-5 text-black" />
            </div>
            <div className="flex flex-1 w-full flex-col mx-3">
              <p className="flex flex-1">Branch Address</p>
              <p>ManSource, El Geesh St</p>
            </div>
            <div className="flex ">
              <button className="btn bg-gray-100 p-3 flex justify-center items-center rounded-full text-xs">
                <SendOutlined className="h-3 w-3 text-black mx-1" />
                Get Direction
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 absolute bottom-0 w-full border-t border-gray-200 p-4">
        <button
          className={`flex flex-row w-full justify-center items-center space-x-3 rounded-3xl bg-red-600 p-3 py-4 text-white capitlaize`}
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
          <p className="text-md text-center">{t('add_order')}</p>
        </button>
        <button
          className={`flex flex-row w-full justify-center items-center space-x-3 rounded-3xl bg-white p-3 py-4 text-red-600 border border-red-600 capitalize`}
        >
          <p className="text-md text-center">{t('cancel order')}</p>
        </button>
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
