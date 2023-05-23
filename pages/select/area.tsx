import ElementMap from '@/components/address/ElementMap';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import { NextPage } from 'next';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ChevronUpIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useLazyGetLocationsQuery } from '@/redux/api/locationApi';
import { useLazyGetBranchesQuery } from '@/redux/api/branchApi';
import { AppQueryResult, Area, Branch, Location } from '@/types/queries';
import { useEffect, useState } from 'react';
import { debounce, map } from 'lodash';
import TextTrans from '@/components/TextTrans';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import { themeColor } from '@/redux/slices/vendorSlice';
import { Icon } from '@mui/material';
import { appLinks, suppressText } from '@/constants/*';
import { CheckCircle, CircleOutlined } from '@mui/icons-material';
import {
  destinationId,
  setDestination,
} from '@/redux/slices/searchParamsSlice';
import { useRouter } from 'next/router';
import { showToastMessage } from '@/redux/slices/appSettingSlice';

type Props = {
  element: Vendor;
  url: string;
};

const SelectArea: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const {
    locale: { lang, isRTL },
    searchParams: { method, destination },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(0);
  const [allLocations, setAllLocations] = useState<any>();
  const router = useRouter();
  const [selectedData, setSelectedData] = useState({
    area: destinationId,
    branch: destinationId,
    method: method,
  });
  const handleOpen = (value: any) => {
    setOpen(open === value ? 0 : value);
  };
  const [showChangeLocModal, setShowChangeLocModal] = useState<boolean>(false);
  const [
    triggerGetLocations,
    {
      data: locations,
      isLoading: locationsLoading,
      isSuccess: locationsSuccess,
    },
  ] = useLazyGetLocationsQuery<{
    data: AppQueryResult<Location[]>;
    isLoading: boolean;
    isSuccess: boolean;
  }>();
  const [triggerGetBranches, { data: branches, isLoading: branchesLoading }] =
    useLazyGetBranchesQuery<{
      data: AppQueryResult<Branch[]>;
      isLoading: boolean;
    }>();

  useEffect(() => {
    triggerGetBranches({ lang, url, type: method }, false);
    triggerGetLocations({ lang, url, type: method }, false);
  }, []);

  const handleSelectMethod = async (
    destination: Area | Branch,
    type: 'pickup' | 'delivery'
  ) => {
    dispatch(setDestination({ destination, type }));

    dispatch(
      showToastMessage({
        content: `area_selected`,
        type: `success`,
      })
    );
    return router.back();
  };
  useEffect(() => {
    setAllLocations(locations?.Data);
  }, [locations]);

  const handleChange = (area: any) => {
    if (area === '') {
      setAllLocations(locations.Data);
    } else {
      if (locationsSuccess) {
        const filteredAreas = locations?.Data?.filter((item) =>
          item.Areas.some((a) => a.name.toLowerCase().includes(area))
        );
        setAllLocations(filteredAreas);
        if (filteredAreas && filteredAreas.length > 0) {
          setOpen(filteredAreas[0]?.id ?? false);
        }
      }
    }
  };

  const Icon = ({ id, open }: { id: number; open: number }) => {
    return open === id ? (
      <ChevronUpIcon className="flex text-black w-auto h-6 " />
    ) : (
      <ChevronDownIcon className="text-black w-auto h-6" />
    );
  };

  if (
    branchesLoading ||
    locationsLoading ||
    !branches ||
    !branches.Data ||
    !locations ||
    !locations.Data
  ) {
    return <div>loading ...</div>;
  }

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule={`${t('select_area')}`}
    >
      <div className="flex flex-1 flex-col min-h-screen">
        <div className="flex flex-row w-full h-auto justify-center items-center p-6 outline-none">
          <MagnifyingGlassIcon
            className={`absolute ltr:left-14 rtl:right-14 text-gray-500 w-8 h-8 pt-1`}
          />
          <input
            type="text"
            className={`w-full h-14 rounded-full mx-2 bg-gray-100 border border-stone-100 ltr:pl-20 rtl:pr-20 outline-none`}
            placeholder={`${t('search_for_cities_and_areas')}`}
            onChange={debounce((e) => handleChange(e.target.value), 400)}
            suppressHydrationWarning={suppressText}
          />
        </div>

        <div className={`mx-4`}>
          {map(allLocations, (item: Location, i) => {
            return (
              <>
                {item.Areas?.length > 0 && (
                  <Accordion
                    key={i}
                    open={open === item.id}
                    icon={<Icon id={item.id} open={open} />}
                  >
                    <AccordionHeader
                      className="flex w-full justify-between py-4 border-b border-gray-200"
                      onClick={() => handleOpen(item.id)}
                      suppressHydrationWarning={suppressText}
                      data-cy="accordion"
                    >
                      <TextTrans
                        ar={item.name_ar}
                        en={item.name_en}
                        className="flex flex-1 text-lg font-bold"
                        length={60}
                      />
                    </AccordionHeader>
                    <AccordionBody className="p-0 m-0">
                      <div className="">
                        {map(item.Areas, (a: Area, i) => (
                          <button
                            className={
                              'flex w-full justify-between py-4 border-b border-gray-200'
                            }
                            key={i}
                            onClick={() => handleSelectMethod(a, 'delivery')}
                          >
                            <TextTrans
                              ar={a.name_ar}
                              en={a.name_en}
                              className="flex   text-lg font-bold"
                              length={60}
                            />
                            <div className="flex flex-1 justify-end items-end">
                              {destination && a.id === destination.id ? (
                                <CheckCircle
                                  style={{ color }}
                                  className="text-black w-6 h-6 "
                                />
                              ) : (
                                <CircleOutlined className="text-black w-6 h-6 " />
                              )}
                            </div>
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
  );
};

export default SelectArea;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      const { data: element, isError } = await store.dispatch(
        vendorApi.endpoints.getVendor.initiate({ lang: locale, url })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.Data || !url) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          url,
        },
      };
    }
);
