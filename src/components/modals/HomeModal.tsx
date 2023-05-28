import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { imageSizes, suppressText } from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { HomePromoCode } from '@/types/index';
import CustomImage from '../CustomImage';
import { url } from 'inspector';
import { setPromocode } from '@/redux/slices/cartSlice';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  data: HomePromoCode[];
};
const HomeModal: FC<Props> = ({
  isOpen,
  onRequestClose,
  data,
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);

  const ApplyPromocode = () => {
    dispatch(setPromocode(data[0].promo_code));
    dispatch(
      showToastMessage({
        content: 'promo is saved and will be applied to your cart',
        type: `success`,
      })
    );
    onRequestClose();
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
        className={`w-full h-full flex  ${
          isRTL ? 'justify-end' : 'justify-start'
        }`}
      >
        <div className="absolute w-full lg:w-2/4 xl:w-1/3 top-[20%] px-5 h-1/2">
          <div
            className={`relative flex flex-col items-end justify-between rounded-lg h-full`}
            // style={{
            //   backgroundColor: color,
            //   backgroundImage: `url(${data[0].promo_image})`,
            //   backgroundSize: 'auto',
            //   backgroundRepeat: 'no-repeat',
            //   backgroundPosition: 'center',
            // }}
          >
            <div className="h-full w-full">
              <CustomImage
                // src={
                //   'https://html.com/wp-content/uploads/very-large-flamingo.jpg'
                // }
                src={data[0].promo_image}
                width={100}
                height={100}
                alt="cover img"
                className="object-fill w-full h-full rounded-lg"
              />
            </div>
            <div className="absolute h-full w-full flex flex-col justify-between items-end z-10 py-5 rounded-lg">
              <button className={`mt-2 px-5 pb-5`} onClick={onRequestClose}>
                <XMarkIcon
                  className={`w-6 h-6 text-black text-base bg-white rounded-full p-1`}
                />
              </button>

              {/* apply copon btn */}
              <div className="px-5 pb-5 w-full">
                <button
                  onClick={() => ApplyPromocode()}
                  className="bg-white text-black w-full text-md font-semibold rounded-full h-8 pt-1 pb-8 mx-auto capitalize"
                  suppressHydrationWarning={suppressText}
                >
                  {t('apply_coupon')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HomeModal;
