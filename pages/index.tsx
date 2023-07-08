import HomeVendorMainInfo from '@/components/home/HomeVendorMainInfo';
import MainContentLayout from '@/layouts/MainContentLayout';
import { setLocale } from '@/redux/slices/localeSlice';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { AppQueryResult, Category } from '@/types/queries';
import { HomePromoCode, Vendor } from '@/types/index';
import {
  useGetHomePromocodeQuery,
  useLazyGetVendorQuery,
  vendorApi,
} from '@/redux/api/vendorApi';
import MainHead from '@/components/MainHead';
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useLazyGetCategoriesQuery } from '@/redux/api/categoryApi';
import { useLazyGetProductsQuery } from '@/redux/api/productApi';
import ProductListView from '@/components/home/ProductListView';
import { filter, isEmpty, isNull, map } from 'lodash';
import CategoryWidget from '@/components/widgets/CategoryWidget';
import { alexandriaFontBold, suppressText } from '@/constants/*';
import AppFooter from '@/components/AppFooter';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import ContentLoader from '@/components/skeletons';
import CheckoutFixedBtn from '@/components/CheckoutFixedBtn';
import DeliveryPickup from '@/components/home/DeliveryPickup';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';
import AdsScrollBar from '@/components/home/AdsScrollBar';
import { setUrl } from '@/redux/slices/appSettingSlice';
import HomeModal from '@/components/modals/HomeModal';
import UpcomingOrders from '@/components/home/UpcomingOrders';
import { NextPage } from 'next';

type Props = {
  element: Vendor;
  currentLocale: string;
  url: string;
};

const Home: NextPage<Props> = ({
  url,
  element,
  currentLocale,
}): React.ReactElement => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    searchParams: { destination, method },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const DestinationId = useAppSelector(destinationId);
  const desObject = useAppSelector(destinationHeaderObject);
  const router = useRouter();
  const [openPromoModal, setOpenPromoModal] = useState(true);

  useEffect(() => {
    if (!isNull(url)) {
      dispatch(setUrl(url));
    }
  }, []);

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
  }, [element.id, method, destination, url, DestinationId]);

  const getVendor = () => {
    triggerGetVendor(
      {
        lang,
        url,
        destination: desObject,
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
        // page: `1`,
        // limit: `30`,
        destination: desObject,
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
  }, [router.locale, DestinationId, method]);

  // get promo modal data
  const {
    data: homePromocodeData,
    isLoading: homePromocodeLoading,
    isSuccess: homePromocodeSuccess,
  } = useGetHomePromocodeQuery<{
    data: AppQueryResult<HomePromoCode[]>;
    isSuccess: boolean;
    isLoading: boolean;
  }>(
    {
      lang,
      url,
    },
    { refetchOnMountOrArgChange: true }
  );

  // store is closed modal====> api

  // order status
  // close modal when to show it
  // line 149 in index home mdify category

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
        <div className="bg-white lg:border-t-4 lg:border-stone-100 border-none relative lg:top-auto  pt-0 lg:pt-1 min-h-screen">
          {vendorSuccess || vendorElement || vendorElement?.Data ? (
            <>
              {/* sm screen header */}
              <Header CoverImg={vendorElement?.Data?.cover ?? ''} />
              {/*  HomePage vendor info */}
              <div className={`px-4 mt-3 lg:mt-0`}>
                <HomeVendorMainInfo element={vendorElement} />
              </div>
              {/* ads scroller */}
              <AdsScrollBar slider={vendorElement?.Data?.slider ?? []} />
              <DeliveryPickup url={url} />
            </>
          ) : (
            <div>
              <ContentLoader type="Home" sections={1} />
            </div>
          )}

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
                  'THEME_TWO_CATEGORY_LIST' ? (
                  <>
                    <UpcomingOrders />
                    <div className="px-4">
                      <p
                        className={`relative text-md font-bold py-4 text-lg ${alexandriaFontBold}`}
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
                  </>
                ) : (
                  CategoriesProducts &&
                  !isEmpty(CategoriesProducts.Data) && (
                    <ProductListView
                      productCategories={filter(
                        CategoriesProducts.Data,
                        (c: Category) => c.items && c.items.length > 0
                      )}
                    />
                  )
                )}
              </div>

              {/* in sm screens only */}
              <Footer element={vendorElement?.Data} />
              <CheckoutFixedBtn url={url} />
              {homePromocodeSuccess &&
                homePromocodeData?.data &&
                !isEmpty(homePromocodeData?.data) && (
                  <HomeModal
                    data={homePromocodeData?.data}
                    isOpen={openPromoModal}
                    onRequestClose={() => {
                      setOpenPromoModal(false);
                    }}
                  />
                )}
            </>
          )}
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default Home;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      if (!url) {
        return { notFound: true };
      }
      if (store.getState().locale.lang !== locale) {
        store.dispatch(setLocale(locale));
      }
      store.dispatch(setUrl(url));
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
      if (isError || !element.Data || !element) {
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
