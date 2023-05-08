import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PromotionIcon from '@/appIcons/promotion.svg';
import PromocodeIcon from '@/appIcons/promocode.svg';

type Props = {};

export default function PromoCode({}: Props) {
  const { t } = useTranslation();
  const [promoCodeVal, setPromoCodeVal] = useState<string | undefined>(
    undefined
  );

  return (
    <div>
      <p className="font-bold">{t('promotions')}</p>
      <div className="flex items-center  gap-x-1 text-sm bg-[#F5F5F5] text-[#877D78] py-2 px-3 rounded-md my-2">
        <div className="flex items-center gap-x-1 w-full">
          <PromotionIcon />
          <input
            className="bg-[#F5F5F5]"
            onChange={(e) => {
              setPromoCodeVal(e.target.value);
            }}
            value={promoCodeVal}
            placeholder={t('add_a_promo_code')}
            type="text"
          />
        </div>
        <button>{t('apply')}</button>
      </div>

      <div className="pb-4 border-b">
        <div
          onClick={() => {
            setPromoCodeVal('hgjhgkjhkjhkj');
          }}
          className="flex items-center gap-x-1 rounded-full border border-[#B7B1AE] w-fit text-sm py-1 px-3 cursor-pointer"
        >
          <PromocodeIcon />
          hgjhgkjhkjhkj
        </div>
      </div>
    </div>
  );
}
