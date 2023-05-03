import CustomImage from '@/components/CustomImage';
import TextTrans from '@/components/TextTrans';
import { imageSizes, suppressText } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import {
  CheckBoxes,
  ProductCart,
  QuantityMeters,
  RadioBtns,
} from '@/types/index';
import { isEmpty, map } from 'lodash';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

type Props = { product: ProductCart };

export default function CartProduct({ product }: Props) {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  return (
    <div className="flex border-b py-4">
      <div className="w-1/4">
        <CustomImage
          src={''}
          alt={'product img'}
          className=""
          width={imageSizes.xs}
          height={imageSizes.xs}
        />
      </div>
      <div className="flex justify-between gap-x-1 w-full">

        {/* name and addons and qty meter*/}
        <div>
          <TextTrans
            className={`font-semibold capitalize`}
            ar={product.ProductNameAr}
            en={product.ProductNameEn}
            length={15}
          />
          {/* addons products */}
          <div className="flex mb-1">
            <div className="w-fit pb-2 pt-1">
              <div className={`flex gap-1 w-auto flex-wrap`}>
                {!isEmpty(product.QuantityMeters) &&
                  map(product.QuantityMeters, (q: QuantityMeters, i) => (
                    <Fragment key={i}>
                      {map(q.addons, (addon, i) => (
                        <>
                          <TextTrans
                            key={i}
                            className={`bg-[#F3F2F2] text-[#544A45] px-1 text-xxs capitalize rounded-lg`}
                            ar={`${addon.name_ar} ${addon.Value}X`}
                            en={`${addon.name_en} ${addon.Value}X`}
                          />
                        </>
                      ))}
                    </Fragment>
                  ))}
                {!isEmpty(product.RadioBtnsAddons) &&
                  map(product.RadioBtnsAddons, (r: RadioBtns) => (
                    <Fragment key={r.addons.attributeID}>
                      <TextTrans
                        key={r.addons.attributeID}
                        className={`bg-[#F3F2F2] text-[#544A45] px-1 text-xxs capitalize rounded-lg`}
                        ar={r.addons.name_ar}
                        en={r.addons.name_en}
                      />
                    </Fragment>
                  ))}
                {!isEmpty(product.CheckBoxes) &&
                  map(product.CheckBoxes, (c: CheckBoxes, i) => (
                    <Fragment key={i}>
                      {map(c.addons, (addon, i) => (
                        <TextTrans
                          key={i}
                          className={`bg-[#F3F2F2] text-[#544A45] px-1 text-xxs capitalize rounded-lg`}
                          ar={addon.name_ar}
                          en={addon.name_en}
                        />
                      ))}
                    </Fragment>
                  ))}
              </div>
            </div>
          </div>

          {/* quantity meter */}
          <div className='flex items-center gap-x-2'>
            <div className='rounded-full text-white cursor-pointer h-4 w-4 bg-red-500 flex items-center justify-center'>-</div>
            <label className='text-xs'>{product.Quantity}</label>
            <div className='rounded-full text-white cursor-pointer h-4 w-4 bg-red-500 flex items-center justify-center'>+</div>
          </div>
        </div>

        {/* price */}
        <div className="font-bold text-sm">
          {product.SalePrice !== product.Price ? (
            <div>
              <p
                className="uppercase line-through"
                // style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {product.Price} {t('kwd')}
              </p>
              <p
                className=" uppercase"
                // style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {product.SalePrice} {t('kwd')}
              </p>
            </div>
          ) : (
            <p
              className=" uppercase"
              //   style={{ color }}
              suppressHydrationWarning={suppressText}
            >
              {product.Price} {t('kwd')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}