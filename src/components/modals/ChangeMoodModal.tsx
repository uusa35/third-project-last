import { FC, useEffect, useState } from 'react';
import MainModal from './MainModal';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { map } from 'lodash';
import Link from 'next/link';
import {
  appLinks,
  arboriaFont,
  gessFont,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { useRouter } from 'next/router';
import PickupIcon from '@/appIcons/pickup.svg';
import DeliveryIcon from '@/appIcons/delivery.svg';
import {
  PlaceOutlined,
  WatchLaterOutlined,
  ArrowForwardIos,
} from '@mui/icons-material';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAreaBranchModelStatus } from '@/redux/slices/modelsSlice';
import TextTrans from '../TextTrans';
import { useLazyGetVendorQuery } from '@/redux/api/vendorApi';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { wrapper } from '@/redux/store';

type Props = {
  url: string
}
const ChangeMoodModal = ({ url }: Props): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { 
    searchParams: { destination, destination_type, method },
    models: { areaBranchIsOpen },
    customer: { prefrences },
    locale: { lang, isRTL },
  } = useAppSelector((state) => state);
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();
  const onRequestClose = () => {
    dispatch(setAreaBranchModelStatus(false));
  }
  const desObject = useAppSelector(destinationHeaderObject);
console.log({ method })
  useEffect(() => {
    triggerGetVendor(
      {
        url,
        lang,
        destination: desObject,
      },
      false
    );
  }, []);
  return (
    <>
      <MainModal isOpen={areaBranchIsOpen}>
        <div>
          <div className="flex w-full pb-5 px-4">
            <div className="w-[5%]">
              <button
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                onClick={onRequestClose}
              >
                <ExpandMoreIcon />
              </button>
            </div>
            <h5
              className="font-semibold capitalize text-center mx-auto"
              suppressHydrationWarning={suppressText}
            >
              {t('where_&_when?')}
            </h5>
          </div>

          <div className="border-b-[1px] border-slate-200 flex justify-between px-8">
            <ul className="flex justify-between w-full">
              <li
                onClick={() => setActiveTabIndex(0)}
                className={activeTabIndex === 0 ? 'active' : ''}
              >
                <button
                  className={`md:ltr:mr-3 md:rtl:ml-3 capitalize text-sm font-semibold text-center ${
                    router.locale === 'ar' ? gessFont : arboriaFont
                  }`}
                  suppressHydrationWarning={suppressText}
                >
                  <span className="flex items-center px-5 capitalize">
                    <DeliveryIcon />
                    <span className="px-3">{t('delivery')}</span>
                  </span>
                  {activeTabIndex === 0 && (
                    <div
                      className="w-full h-1 rounded-tl rounded-tr mt-2"
                      style={{ backgroundColor: color }}
                    ></div>
                  )}
                </button>
              </li>
              <li
                onClick={() => setActiveTabIndex(1)}
                className={activeTabIndex === 1 ? 'active' : ''}
              >
                <button
                  className={`md:ltr:mr-3 md:rtl:ml-3 capitalize text-sm font-semibold text-center text-gray-500 ${
                    router.locale === 'ar' ? gessFont : arboriaFont
                  }`}
                  suppressHydrationWarning={suppressText}
                >
                  <span className="flex items-center px-7 capitalize">
                    <PickupIcon />
                    <span className="px-5">{t('pickup')}</span>
                  </span>
                  {activeTabIndex === 1 && (
                    <div
                      className="w-full h-1 rounded-tl rounded-tr mt-2"
                      style={{ backgroundColor: color }}
                    ></div>
                  )}
                </button>
              </li>
            </ul>
          </div>
          <div>
            {activeTabIndex === 0 && (
              <>
                <button
                  onClick={() => {
                    router.push(`${appLinks.selectArea.path}`);
                    
                  }}
                  className="w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 "
                >
                  <div className="flex justify-between items-center">
                    <PlaceOutlined style={{ color }} />
                    <div className="px-3 capitalize font-semibold">
                      <h6
                        className="text-sm text-gray-500 capitalize"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('delivering_to')}
                      </h6>
                      <p>
                        {method === 'delivery' ? (
                          <TextTrans en={destination.name_en} ar={destination.name_ar} />
                        ) : t('select_address')}
                      </p>
                    </div>
                  </div>
                  <ArrowForwardIos className="text-zinc-500 mt-2" />
                </button>
              </>
            )}
            {activeTabIndex === 1 && (
              <>
                <Link
                  href={appLinks.selectBranch.path}
                  className="w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 "
                >
                  <div className="flex justify-between items-center">
                    <PlaceOutlined style={{ color }} />
                    <div className="px-3 capitalize font-semibold">
                      <h6
                        className="text-sm text-gray-500 capitalize"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('pickup_from')}
                      </h6>
                      <p>
                      {method === 'pickup' ? (
                          <TextTrans en={destination.name_en} ar={destination.name_ar} />
                        ) : t('select_branch')}
                      </p>
                    </div>
                  </div>
                  <ArrowForwardIos className="text-zinc-500 mt-2" />
                </Link>
              </>
            )}
            <Link
              href={appLinks.selectTime.path}
              className="w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 "
            >
              <div className="flex justify-between items-center">
                <WatchLaterOutlined style={{ color }} />
                <div className="px-3 capitalize text-sm font-semibold">
                  <h6
                    className="text-sm text-gray-500"
                    suppressHydrationWarning={suppressText}
                  >
                    {activeTabIndex === 0 ? t('delivery_in') : t('pickup_in')}
                  </h6>
                  <p suppressHydrationWarning={suppressText}>
                  {prefrences.type === 'delivery_now' || prefrences.type === 'pickup_now'
                    ? (
                      <>
                      {vendorElement?.Data?.delivery?.delivery_time ? `${t('now_within')} ${
                        vendorElement?.Data?.delivery?.delivery_time
                      } ${t('minutes')}` : t('select_time')}
                      </>
                    )
                    : (
                      <span>
                        {prefrences?.date}
                        {prefrences?.time}
                      </span>
                    )
                  }
                  </p>
                </div>
              </div>
              <ArrowForwardIos className="text-zinc-500 mt-2" />
            </Link>
          </div>
          <div className="px-5 mt-10">
            <button
              className={`${mainBtnClass} disabled:bg-stone-400`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
              onClick={onRequestClose}
              disabled={prefrences.data === '' && prefrences.time === ''}
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </MainModal>
    </>
  );
};
export default ChangeMoodModal;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);
