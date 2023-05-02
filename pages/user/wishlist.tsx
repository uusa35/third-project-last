import ProductListView from '@/components/home/ProductListView';
import { imageSizes, suppressText } from '@/constants/*';
import MainContentLayout from '@/layouts/MainContentLayout';
import {
  useGetProductQuery,
  useGetProductsQuery,
  useLazyGetProductsQuery,
} from '@/redux/api/productApi';
import { useAppSelector } from '@/redux/hooks';
import { setCurrentModule, showHeader } from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import { wrapper } from '@/redux/store';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Props = { url: string };

export default function Wishlist({ url }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: categoriesProducts,
    isLoading,
    isSuccess: categoriesProductsSuccess,
  } = useGetProductsQuery<{
    data: any;
    isSuccess: boolean;
    isLoading: boolean;
  }>({
    url,
    lang: router.locale,
    category_id: ``,
    page: ``,
    limit: ``,
  });

  if (isLoading) {
    <p>loading skelton</p>;
  }

  return (
    <MainContentLayout showBackBtnHeader={true} currentModule={'whishlist'}>
      {!isLoading && categoriesProductsSuccess && categoriesProducts.Data && (
        <>
          {isEmpty(categoriesProducts.Data) ? (
            <div className="bg-white h-full px-5 flex flex-col items-center justify-center min-h-screen">
              <div className="flex justify-center items-center py-5">
                <Image
                  src={'/assets/images/empty_wishlist.png'}
                  alt="empty"
                  width={imageSizes.sm}
                  height={imageSizes.sm}
                  className={`xl:!w-${imageSizes.md} xl:!h-${imageSizes.md} `}
                />
              </div>

              <div className="text-center">
                <p
                  suppressHydrationWarning={suppressText}
                  className="font-bold"
                >
                  {t('no_wish_list_for_you_yet')}
                </p>
                <p
                  suppressHydrationWarning={suppressText}
                  className="text-[#544A45] text-sm"
                >
                  {t(
                    'add_something_to_your_wish_list_to_make_it_easier_to_access_it_later'
                  )}
                </p>
              </div>
            </div>
          ) : (
            <ProductListView CategoriesProducts={categoriesProducts.Data} />
          )}
        </>
      )}
    </MainContentLayout>
  );
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
