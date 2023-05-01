import HomeVendorMainInfo from "@/components/home/HomeVendorMainInfo";
import MainContentLayout from "@/layouts/MainContentLayout";
import { setLocale } from "@/redux/slices/localeSlice";
import { wrapper } from "@/redux/store";
import { apiSlice } from '@/redux/api';
import { AppQueryResult } from '@/types/queries';
import { Vendor } from "@/types/index";
import { vendorApi } from "@/redux/api/vendorApi";

type Props = {
  element: Vendor;
  currentLocale: string;
  url: string;
};
export default function Home({ url , element,
  currentLocale,}: Props) {
  return (
    <MainContentLayout>
       {/* SEO Head DEV*/}
       {/* <mainhea
        title={currentLocale === 'ar' ? element.name_ar : element.name_en}
        description={element.desc}
        mainImage={`${element.logo}`}
        icon={`${element.logo}`}
        phone={element.phone}
        twitter={element.twitter}
        facebook={element.facebook}
        instagram={element.instagram}
      /> */}

      <HomeVendorMainInfo url={url}/>
    </MainContentLayout>
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