import Modal from 'react-modal';
import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
type Props = {
    isOpen: boolean;
    children: JSX.Element;
    closeModal: () => void
};

const MainModal: FC<Props> = ({
  isOpen,
  children,
  closeModal
}): JSX.Element => {
  const {
    locale: { isRTL }
  } = useAppSelector((state) => state);

    return (
      <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={`w-full lg:w-2/4 xl:w-1/3 rounded-t-lg border-white h-1/4 ${isRTL ? 'right-0' : 'left-0'}`}
        style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}
        shouldFocusAfterRender={false}
      >
        <div
          className={`bg-white text-black rounded-t-lg absolute w-full lg:w-2/4 xl:w-1/3 bottom-0 ${
            isRTL ? ' right-0' : 'left-0'
          }`}
        >
        <div className="grid grid-cols-3 pt-2">
          <div></div>
          <button
                onClick={closeModal}
              >
            <span className="block w-32 h-1 bg-zinc-300 rounded-md mx-auto"></span>
          </button>
        </div>
        <div className="pb-4">
          {children}
        </div>      
      </div>
      </Modal>
    </div>
    )
  }


export default MainModal;