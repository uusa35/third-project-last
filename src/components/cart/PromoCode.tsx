import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PromotionIcon from '@/appIcons/promotion.svg';
import PromocodeIcon from '@/appIcons/promocode.svg';
import {
  useGetPromoCodesQuery,
} from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { isEmpty } from 'lodash';

type Props = {
  url: string;
  handelApplyPromoCode: (value: string | undefined) => void;
};

export default function PromoCode({
  url,
  handelApplyPromoCode = () => {},
}: Props) {
  const { t } = useTranslation();
  const [promoCodeVal, setPromoCodeVal] = useState<string | undefined>(
    undefined
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
      area_branch: { 'x-area-id': 26 },
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
        <button onClick={() => handelApplyPromoCode(promoCodeVal)}>{t('apply')}</button>
      </div>

      <div className="pb-4 border-b">
        {promoCodesSuccess && promoCodes && isEmpty(promoCodes.data) && (
          <>
            {promoCodes.data.map((prmocode) => {
              <div
                onClick={() => {
                  setPromoCodeVal(prmocode);
                }}
                className="flex items-center gap-x-1 rounded-full border border-[#B7B1AE] w-fit text-sm py-1 px-3 cursor-pointer"
              >
                <PromocodeIcon />
                {prmocode}
              </div>;
            })}

            {/* remove this part later */}
            <div
              onClick={() => {
                setPromoCodeVal('hgjhgkjhkjhkj');
              }}
              className="flex items-center gap-x-1 rounded-full border border-[#B7B1AE] w-fit text-sm py-1 px-3 cursor-pointer"
            >
              <PromocodeIcon />
              hgjhgkjhkjhkj
            </div>
          </>
        )}
      </div>
    </div>
  );
}
