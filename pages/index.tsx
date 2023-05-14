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
import { isEmpty, isNull, map } from 'lodash';
import CategoryWidget from '@/components/widgets/CategoryWidget';
import { suppressText } from '@/constants/*';
import AppFooter from '@/components/AppFooter';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import ContentLoader from '@/components/skeletons';
import CheckoutFixedBtn from '@/components/CheckoutFixedBtn';
import DeliveryPickup from '@/components/home/DeliveryPickup';
import { destinationId, destinationObject } from '@/redux/slices/searchParamsSlice';

type Props = {
  element: Vendor;
  currentLocale: string;
  url: string;
};
export default function Home({ url, element, currentLocale }: Props) {
  const { t } = useTranslation();
  const {
    locale: { lang },
    searchParams: { destination, method },
  } = useAppSelector((state) => state);
  const DestinationId = useAppSelector(destinationId);
  const desObject = useAppSelector(destinationObject);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // console.log('desObject',desObject)

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
    getVendor();
  }, [element.id]);

  const getVendor = () => {
    triggerGetVendor(
      {
        lang,
        url,
        destination:desObject
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
        destination:desObject
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
  }, [router.locale, DestinationId]);

  // delivery and pickup section====>  data is missing
  // ads section=====>  api is missing
  // store is closed modal====> api

  return (
    <Suspense>
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
          {/* sm screen header */}
          {vendorSuccess || vendorElement || vendorElement?.Data ? (
            <>
              <Header CoverImg={vendorElement?.Data?.cover ?? ''} />
              {/*  HomePage vendor info */}
              <div className={`px-4 mt-3 lg:mt-0`}>
                <HomeVendorMainInfo element={vendorElement} />
              </div>
              <DeliveryPickup />
            </>
          ) : (
            <div>
              <ContentLoader type="Home" sections={1} />
            </div>
          )}

          <Suspense fallback={<div>cats</div>}>
            {!vendorSuccess ||
            !vendorElement ||
            !vendorElement.Data ||
            !categoriesSuccess ||
            !categories ||
            !categories.Data ||
            !CategoriesProductsSuccess ||
            !CategoriesProducts ||
            !CategoriesProducts.Data ? (
              <div>
                <ContentLoader type="ProductHorizontal" sections={8} />
              </div>
            ) : (
              <>
                <div className={`py-4`}>
                  {!isEmpty(categories) &&
                  vendorElement?.Data?.template_type ===
                    'basic_categorymbjmb' ? (
                    <div className="px-4">
                      <p
                        className="relative text-md font-bold pb-4"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('categories')}
                      </p>
                      <div
                        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-y-1 gap-x-3`}
                      >
                        {map(categories.Data, (c, i) => (
                          <CategoryWidget element={c} key={i} />
                        ))}
                      </div>
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

                {/* in sm screens only */}
                <Footer element={vendorElement?.Data} />
                {/* <CheckoutFixedBtn /> */}
              </>
            )}
          </Suspense>
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
