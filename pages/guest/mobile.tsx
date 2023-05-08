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
import MobileImg from '@/appImages/mobile.png';
import { imageSizes } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import GuestOrderModal from '@/components/modals/GuestOrderModal';
import { useState } from 'react';

type Props = {
  element: Vendor;
  url: string;
};

const GuestMobile: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="addresses"
    >
      {/*  no address case */}
      <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center">
        <CustomImage
          alt={t('mobile')}
          src={MobileImg.src}
          className="w-1/2 xl:w-1/3 h-auto object-contain "
        />
        <p className="text-lg font-extrabold">{t('verify_ur_mobile')}</p>
        <p className="text-md text-gray-600">
          {t('u_will_receive_a_one_time_password_shortly')}
        </p>
        <GuestOrderModal
          url={url}
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
        />
      </div>
    </MainContentLayout>
  );
};

export default GuestMobile;

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
