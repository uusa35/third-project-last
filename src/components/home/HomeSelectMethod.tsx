import { appLinks, suppressText, gessFont, arboriaFont } from '@/constants/*';
import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { appSetting, Vendor } from '@/types/index';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import TextTrans from '@/components/TextTrans';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useGetDeliveryPickupDetailsQuery } from '@/redux/api/vendorApi';

type Props = {
  element: Vendor;
  url?: string;
};
const HomeSelectMethod: FC<Props> = ({
  element,
  url = undefined,
}): JSX.Element => {
  const {
    appSetting: { method },
    locale: { lang },
    area,
    branch,
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isSuccess } = useGetDeliveryPickupDetailsQuery(
    {
      lang,
      url,
      ...(method === `pickup` && branch.id ? { branch_id: branch.id } : {}),
      ...(method === `delivery` && area.id ? { area_id: area.id } : {}),
    },
    { refetchOnMountOrArgChange: true }
  );

  const handleSelectMethod = (m: appSetting['method']) => {
    router.push(appLinks.cartSelectMethod(m));
  };

  return (
    <>
      {/* Delivery / Pickup Btns */}
      <div
        className={`flex flex-1 w-full flex-row ${
          element.delivery_pickup_type === 'delivery_pickup'
            ? `justify-between`
            : `justify-center`
        }  items-center my-2 border-t-[14px] border-stone-100 px-14 text-lg pt-4 capitalize`}
      >
        {(element.delivery_pickup_type === 'delivery_pickup' ||
          element.delivery_pickup_type === 'delivery') && (
          <button
            className={`${
              method === 'delivery' && `border-b-2 pb-1`
            } md:ltr:mr-3 md:rtl:ml-3 capitalize ${
              router.locale === 'ar' ? gessFont : arboriaFont
            }`}
            onClick={() => handleSelectMethod(`delivery`)}
            suppressHydrationWarning={suppressText}
            style={{ borderBottomColor: 'gray' }}
          >
            {t('delivery')}
          </button>
        )}
        {(element.delivery_pickup_type === 'delivery_pickup' ||
          element.delivery_pickup_type === 'pickup') && (
          <button
            className={`${
              method === 'pickup' && `border-b-2 pb-1`
            } md:ltr:mr-3 md:rtl:ml-3 capitalize ${
              router.locale === 'ar' ? gessFont : arboriaFont
            }`}
            onClick={() => handleSelectMethod(`pickup`)}
            suppressHydrationWarning={suppressText}
            style={{ borderBottomColor: 'gray' }}
          >
            {t('pickup')}
          </button>
        )}
      </div>

      <div className={`px-8 py-0 text-lg capitalize mb-2`}>
        <Link
          href={appLinks.cartSelectMethod(method)}
          scroll={true}
          className="flex flex-1 gap-x-3 w-full flex-row justify-between items-center mt-0 mb-0"
          data-cy="selectLocation"
        >
          <div className={`flex flex-grow justify-start items-center`}>
            <h1 className={`pt-4`}>
              {/* delivery_pickup_type delivery_pickup delivery pickup */}
              {method === `delivery` ? t(`deliver_to`) : t('pickup_from')}
            </h1>
          </div>
          <div
            className={`pt-4`}
            style={{ color: `${!branch.id && !area.id ? `red` : color}` }}
          >
            {branch.id ? (
              <TextTrans ar={branch.name_ar} en={branch.name_en} />
            ) : area.id ? (
              <TextTrans ar={area.name_ar} en={area.name_en} />
            ) : (
              t(`select_location`)
            )}
          </div>
        </Link>

        {/* earliest delivery and estimated prep time */}
        {(isSuccess && data.Data && method === 'delivery' && area.id) ||
        (method === 'pickup' && branch.id) ? (
          <div className="flex flex-1 gap-x-2 w-full flex-row justify-between items-center">
            <div className={`flex flex-grow justify-start items-center`}>
              <h1 className={`pt-4`} suppressHydrationWarning={suppressText}>
                {method === 'delivery'
                  ? t('earliest_delivery')
                  : t('estimated_prepration_time')}
              </h1>
            </div>
            <div className={`pt-4`} style={{ color }}>
              {method === 'delivery'
                ? data?.Data?.delivery_time
                : data?.Data?.estimated_preparation_time}{' '}
              {t(`${data?.Data?.delivery_time_type}`)}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default HomeSelectMethod;
