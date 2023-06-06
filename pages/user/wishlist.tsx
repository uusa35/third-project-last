import ProductListView from '@/components/home/ProductListView';
import VerProductWidget from '@/components/widgets/product/VerProductWidget';
import {
  alexandriaFontBold,
  alexandriaFontLight,
  imageSizes,
  suppressText,
} from '@/constants/*';
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
import EmptyWishList from '@/appIcons/empty_wishlist.svg';
import ContentLoader from '@/components/skeletons';
import Skeleton from 'react-loading-skeleton';
import MainHead from '@/components/MainHead';
import { useGetWishListProductsQuery } from '@/redux/api/CustomerApi';

type Props = { url: string };

export default function Wishlist({ url }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: wishlistProducts,
    isLoading,
    isSuccess: wishlistSuccess,
  } = useGetWishListProductsQuery<{
    data: any;
    isSuccess: boolean;
    isLoading: boolean;
  }>({
    url,
  });

  const handelDeleteFromWishList = (id: number | string) => {
    console.log('in wishlist', id);
  };

  console.log({ wishlistProducts });

  return (
    <MainContentLayout showBackBtnHeader={true} currentModule={'whishlist'}>
      <MainHead title={t('wishlist')} description={`${t('whishlist')}`} />
      {isLoading ? (
        <div>
          <Skeleton height={50} />
          <ContentLoader type={'ProductHorizontal'} sections={5} />
        </div>
      ) : (
        wishlistSuccess &&
        wishlistProducts.Data && (
          <>
            {isEmpty(wishlistProducts.Data) ? (
              <div className="bg-white h-full px-5 flex flex-col items-center justify-center my-5">
                <div className="flex justify-center items-center py-5">
                  <EmptyWishList />
                </div>

                <div className="text-center">
                  <p
                    suppressHydrationWarning={suppressText}
                    className={`${alexandriaFontBold}`}
                  >
                    {t('no_wish_list_for_you_yet')}
                  </p>
                  <p
                    suppressHydrationWarning={suppressText}
                    className={`text-[#544A45] text-sm ${alexandriaFontLight}`}
                  >
                    {t(
                      'add_something_to_your_wish_list_to_make_it_easier_to_access_it_later'
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {wishlistProducts.Data.map((product: any) => {
                  return (
                    <div>
                      <VerProductWidget
                        delete_function={handelDeleteFromWishList}
                        show_delete_icon={true}
                        element={product}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )
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
