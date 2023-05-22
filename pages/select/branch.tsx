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
import {
  destinationId,
  setDestination,
} from '@/redux/slices/searchParamsSlice';
import { useRouter } from 'next/router';
import WhenClosedModal from '@/components/modals/WhenClosedModal';

type Props = {
  element: Vendor;
  url: string;
};

const SelectBranch: NextPage<Props> = ({
  element,
  url,
}): React.ReactElement => {
  const {
    locale: { lang, isRTL },
    searchParams: { method, destination },
  } = useAppSelector((state) => state);
  const router = useRouter();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(0);
  const [openStoreClosedModal, setOpenClosedStore] = useState(false);
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

  const handleSelectMethod = (
    destination: Branch,
    type: 'pickup' | 'delivery'
  ) => {
    dispatch(setDestination({ destination, type }));
    if(destination.status === "CLOSE") {
      setOpenClosedStore(true);
      
    }
    else {
      router.back();
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
      currentModule={`${t('select_branch')}`}
    >
      <div className="flex flex-1 flex-col min-h-screen">
        {map(branches.Data, (b: Branch, i) => (
          <button
            onClick={() => handleSelectMethod(b, 'pickup')}
            key={i}
            className="flex flex-row w-full justify-start items-center p-4 border-b border-gray-200"
          >
            <div className="flex flex-col flex-1 justify-start items-start space-y-2">
              <TextTrans
                ar={b.name_ar}
                en={b.name_en}
                className="text-black font-bold "
                length={60}
              />
              <TextTrans
                ar={b.location}
                en={b.location}
                className="text-gray-400 font-bold "
                length={50}
              />
            </div>
            <div className="">
              {method === 'pickup' && destination.id === b.id ? (
                <CheckCircleIcon
                  style={{ color }}
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              ) : isRTL ? (
                <ChevronLeftIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              ) : (
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              )}
            </div>
          </button>
        ))}
      </div>
      <WhenClosedModal 
        isOpen={openStoreClosedModal} 
        onRequestClose={() => setOpenClosedStore(false)} 
      />
    </MainContentLayout>
  );
};

export default SelectBranch;

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
