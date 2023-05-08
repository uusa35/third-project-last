import MainHead from '@/components/MainHead';
import { arboriaFont, suppressText } from '@/constants/*';
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
import { debounce, map } from 'lodash';
import TextTrans from '@/components/TextTrans';

type Props = {
  url: string
}

export default function index({ url }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(0);
  const dispatch = useAppDispatch();
  const [allLocations, setAllLocations] = useState<any>();
  const [selectedData, setSelectedData] = useState({
    area: '',
    branch: '',
    method: 'delivery',
  });
  const {
    locale: { lang },
    // area: selectedArea,
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
      setAllLocations(locations?.Data);
    }, [locations])
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

    const Icon = ({ id, open }: { id: number; open: number }) => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            id === open ? 'rotate-180' : ''
          } h-5 w-5 transition-transform grayscale`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      );
    };
    const method = 'delivery'
  return (
    <>
    <MainHead 
      title={t('select_area')}
      description={`${t('select_area')}`}
    />
    <MainContentLayout url={url} showBackBtnHeader currentModule='select_area'>
      <div className="p-5">
        <div className="flex items-center w-full bg-gray-100 rounded-full px-2">
          <Search className="text-zinc-500" />
          <input 
            type="search"
            name="searchArea"
            id="searchArea"
            placeholder={`${t('search_for_cities_and_areas')}`}
            suppressHydrationWarning={suppressText}
            className={`flex-1 px-2 py-3 h-12 bg-transparent text-zinc-600 capitalize foucs:ring-0 outline-none ${arboriaFont}`}
            onChange={debounce((e) => handleChange(e.target.value), 400)}
          />
        </div>
        <div className={`px-4`}>
          {map(allLocations, (item: Location, i) => {
            return (
              <>
              {item.Areas.length > 0 && (
                <Accordion
                key={i}
                open={open === item.id}
                icon={<Icon id={item.id} open={open} />}
              >
                <AccordionHeader
                  className="px-2 pb-0 border-b-0 capitalize"
                  onClick={() => handleOpen(item.id)}
                  suppressHydrationWarning={suppressText}
                  data-cy="accordion"
                >
                  <TextTrans ar={item.name_ar} en={item.name_en} />
                </AccordionHeader>
                <AccordionBody>
                  <div className="bg-LightGray">
                    {map(item.Areas, (a: Area, i) => (
                      <button
                        className={'flex justify-between w-full p-4 '}
                        key={i}
                        onClick={() =>
                          setSelectedData({ ...selectedData, area: a })
                        }
                      >
                        <p
                          className="text-base text-black capitalize"
                          suppressHydrationWarning={suppressText}
                          data-cy="area"
                        >
                          <TextTrans ar={a.name_ar} en={a.name_en} />
                        </p>
                        
                      </button>
                    ))}
                  </div>
                </AccordionBody>
              </Accordion>
              )}
              </>
            );
          })}
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