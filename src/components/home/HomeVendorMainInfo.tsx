import { FC, useEffect } from 'react';
import CustomImage from '@/components/CustomImage';
import { appLinks, imageSizes, imgUrl, suppressText } from '@/constants/*';
import Link from 'next/link';
import { InfoOutlined, Check } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TextTrans from '@/components/TextTrans';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { filter, isEmpty } from 'lodash';
import { Vendor } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import ClockIcon from '@/appIcons/time.svg';
import MinOrderIcon from '@/appIcons/min_order_home.svg';

type Props = {
  element: AppQueryResult<Vendor> | undefined;
};
const HomeVendorMainInfo: FC<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang },
  } = useAppSelector((state) => state);

  // vendor status
  const storeStatus = [
    { id: 1, status: 'open', className: 'bg-lime-400' },
    { id: 2, status: 'busy', className: 'bg-red-400' },
    { id: 3, status: 'closed', className: 'bg-gray-400' },
  ];
  const currentStoreStatus = filter(
    storeStatus,
    (store) => store.status === element?.Data?.status.toLowerCase()
  );

  return (
    <div className="py-5">
      <div className="flex gap-x-2 justify-between items-start capitalize">
        <div className="flex grow gap-x-2">
          <Link href={appLinks.home.path} scroll={true} className={`w-1/4`}>
            <CustomImage
              width={imageSizes.xs}
              height={imageSizes.xs}
              className="rounded-md w-full h-fit aspect-square"
              alt={element?.Data?.name ?? ''}
              src={imgUrl(element?.Data?.logo ?? '')}
            />
          </Link>
          <div className={`flex flex-col w-full p-1`}>
            {/* name */}
            <h1 className="font-bold text-lg">
              <TextTrans
                ar={element?.Data?.name_ar ?? ''}
                en={element?.Data?.name_en ?? ''}
              />
            </h1>

            {/* payment info */}
            <div className="text-xs space-y-1 text-[#544A45]">
              <div className="flex items-center gap-x-1">
                <ClockIcon />
                <p suppressHydrationWarning={suppressText}>{t('within')}</p>
              </div>
              <div className="flex items-center gap-x-1">
                <MinOrderIcon />
                <p suppressHydrationWarning={suppressText}>
                  {t('min_order')} : {t('KD')}
                </p>
              </div>

              {/* online */}
              {element?.Data?.status && !isEmpty(currentStoreStatus) && (
                <span
                  className={`flex flex-row justify-center items-center text-xs mx-2`}
                  suppressHydrationWarning={suppressText}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${currentStoreStatus[0].className} rtl:ml-2 ltr:mr-2`}
                  ></div>
                  <p suppressHydrationWarning={suppressText}>
                    ({t(currentStoreStatus[0].status)})
                  </p>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* vendorshow icon */}
        <Link
          href={appLinks.vendorDetails.path}
          scroll={true}
          className={`flex-none pt-4 grayscale`}
        >
          <InfoOutlined className="w-6 h-6 lg:w-8 lg:h-8" style={{ color }} />
        </Link>
      </div>
    </div>
  );
};

export default HomeVendorMainInfo;
