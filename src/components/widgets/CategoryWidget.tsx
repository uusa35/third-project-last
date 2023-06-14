import { FC } from 'react';
import { Category } from '@/types/queries';
import CustomImage from '@/components/CustomImage';
import {
  alexandriaFontSemiBold,
  appLinks,
  imageSizes,
  imgUrl,
} from '@/constants/*';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { isNull, kebabCase, lowerCase } from 'lodash';
import { suppressText } from '@/constants/*';
import TextTrans from '@/components/TextTrans';
import { motion } from 'framer-motion';

type Props = {
  element: Category;
};
const CategoryWidget: FC<Props> = ({ element }) => {
  // const {
  //   branch,
  //   area,
  //   appSetting: { method },
  // } = useAppSelector((state) => state);

  return (
    <motion.div whileTap={{ opacity: 1 }} whileHover={{ opacity: 0.8 }}>
      <Link
        href={'#'}
        className={`aspect-square shadow-lg rounded-lg capitalize `}
        suppressHydrationWarning={suppressText}
        data-cy="category"
      >
        <div className="">
          <div className="aspect-square overflow-hidden rounded-lg">
            <CustomImage
              src={`${imgUrl(element.img)}`}
              alt={element.name}
              width={imageSizes.sm}
              height={imageSizes.sm}
              className="aspect-square w-full object-cover object-center"
            />
          </div>
          <div className="w-full px-2 pt-2 pb-5">
            <p
              className="relative text-md font-bold"
              suppressHydrationWarning={suppressText}
            >
              <TextTrans
                className={`${alexandriaFontSemiBold}`}
                style={{
                  maxWidth: '30ch',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  display: 'block',
                }}
                ar={element.name_ar}
                en={element.name_en}
              />
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryWidget;
