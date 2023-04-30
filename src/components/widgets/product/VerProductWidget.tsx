import { FC } from 'react';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
import { Product } from '@/types/index';
import { kebabCase, lowerCase } from 'lodash';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import TextTrans from '@/components/TextTrans';
import { motion } from 'framer-motion';
import { themeColor } from '@/redux/slices/vendorSlice';
import NoFoundImage from '@/appImages/not_found.png';

type Props = {
  element: Product;
  category_id: string | null;
};
const VerProductWidget: FC<Props> = ({
  element,
  category_id = null,
}): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  // const {
  //   branch: { id: branchId },
  //   area: { id: areaId },
  // } = useAppSelector((state) => state);

  return (
    <motion.div whileTap={{ opacity: 1 }} whileHover={{ opacity: 0.8 }}>
      <Link
        href={`${appLinks.productShow(
          element.id
        )}`}
        className={`h-auto shadow-7xl mb-2 block capitalize border-b-2 border-gray-100 py-3`}
      >
        <div className="relative">
          <div className="flex items-center">
            <div className="ps-5 w-[100%] pe-5">
              <p className="text-lg truncate pb-5">
                <TextTrans
                  className={`text-black font-bold`}
                  ar={element.name_ar}
                  en={element.name_en}
                  length={20}
                />
                <TextTrans
                  className={`text-muted`}
                  ar={element.description_ar}
                  en={element.description_en}
                  length={30}
                />
              </p>
              <div>
                <div className={`flex flex-row justify-start items-center`}>
                  {element.new_price && element.new_price !== element.price ? (
                    <div className="text-end">
                      <p
                        className="uppercase line-through"
                        style={{ color }}
                        suppressHydrationWarning={suppressText}
                      >
                        {element.price} {t('kwd')}
                      </p>
                      <p
                        className=" uppercase"
                        // style={{ color }}
                        suppressHydrationWarning={suppressText}
                      >
                        {element.new_price} {t('kwd')}
                      </p>
                    </div>
                  ) : (
                    <p
                      className="text-md uppercase p-2 rounded-full border border-red-500"
                      suppressHydrationWarning={suppressText}
                      style={{ color: `black` }}
                    >
                      {parseFloat(element.price).toFixed(3) === '0.000' ? (
                        <span className="text-xs">
                          {t(`price_on_selection`)}
                        </span>
                      ) : (
                        parseFloat(element.price).toFixed(3)
                      )}
                      {parseFloat(element.price).toFixed(3) !== '0.000' && (
                        <span className={`uppercase px-1`}>{t('kwd')}</span>
                      )}
                    </p>
                  )}
                  <div className="text-end mx-8">
                    <button className="w-10 h-10 rounded-full bg-red-600 text-white border border-red-500  uppercase text-center text-xl">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-auto w-auto overflow-hidden rounded-lg">
              <CustomImage
                src={`${element.cover ?? NoFoundImage.src}`}
                alt={element.name}
                width={imageSizes.lg}
                height={imageSizes.lg}
                className="h-36 w-52 object-cover object-center"
              />
            </div>
          </div>
          {/* <div className="absolute inset-x-0 top-0 flex h-full items-end overflow-hidden rounded-lg">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black opacity-60"
          />
        </div> */}
        </div>
      </Link>
    </motion.div>
  );
};

export default VerProductWidget;
