import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PromotionIcon from '@/appIcons/promotion.svg';
import PromocodeIcon from '@/appIcons/promocode.svg';
import { useGetPromoCodesQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { isEmpty } from 'lodash';
import { useAppSelector } from '@/redux/hooks';
import GreenCheckIcon from '@/appIcons/check.svg';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';

type Props = {
  url: string;
  handelApplyPromoCode: (value: string | undefined) => void;
};

export default function PromoCode({
  url,
  handelApplyPromoCode = () => {},
}: Props) {
  const { t } = useTranslation();
  const {
    Cart: { promocode, enable_promocode },
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
      <p className="font-bold mt-3">{t('promotions')}</p>
      <div className="flex items-center  gap-x-1 text-sm bg-[#F5F5F5] text-[#877D78] py-2 px-3 rounded-md my-2">
        <div className="flex items-center gap-x-1 w-full">
          <PromotionIcon />
          <input
            className="bg-[#F5F5F5] outline-none"
            onChange={(e) => {
              setPromoCodeVal(e.target.value);
            }}
            value={promoCodeVal}
            placeholder={`${t('add_a_promo_code')}`}
            type="text"
          />
        </div>
        <button onClick={() => handelApplyPromoCode(promoCodeVal)}>
          {enable_promocode ? t('remove') : t('apply')}
        </button>
      </div>

      <div className="pb-4 border-b">
        {promoCodesSuccess && promoCodes && isEmpty(promoCodes.data) && (
          <>
            {promoCodes.data.map((prmocode) => {
              <div
                onClick={() => {
                  setPromoCodeVal(prmocode);
                }}
                className={`flex items-center gap-x-1 rounded-full border ${
                  promocode === prmocode
                    ? 'border-[#12B76A] text-[#12B76A]'
                    : 'border-[#B7B1AE]'
                } w-fit text-sm py-1 px-3 cursor-pointer`}
              >
                {promocode === prmocode ? (
                  <GreenCheckIcon />
                ) : (
                  <PromocodeIcon />
                )}
                {prmocode}
              </div>;
            })}

            {/* remove this part later */}
            <div
              onClick={() => {
                setPromoCodeVal('qweqwe');
              }}
              className={`flex items-center gap-x-1 rounded-full border ${
                promocode === 'qweqwe'
                  ? 'border-[#12B76A] text-[#12B76A]'
                  : 'border-[#B7B1AE]'
              } w-fit text-sm py-1 px-3 cursor-pointer`}
            >
              {promocode === 'qweqwe' ? <GreenCheckIcon /> : <PromocodeIcon />}
              qweqwe
            </div>
          </>
        )}
      </div>
    </div>
  );
}
