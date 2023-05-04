import MainHead from '@/components/MainHead';
import { arboriaFont } from '@/constants/*';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from '@mui/icons-material';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import { useLazyGetLocationsQuery } from '@/redux/api/locationApi';
import { AppQueryResult, Location } from '@/types/queries';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { debounce } from 'lodash';

type Props = {
  url: string,
  previousRoute
}

export default function index({ url }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(0);
  const dispatch = useAppDispatch();
  const [allLocations, setAllLocations] = useState<any>();
  const {
    locale: { lang },
    area: selectedArea,
    branch,
    // customer: { userAgent },
    appSetting: { method: method_type }
  } = useAppSelector((state) => state);
  const handleOpen = (value: any) => {
    setOpen(open === value ? 0 : value);
  };
  const [triggerGetLocations, { data: locations, isLoading: locationsLoading }] =
    useLazyGetLocationsQuery<{
      data: AppQueryResult<Location[]>;
      isLoading: boolean;
    }>();
    useEffect(() => {
      // dispatch(setShowFooterElement(`select_method`));
      // triggerGetBranches({ lang, url, type: method }, false);
      triggerGetLocations({ lang, url, type: 'delivery' }, false);    
      if (url) {
        dispatch(setUrl(url));
      }
      // () => refetchCart();
    }, []);
    const handleChange = (area: any) => {
      if(area === '') {
        setAllLocations(locations.Data);
      }
      else {
        const filteredAreas = locations.Data.filter((item) => 
          item.Areas.some((a) => a.name.toLowerCase().includes(area)));
        setAllLocations(filteredAreas);
        setOpen(filteredAreas[0].id);
      }
    }
  return (
    <>
    <MainHead 
      title={t('select_area')}
      description={`${t('select_area')}`}
    />
    <MainContentLayout url={url} showBackBtnHeader currentModule='select_area'>
      <div className="p-5">
        <div className="flex items-center w-full bg-gray-100 rounded-full">
          <Search className="text-zinc-500" />
          <input 
            type="search"
            name="searchArea"
            id="searchArea"
            placeholder={`${t('search_for_cities_and_areas')}`}
            className={`flex-1 px-5 py-3 h-12 bg-transparent text-lg text-zinc-600 capitalize foucs:ring-0 outline-none ${arboriaFont}`}
            onChange={debounce((e) => handleChange(e.target.value), 400)}
          />
        </div>
      </div>
    </MainContentLayout>
    </>
  )
}
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      // const { method }: any = query;
      // if (!method) {
      //   return {
      //     notFound: true,
      //   };
      // }
      return {
        props: {
          previousRoute: req.headers.referer ?? null,
          // method,
          url: req.headers.host,
        },
      };
    }
);