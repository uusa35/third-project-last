import HomeVendorMainInfo from '@/components/home/HomeVendorMainInfo';
import MainContentLayout from '@/layouts/MainContentLayout';
import { setLocale } from '@/redux/slices/localeSlice';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { AppQueryResult } from '@/types/queries';
import { Vendor } from '@/types/index';
import { useLazyGetVendorQuery, vendorApi } from '@/redux/api/vendorApi';
import MainHead from '@/components/MainHead';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useLazyGetCategoriesQuery } from '@/redux/api/categoryApi';
import { useLazyGetProductsQuery } from '@/redux/api/productApi';
import ProductListView from '@/components/home/ProductListView';
import { isEmpty } from 'lodash';
import CategoryListView from '@/components/home/CategoryListView';

type Props = {
  element: Vendor;
  currentLocale: string;
  url: string;
};
export default function Home({ url, element, currentLocale }: Props) {
  const { t } = useTranslation();
  const {
    locale: { lang },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [
    triggerGetCategories,
    { data: categories, isSuccess: categoriesSuccess },
  ] = useLazyGetCategoriesQuery();
  const [
    triggerGetProducts,
    { data: CategoriesProducts, isSuccess: CategoriesProductsSuccess },
  ] = useLazyGetProductsQuery();
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();

  useEffect(() => {
    // dispatch(setCurrentModule('home'));
    // dispatch(setShowFooterElement('home'));
    getVendor();
  }, [element.id]);

  // useEffect(() => {
  //   if (vendorSuccess && vendorElement && vendorElement.Data) {
  //     if (vendorElement?.Data?.delivery_pickup_type === 'pickup') {
  //       dispatch(setCartMethod('pickup'));
  //       dispatch(removeArea());
  //     } else if (vendorElement?.Data?.delivery_pickup_type === 'delivery') {
  //       dispatch(setCartMethod('delivery'));
  //       dispatch(removeBranch());
  //     }
  //   }
  // }, [vendorSuccess, method, branch_id, area_id]);

  const getVendor = () => {
    triggerGetVendor(
      {
        lang,
        url,
        // branch_id: method !== `pickup` ? branch_id : ``,
        // area_id: method === `pickup` ? area_id : ``,
      },
      false
    );
  };

  useEffect(() => {
    triggerGetProducts(
      {
        url,
        lang: router.locale,
        category_id: ``,
        page: `1`,
        limit: `30`,
        // branch_id: branch_id.toString(),
        // area_id: area_id.toString(),
      },
      true
    );
    triggerGetCategories(
      {
        lang: router.locale,
        url,
      },
      true
    );
  }, [
    router.locale,
    // , branch_id, area_id
  ]);

  return (
    <Suspense fallback={<div>loading</div>}>
      {/* SEO Head DEV*/}
      <MainHead
        title={currentLocale === 'ar' ? element.name_ar : element.name_en}
        description={element.desc}
        mainImage={`${element.logo}`}
        icon={`${element.logo}`}
        phone={element.phone}
        twitter={element.twitter}
        facebook={element.facebook}
        instagram={element.instagram}
      />
      <MainContentLayout>
        <div className="bg-white border-t-4 border-stone-100 lg:border-none rounded-none relative lg:top-auto  pt-1 lg:pt-0 min-h-screen">
          {/*  HomePage Header */}
          <div className={`px-5 mt-3 lg:mt-0`}>
            <HomeVendorMainInfo url={url} />
          </div>

          {!vendorSuccess ||
          !vendorElement ||
          !vendorElement.Data ||
          !categoriesSuccess ||
          !categories ||
          !categories.Data ||
          !CategoriesProductsSuccess ||
          !CategoriesProducts ||
          !CategoriesProducts.Data ? (
            <div>loading</div>
          ) : (
            <>
              {
                <div className={`py-4 px-2`}>
                  {!isEmpty(categories) &&
                  vendorElement?.Data?.template_type === 'basic_categoryh' ? (
                    <div
                      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-1`}
                    >
                      <CategoryListView />
                    </div>
                  ) : (
                    CategoriesProducts &&
                    !isEmpty(CategoriesProducts.Data) && (
                      <ProductListView
                        CategoriesProducts={CategoriesProducts.Data}
                      />
                    )
                  )}
                </div>
              }
            </>
          )}
        </div>
      </MainContentLayout>
    </Suspense>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      if (store.getState().locale.lang !== locale) {
        store.dispatch(setLocale(locale));
      }
      const {
        data: element,
        isError,
      }: { data: AppQueryResult<Vendor>; isError: boolean } =
        await store.dispatch(
          vendorApi.endpoints.getVendor.initiate({
            lang: locale,
            url,
          })
        );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.status || !element.Data || !element) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          currentLocale: locale,
          url,
        },
      };
    }
);
