import { FC, useState } from 'react';
import MainModal from './MainModal';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { mainBtnClass, suppressText, toEn } from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { customerInfoSchema } from 'src/validations';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSaveCustomerInfoMutation } from '@/redux/api/CustomerApi';
import { startCase } from 'lodash';
import { showToastMessage } from '@/redux/slices/appSettingSlice';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  url: string;
};
const GuestOrderModal: FC<Props> = ({
  isOpen,
  closeModal,
  url,
}): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [triggerSaveCustomerInfo] = useSaveCustomerInfoMutation();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(customerInfoSchema),
    defaultValues: {
      id: null,
      name: ``,
      email: ``,
      phone: ``,
    },
  });

  const onSubmit = async (body: any) => {
    await triggerSaveCustomerInfo({
      body,
      url,
    }).then((r: any) => {
      if (r.data && r.data.Data && r.data.status) {
        console.log('r data', r.data.Data);
        // dispatch(setCustomer(r.data.Data));
        // router.push(appLinks.address.path);
        // .then(() => dispatch(setCustomer(r.data.Data)));
      } else {
        dispatch(
          showToastMessage({
            content: `all_fields_r_required`,
            type: 'error',
          })
        );
      }
    });
  };

  return (
    <>
      <MainModal isOpen={isOpen} closeModal={closeModal}>
        <div>
          <div className="flex lg:grid lg:grid-cols-3 w-full pb-5 px-4">
            <div className="w-1/3">
              <button
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                onClick={closeModal}
              >
                <ExpandMoreIcon className="text-gray-500" />
              </button>
            </div>
            <h5
              className="font-semibold capitalize ps-6 md:ps-28 lg:ps-8"
              suppressHydrationWarning={suppressText}
            >
              {t('guest_info')}
            </h5>
          </div>
          <div className="px-4">
            <form className="capitalize" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <input
                  {...register('name')}
                  //   placeholder={`${startCase(`${t('enter_your_name')}`)}`}
                  //   onChange={(e) => setValue('name', toEn(e.target.value))}
                  className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[1px] appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer"
                  style={{ borderBottomColor: '#e5e7eb' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = color)}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                />
                <label
                  htmlFor="name"
                  className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full text-start"
                  suppressHydrationWarning={suppressText}
                >
                  <div>{t('full_name')}</div>
                  <div>
                    {errors?.name?.message && (
                      <p
                        className={`text-base text-red-800 font-semibold py-2 capitalize`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t('name_is_required')}
                      </p>
                    )}
                  </div>
                </label>
              </div>
              <div className="py-5">
                <label
                  htmlFor="phone"
                  className="text-gray-500"
                  suppressHydrationWarning={suppressText}
                >
                  <div>{t('phone_number')}</div>

                  <div>
                    {errors?.phone?.message && (
                      <p
                        className={`text-base text-red-800 font-semibold py-2 capitalize`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t('phone_is_required')}
                      </p>
                    )}
                  </div>
                </label>
                <PhoneInput
                  defaultCountry="KW"
                  {...register('phone')}
                  //   type="text"
                  //   placeholder={`${startCase(`${t('enter_your_name')}`)}`}
                  //   onChange={(e) => setValue('email', e.target.value)}
                  className="focus:outline-none"
                  style={{ borderBottomColor: '#e5e7eb' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = color)}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                />
              </div>
              <div className="relative">
                <input
                  {...register('email')}
                  //   placeholder={`${startCase(`${t('enter_your_email')}`)}`}
                  //   onChange={(e) => setValue('email', e?.target?.value)}
                  className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[1px] border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer"
                  style={{ borderBottomColor: '#e5e7eb' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = color)}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full text-start"
                  suppressHydrationWarning={suppressText}
                >
                  <div>{t('email')}</div>
                  <div>
                    {errors?.email?.message && (
                      <p
                        className={`text-base text-red-800 font-semibold py-2 capitalize`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t('email_is_required')}
                      </p>
                    )}
                  </div>
                </label>
              </div>
              <div className="border-t-[1px] border-gray-200 px-4 pt-4 mt-20">
                <button
                  className={`${mainBtnClass}`}
                  style={{ backgroundColor: color }}
                  suppressHydrationWarning={suppressText}
                >
                  {t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MainModal>
    </>
  );
};
export default GuestOrderModal;
