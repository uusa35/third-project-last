import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PromotionIcon from '@/appIcons/promotion.svg';
import PromocodeIcon from '@/appIcons/promocode.svg';
import { useGetPromoCodesQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { isEmpty } from 'lodash';
import { useAppSelector } from '@/redux/hooks';
import GreenCheckIcon from '@/appIcons/check.svg';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { alexandriaFont, alexandriaFontMeduim } from '@/constants/*';

type Props = {
  url: string;
  handelApplyPromoCode: (value: string | undefined) => void;
};

const PromoCode:FC<Props> = ({
  url,
  handelApplyPromoCode = () => {},
}) => {
  const { t } = useTranslation();
  const {
    cart: { promocode, enable_promocode },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const [promoCodeVal, setPromoCodeVal] = useState<string | undefined>(
    enable_promocode ? promocode : undefined
  );

  const {
    data: promoCodes,
    isLoading: promoCodesLoading,
    isSuccess: promoCodesSuccess,
  } = useGetPromoCodesQuery<{
    data: AppQueryResult<string[]>;
    isSuccess: boolean;
    isLoading: boolean;
  }>(
    {
      url: url,
      area_branch: destObj,
    },
    { refetchOnMountOrArgChange: true }
  );

  // remove this part later line 81
  return (
    <div>
      <p className={`mt-5 ${alexandriaFontMeduim}`}>
        {t('promotions')}
      </p>
      <div className="flex items-center  gap-x-3 text-sm bg-[#F5F5F5] text-[#877D78] py-2 px-3 rounded-md my-2">
        <div className={`flex items-center gap-x-1 w-full ${alexandriaFont}`}>
          <PromotionIcon />
          <input
            className={`bg-[#F5F5F5] outline-none w-full`}
            onChange={(e) => {
              setPromoCodeVal(e.target.value);
            }}
            value={promoCodeVal}
            placeholder={`${t('add_a_promo_code')}`}
            type="text"
          />
        </div>
        <button onClick={() => handelApplyPromoCode(promoCodeVal)}>
          {enable_promocode && promocode === promoCodeVal
            ? t('remove')
            : t('apply')}
        </button>
      </div>

      <div className={`flex flex-wrap gap-3 pb-4 border-b ${alexandriaFont}`}>
        {promoCodesSuccess && promoCodes && !isEmpty(promoCodes.data) && (
          <>
            {promoCodes.data.map((prmocode_item) => {
              return (
                <div
                  onClick={() => {
                    setPromoCodeVal(prmocode_item);
                  }}
                  className={`flex items-center gap-x-1 rounded-full border ${
                    promocode === prmocode_item
                      ? 'border-[#12B76A] text-[#12B76A]'
                      : 'border-[#B7B1AE]'
                  } w-fit text-sm py-1 px-3 cursor-pointer`}
                >
                  {promocode === prmocode_item ? (
                    <GreenCheckIcon />
                  ) : (
                    <PromocodeIcon />
                  )}
                  {prmocode_item}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
export default PromoCode;
