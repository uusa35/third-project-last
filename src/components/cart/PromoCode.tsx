import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PromotionIcon from '@/appIcons/promotion.svg';
import PromocodeIcon from '@/appIcons/promocode.svg';
import { useLazyCheckPromoCodeQuery } from '@/redux/api/cartApi';
import { useAppSelector } from '@/redux/hooks';
import { destinationObject } from '@/redux/slices/searchParamsSlice';

type Props = { url: string };

export default function PromoCode({ url }: Props) {
  const { t } = useTranslation();
  const area_branch = useAppSelector(destinationObject);
  const [promoCodeVal, setPromoCodeVal] = useState<string | undefined>(
    undefined
  );

  console.log('area_branch', area_branch);

  const [triggerCheckPromoCode] = useLazyCheckPromoCodeQuery();

  const handelApplyPromocode = () => {
    /*
    check if cart is not empty 
    check if area or branch exists
    check if promo val is not empty or undef
    if user is logged in or guest   ===> later

    */

    triggerCheckPromoCode({
      userAgent:
        'd972045e-e95b-40c6-be47-238997fef4e9-gmbLgjJ0l6qb4HNf9nGxHkWme7WfsHxF-b600ecbf098431ae282945af21228d14',
      PromoCode: promoCodeVal,
      url,
      area_branch: { 'x-area-id': 26 },
    }).then((r: any) => {
      console.log(r);
      // refetch cart
    });
  };

  return (
    <div>
      <p className="font-bold mt-3">{t('promotions')}</p>
      <div className="flex items-center  gap-x-1 text-sm bg-[#F5F5F5] text-[#877D78] py-2 px-3 rounded-md my-2">
        <div className="flex items-center gap-x-1 w-full">
          <PromotionIcon />
          <input
            className="bg-[#F5F5F5]"
            onChange={(e) => {
              setPromoCodeVal(e.target.value);
            }}
            value={promoCodeVal}
            placeholder={`${t('add_a_promo_code')}`}
            type="text"
          />
        </div>
        <button onClick={() => handelApplyPromocode()}>{t('apply')}</button>
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
