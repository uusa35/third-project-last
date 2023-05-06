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
} from '@heroicons/react/24/outline';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useLazyGetLocationsQuery } from '@/redux/api/locationApi';
import { useLazyGetBranchesQuery } from '@/redux/api/branchApi';
import { AppQueryResult, Branch, Location } from '@/types/queries';
import { useEffect, useState } from 'react';
import { map } from 'lodash';
import TextTrans from '@/components/TextTrans';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import { themeColor } from '@/redux/slices/vendorSlice';
import { Icon } from '@mui/material';
import { suppressText } from '@/constants/*';
import { CheckCircle, CircleOutlined } from '@mui/icons-material';
import { destinationId } from '@/redux/slices/searchParamsSlice';

type Props = {
  element: Vendor;
  url: string;
};

const SelectArea: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const {
    locale: { lang, isRTL },
    searchParams: { method, desintion },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const [open, setOpen] = useState(0);
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
    { data: locations, isLoading: locationsLoading },
  ] = useLazyGetLocationsQuery<{
    data: AppQueryResult<Location[]>;
    isLoading: boolean;
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
  console.log('branches', branches);
  console.log('loca', locations);
  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="addresses"
    >
      <div className="flex flex-1 flex-col min-h-screen">
        <div className="flex flex-row w-full h-auto justify-center items-center p-6">
          <MagnifyingGlassIcon
            className={`absolute ltr:left-14 rtl:right-14 text-gray-500 w-8 h-8 pt-1`}
          />
          <input
            type="text"
            className={`w-full h-14 rounded-full mx-2 bg-gray-100 border border-stone-100 ltr:pl-20 rtl:pr-20`}
            placeholder={`${t('search_for_cities_and_areas')}`}
          />
        </div>
        {map(branches.Data, (b: Branch, i) => (
          <div key={i} className="px-3 py-6 border-b border-gray-100">
            <TextTrans ar={b.name_ar} en={b.name_en} />
          </div>
        ))}
        <h1>locations</h1>
        <div className={``}>
          {map(locations.Data, (item: Location, i) => {
            return (
              <>
                {item.Areas?.length > 0 && (
                  <Accordion
                    key={i}
                    open={open === item.id}
                    icon={<Icon id={item.id} open={open} />}
                  >
                    <AccordionHeader
                      className="flex w-full"
                      onClick={() => handleOpen(item.id)}
                      suppressHydrationWarning={suppressText}
                      data-cy="accordion"
                    >
                      <TextTrans
                        ar={item.name_ar}
                        en={item.name_en}
                        className="flex w-full mx-4"
                      />
                      <ChevronDownIcon className="text-black w-6 h-6" />
                    </AccordionHeader>
                    <AccordionBody>
                      <div className="bg-LightGray mx-4">
                        {map(item.Areas, (a: Area, i) => (
                          <button
                            className={'flex justify-between w-full space-y-4'}
                            key={i}
                            // onClick={() =>
                            //   setSelectedData({ ...selectedData, area: a })
                            // }
                          >
                            <p
                              className="flex flex-1 text-base text-black capitalize "
                              suppressHydrationWarning={suppressText}
                              data-cy="area"
                            >
                              <TextTrans ar={a.name_ar} en={a.name_en} />
                            </p>
                            {a.id === selectedData.area.id ? (
                              <CheckCircle
                                style={{ color }}
                                className="text-black w-6 h-6 mr-4"
                              />
                            ) : (
                              <CircleOutlined className="text-black w-6 h-6 mr-4" />
                            )}
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
