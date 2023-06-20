import React, { Suspense, useEffect } from 'react';
import { ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { tajwalFont } from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import CloseIcon from '@mui/icons-material/Close';
import { toast, TypeOptions } from 'react-toastify';
import { hideToastMessage } from '@/redux/slices/appSettingSlice';
import { useTranslation } from 'react-i18next';

const ToastAppContainer = () => {
  const { t } = useTranslation();
  const {
    locale: { isRTL },
    appSetting: {
      toastMessage: { type, content, showToast },
    },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (showToast) {
  //     // toast(t(content), { type });
  //     // dispatch(hideToastMessage());

  //     // toast(t(content), {
  //     //   type,
  //     //   onClose: () => {
  //     //     dispatch(hideToastMessage());
  //     //   },
  //     // });
  //   }
  // }, [showToast]);

  return (
    <Suspense>
      <ToastContainer
        position={isRTL ? `top-center` : 'top-center'}
        className={`${tajwalFont} shadow-inner font-extrabold text-white text-center lg:w-2/4 xl:w-1/3`}
        // autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        transition={Flip}
        limit={1}
        // closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        pauseOnHover
        // bodyStyle={{ height: 'auto' }}
        style={{
          width: 'max-content',
          minWidth: '300px',
        }}
        theme="colored"
        // progressClassName={`bg-red-900`}
        toastClassName={`p-0 m-0 w-full`}
        //bodyClassName={`p-0 m-0 w-full`}
        // toastStyle={{
        //   backgroundColor: type === `error` ? `red` : '#12b764',
        //   color: `white`,
        //   fontSize: '14px',
        // }}
        closeButton={
          <div className="flex items-center">
            <CloseIcon style={{ color: `white` }} />
          </div>
        }
      />
    </Suspense>
  );
};

export default ToastAppContainer;
