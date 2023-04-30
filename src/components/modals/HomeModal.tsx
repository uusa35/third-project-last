import { useTranslation } from "react-i18next";
import Modal from 'react-modal';
import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { suppressText } from "@/constants/*";
type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
};
const HomeModal: FC<Props> = ({
  isOpen,
  onRequestClose
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { isRTL }
  } = useAppSelector((state) => state);
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={`w-full mx-auto lg:w-2/4 xl:w-1/3 rounded-t-lg border-white h-1/4 ${isRTL ? 'right-0' : 'left-0'}`}
            style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}
            shouldFocusAfterRender={false}
        > 
            <div
                className={`bg-red-600 rounded-lg absolute w-[90%] lg:w-2/4 xl:w-1/3 top-[50%] translate-y-[-50%] ${
                isRTL ? ' right-5' : 'left-5'
                }`}
            >
                <div
                    className={`flex justify-between items-start px-4 space-x-2 py-4 w-full ${
                        isRTL && `flex-row-reverse`
                    }`}
                >
                    <div dir={`${isRTL ? 'rtl' : 'ltr'}`}>
                        <div className="text-2xl uppercase w-[80%] leading-8">
                            <p className="font-semibold" suppressHydrationWarning={suppressText}>
                              {t('get_your_favourite_food_in')} 
                              <span className="text-amber-500 px-1" suppressHydrationWarning={suppressText}>
                                {t('20_mins')}
                              </span>!
                            </p>
                            <p className="text-sm pt-2" suppressHydrationWarning={suppressText}>
                                {t('get')} 
                                <span className="text-amber-500 px-1" suppressHydrationWarning={suppressText}>{t('50%_off')}</span> 
                                {t('for_new_user!')}
                            </p>
                        </div>
                        <div className="flex items-center pt-5 pb-28 capitalize">
                            <p suppressHydrationWarning={suppressText}>{t('use_coupon')}</p>
                            <p className="ms-5 bg-white text-black text-center w-24 h-6 text-sm pt-[1px] flex items-center  justify-center border-[1px] rounded-full border-dashed border-black">
                                First50
                            </p>
                        </div>
                    </div>
                    <button
                    className={`mt-2`}
                    onClick={onRequestClose}
                    >
                    <XMarkIcon className={`w-6 h-6 text-black text-base bg-white rounded-full p-1`} />
                    </button>
                </div>
                <div className="px-5 pb-5">
                    <button 
                      className="bg-white text-black w-full text-md font-semibold rounded-full h-8 pt-1 pb-8 mx-auto capitalize" 
                      suppressHydrationWarning={suppressText}>
                      {t('apply_coupon')}
                    </button>
                </div>
            </div>
      </Modal>
    )
  }


export default HomeModal;
