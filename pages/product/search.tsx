import AppHeader from '@/components/AppHeader'
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppSelector } from '@/redux/hooks';
import { wrapper } from '@/redux/store';
import { useRouter } from 'next/router';
import React, { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { West, East } from '@mui/icons-material';
import { appLinks, arboriaFont, suppressText, imageSizes } from '@/constants/*';
import Link from 'next/link';
import CustomImage from "@/components/CustomImage";
import { themeColor } from "@/redux/slices/vendorSlice";
import Image from "next/image";
import NoProductFound from '@/appImages/no_product.png';
import { isNull } from 'lodash';
import TextTrans from '@/components/TextTrans';

type Props = {
  url: string;
};

export default function search({ url }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchKey, setSearchKey] = useState('');
  const color = useAppSelector(themeColor);
  const {
    locale: { lang },
    // branch: { id: branchId },
    // area: { id: areaId },
    vendor: { logo },
  } = useAppSelector((state) => state);

  const handleSearch = (value: string) => {
    setSearchKey(value);
    console.log({ searchKey });
  }
  return (
    <>
    {searchKey === '' ? (
      <Suspense>
      <MainHead
        title={t('search_products')}
        description={`${t('search_products')}`}
        mainImage={`${logo}`}
      />
      <MainContentLayout url={url}>
      <div className="flex justify-start items-center p-3 sticky top-0 z-50 w-full capitalize bg-white border-b-2 border-gray-200">
        <button
            onClick={() => router.back()}
            className={`flex justify-start items-center pt-1`}
          >
            {router.locale === 'en' ? (
              <West />
            ) : (
              <East />
            )}
        </button>
        <input
          type="search"
          name="search"
          id="search"
          defaultValue={searchKey}
          onChange={(e) => handleSearch(e.target.value)}
          className={`flex-1 px-5 py-3 h-12 text-lg capitalize foucs:ring-0 outline-none ${arboriaFont}`}
          suppressHydrationWarning={suppressText}
          placeholder={`${t('search')}`}
        />
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold pb-3" suppressHydrationWarning={suppressText}>
          {t('popular_search')}
        </h3>
        <div className="flex items-center flex-wrap">
            <div className="p-1 ps-0">
              <button className="bg-gray-100 rounded-full w-fit h-10 px-3 flex justify-center items-center"
                onClick={() => setSearchKey(`product name`)}
              >
                product name
              </button>
            </div>
        </div>
      </div>
      </MainContentLayout>
    </Suspense>
    ) : (
      <Suspense>
     <MainHead
       title={`product name`}
       description={`product name`}
     // mainImage={`${logo}`}
   />
   <MainContentLayout url={url}>
   <div className="flex justify-start items-center p-3 sticky top-0 z-50 w-full capitalize bg-white border-b-2 border-gray-200">
        <button
            onClick={() => setSearchKey('')}
            className={`flex justify-start items-center pt-1`}
          >
            {router.locale === 'en' ? (
              <West />
            ) : (
              <East />
            )}
        </button>
        <p className="px-4">product name</p>
      </div>
     <div className="p-5">
     <div className="flex justify-between">
         <div className="flex flex-col space-y-2">
           <TextTrans 
             en="product name"
             ar="اسم المنتج"
             className="text-base font-semibold"
           />
           <TextTrans
             en="product description"
             ar="وصف المنتج"
             className="text-gray-500"
           />
           <div className="flex items-center space-x-2 pb-1">
             <p className="px-3 h-9 pt-1 w-fit border-[1px] rounded-full" style={{borderColor: color}}>
               price {t('kwd')}
             </p>
             <button className="text-white text-xl pb-1 w-9 h-9 rounded-full" style={{backgroundColor: color}}>
               +
             </button>
           </div>
           <p className="bg-gray-100 text-sm text-gray-600 rounded-full h-9 px-3 pt-2">
             {t('limited_quantity_will_end_soon')}
           </p>
         </div>
         <CustomImage
           src={''}
           alt={'product image'}
           className=""
           width={imageSizes.xs}
           height={imageSizes.xs}
         />
       </div>
    </div>

     <div className="flex justify-center items-center h-[75vh]">
       <div className="flex flex-col items-center space-y-2">
         <Image 
           src={NoProductFound} 
           alt='no product found' 
           width={150} 
           height={150} 
         />
         <h4 className="font-semibold" suppressHydrationWarning={suppressText}>{t('no_product_were_found')}</h4>
         <p className="text-gray-600" suppressHydrationWarning={suppressText}>{t('check_the_speling_or_try_searching_again')}</p>
       </div>
     </div>
   </MainContentLayout>
    </Suspense>
    )}
    </>
  )
}
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);