import { suppressText } from '@/constants/*';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {};

export default function PaymentSummary({}: Props) {
  const { t } = useTranslation();
  return (
    <div className={`px-4 py-2 capitalize text-sm`}>
      <>
        <div className="flex justify-between mb-2">
          <p suppressHydrationWarning={suppressText}>{t('subtotal')} </p>
          <div className={`flex flex-row`}>
            <p
              suppressHydrationWarning={suppressText}
              className={`px-2`}
              data-cy="sub-total"
            >
              {/* {promoEnabled ? coupon.sub_total : subTotal} */}
              15
            </p>
            <p className={`uppercase`} suppressHydrationWarning={suppressText}>
              {t('kwd')}
            </p>
          </div>
        </div>

        {/* {promoEnabled && (
          <>
            <div className="flex justify-between mb-2 text-lg">
              <p suppressHydrationWarning={suppressText}>
                {t('coupon_value')}{' '}
              </p>
              <div className={`flex flex-row`}>
                <p
                  suppressHydrationWarning={suppressText}
                  className={`px-2 text-red-600`}
                >
                  {coupon.promo_code_discount}
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

        {(promoEnabled && coupon.tax) || tax ? (
          <div className="flex justify-between mb-2 text-lg">
            <p suppressHydrationWarning={suppressText}>{t('tax')} </p>
            <div className={`flex flex-row`}>
              <p suppressHydrationWarning={suppressText} className={`px-2`}>
                {promoEnabled ? coupon.tax : tax}
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
              <p
                suppressHydrationWarning={suppressText}
                className={`px-2`}
                data-cy="deliveryFees"
              >
                {promoEnabled
                  ? coupon.free_delivery === false
                    ? coupon.delivery_fee
                    : 0
                  : isNull(delivery_fees)
                  ? 0
                  : delivery_fees}
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
        )} */}

        <div className="flex justify-between mb-2 border-t pt-1 mt-1">
          <p suppressHydrationWarning={suppressText}>{t('net_total')}</p>
          <div className={`flex flex-row`}>
            <p suppressHydrationWarning={suppressText} className={`px-2`}>
              {/* {promoEnabled ? coupon.total_cart_after_tax : total} */}
              15
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
