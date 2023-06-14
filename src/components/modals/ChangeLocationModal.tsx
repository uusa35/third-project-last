import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useLazyChangeLocationQuery } from '@/redux/api/locationApi';
import { suppressText } from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { Area, Branch } from '@/types/queries';

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  url: string;
  selectedMethod: 'pickup' | 'delivery';
  area_branch: Area | Branch;
  changeLocation: (
    destination: Branch | Area,
    type: 'pickup' | 'delivery'
  ) => void;
};

const ChangeLocationModal: FC<Props> = ({
  isOpen,
  onRequestClose,
  selectedMethod,
  area_branch,
  changeLocation,
  url,
}): React.ReactElement => {
  const { t } = useTranslation();
  const {
    locale: { isRTL },
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);

  const [triggerChangeLocation] = useLazyChangeLocationQuery();

  const handleChangeLocationReq = async () => {
    await triggerChangeLocation({
      UserAgent: userAgent,
      area_branch:
        selectedMethod === `pickup`
          ? { 'x-branch-id': area_branch.id }
          : { 'x-area-id': area_branch.id },
      url,
    }).then(() => {
      changeLocation(area_branch, selectedMethod);
      onRequestClose();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={`w-full mx-auto ${isRTL ? 'right-0' : 'left-0'}`}
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 100 },
      }}
      shouldFocusAfterRender={false}
    >
      <div
        className={`w-full h-full flex   ${
          isRTL ? 'justify-end' : 'justify-start'
        }`}
      >
        <div className="absolute w-full lg:w-2/4 xl:w-1/3 top-[20%] px-5 h-1/2 flex flex-col items-center">
          <div className=" bg-white rounded-lg w-full h-full">
            <div className="mt-5">
              {/* <CustomImage
            src={ChangeBranch.src}
            alt="change"
            width={imageSizes.xs}
            height={imageSizes.xs}
            className="h-auto w-auto"
          /> */}
            </div>
            <p
              suppressHydrationWarning={suppressText}
              className="text-center text-lg font-semibold mb-3 mt-5 capitalize font-tajwal-medium"
            >
              {t(`${'You_’re_about_to_change_your_location'}`)}
            </p>
            <p
              suppressHydrationWarning={suppressText}
              className="text-start text-sm capitalize font-tajwal-medium"
            >
              {t(
                `${'changing_your_location_might_result_in_removing_the_items_from_your_cart'}`
              )}
            </p>
            <div
              suppressHydrationWarning={suppressText}
              className="flex justify-between w-full pt-5 gap-x-2 px-0 lg:px-5 capitalize font-tajwal-medium"
            >
              <button
                onClick={onRequestClose}
                suppressHydrationWarning={suppressText}
                className="capitalize font-tajwal-medium"
                style={{ color }}
              >
                {t('cancel')}
              </button>
              <button
                suppressHydrationWarning={suppressText}
                onClick={() => {
                  handleChangeLocationReq();
                }}
                className="capitalize font-tajwal-medium"
                style={{ color }}
              >
                {t('change')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeLocationModal;
