import {
  alexandriaFont,
  alexandriaFontSemiBold,
  suppressText,
} from '@/constants/*';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ServerCart } from '../types';
import { useAppSelector } from '@/redux/hooks';
import { isNull } from 'lodash';

type Props = {
  data: ServerCart;
  isFailure?: boolean
};

export default function PaymentSummary({ data, isFailure= false }: Props) {
  const { t } = useTranslation();
  const {
    searchParams: { method },
    cart: { enable_promocode, promocode },
  } = useAppSelector((state) => state);

  return (
    <div className={`py-2 capitalize text-sm ${alexandriaFont}`}>
      <>
        <div className="flex justify-between mb-2">
          <p suppressHydrationWarning={suppressText}>{t('subtotal')} </p>
          <div className={`flex flex-row`}>
            <p
              suppressHydrationWarning={suppressText}
              className={`px-2`}
              data-cy="sub-total"
            >
              {/* {enable_promocode ? data.sub_total : data.subTotal} */}
              {isFailure && data.subtotal}
              {!isFailure && data.promo_code_discount ? data.sub_total : data.subTotal}
            </p>
            <p className={`uppercase`} suppressHydrationWarning={suppressText}>
              {t('kwd')}
            </p>
          </div>
        </div>

        {/* {enable_promocode && ( */}
        {data.promo_code_discount && (
          <>
            <div className="flex justify-between mb-2">
              <p suppressHydrationWarning={suppressText}>
                {t('coupon_value')}{' '}
              </p>
              <div className={`flex flex-row`}>
                <p
                  suppressHydrationWarning={suppressText}
                  className={`px-2 text-red-600`}
                >
                  {data.promo_code_discount}
                </p>
                <p
                  className={`uppercase text-red-600`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('kwd')}
                </p>
              </div>
            </div>
          </>
        )}

        {/* {(enable_promocode && data.tax)  */}
        {(data.promo_code_discount && data.tax) || data.tax ? (
          <div className="flex justify-between mb-2">
            <p suppressHydrationWarning={suppressText}>{t('tax')} </p>
            <div className={`flex flex-row`}>
              <p suppressHydrationWarning={suppressText} className={`px-2`}>
                {/* {enable_promocode ? data.tax : tax} */}
                {data.tax}
              </p>
              <p
                className={`uppercase`}
                suppressHydrationWarning={suppressText}
              >
                %
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}

        {method === 'delivery' ? (
          <div className="flex justify-between mb-2">
            <p suppressHydrationWarning={suppressText}>{t('delivery_fees')}</p>
            <p suppressHydrationWarning={suppressText}></p>
            <div className={`flex flex-row`}>
              <p suppressHydrationWarning={suppressText} className={`px-2`}>
                {/* {enable_promocode */}
                {data.promo_code_discount
                  ? data.free_delivery === false
                    ? data.delivery_fee
                    : 0
                  : isNull(data.delivery_fees)
                  ? 0
                  : data.delivery_fees}
              </p>
              <p
                className={`uppercase`}
                suppressHydrationWarning={suppressText}
              >
                {t('kwd')}
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div
          className={`flex justify-between mb-2 border-t pt-2 mt-1 ${alexandriaFontSemiBold}`}
        >
          <p suppressHydrationWarning={suppressText}>{t('net_total')}</p>
          <div className={`flex flex-row`}>
            <p suppressHydrationWarning={suppressText} className={`px-2`}>
              {/* {enable_promocode  */}
              {data.promo_code_discount
                ? data.total_cart_after_tax
                : data.total}
            </p>
            <p className={`uppercase`} suppressHydrationWarning={suppressText}>
              {t('kwd')}
            </p>
          </div>
        </div>
      </>
    </div>
  );
}
