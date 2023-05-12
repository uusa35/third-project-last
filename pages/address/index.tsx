import MainLayout from '@/layouts/MainLayout';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import NoAddresses from '@/appImages/no_address.svg';
import {
  appLinks,
  imageSizes,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import Link from 'next/link';

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
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="addresses"
    >
      <div className="flex flex-col w-auto justify-start items-start mx-4 space-y-4">
        {/* office */}
        <div className="flex flex-1 flex-col w-auto border-b rounded-md p-3 h-42 overflow-hidden">
          <div className={`flex flex-1 flex-row justify-between items-start`}>
            <h1>office</h1>
            <div>
              <EllipsisVerticalIcon className="h-8 h-8" />
            </div>
          </div>
          <p className="text-gray-400">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            minus fuga culpa doloremque necessitatibus praesentium consequuntur
            iste eos! Nihil voluptatum impedit deserunt laborum vitae optio a
            odit! Maxime, reiciendis enim.
          </p>
        </div>
        {/*  appartment */}
        <div className="flex flex-1 flex-col w-auto  border-b rounded-md p-3 h-42 overflow-hidden">
          <div className={`flex flex-1 flex-row justify-between items-start`}>
            <h1>office</h1>
            <div>
              <EllipsisVerticalIcon className="h-8 h-8" />
            </div>
          </div>
          <p className="text-gray-400">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            minus fuga culpa doloremque necessitatibus praesentium consequuntur
            iste eos! Nihil voluptatum impedit deserunt laborum vitae optio a
            odit! Maxime, reiciendis enim.
          </p>
        </div>
      </div>
      {/*  no address case */}
      <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center mx-4">
        <NoAddresses className="w-auto h-auto object-contain " />
        <p className="text-md text-extrabold">{t('no_address')}</p>
        <p className="text-md text-extrabold">{t('no_address_des')}</p>
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
            {t('add_new_address')}
          </p>
        </Link>
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
