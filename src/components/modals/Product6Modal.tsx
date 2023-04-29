import Image from "next/image";
import { FC, useEffect, useState } from "react"
import MainModal from "./MainModal";
import User from '@/appImages/user.png';
import { useTranslation } from "react-i18next";
import { upperFirst } from "lodash";
import { modalBtnRed, suppressText } from "@/constants/*";
import CustomImage from "../CustomImage";
type Props = {
    isOpen: boolean;
    onRequestClose: () => void;
};
  
const Product6Modal: FC<Props> = ({ isOpen, onRequestClose }):JSX.Element => {
    const { t } = useTranslation();
    
    return (
        <>
            <MainModal 
                isOpen={isOpen} 
                closeModal={onRequestClose}
            >
                <div>
                    <div className="flex flex-col items-center px-5 pt-4">
                        <CustomImage 
                            src={User} 
                            alt={t('user')} 
                            width={120} 
                            height={120} 
                        />
                        <h5 className="font-bold pt-3" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('sign_in/')}`)}`}
                            {`${upperFirst(`${t('register')}`)}`}
                            <span className="px-1">{t('to_add_favourite')}</span>
                        </h5>
                        <div className="space-x-1 pb-8 pt-2 text-center text-sm text-slate-500 w-[80%] mx-auto break-words">
                            <span suppressHydrationWarning={suppressText}>
                                {`${upperFirst(`${t('you_first_need_to_sign_in_register_to_add_something_to_your_favourite_list')}`)}`}
                            </span>
                        </div>
                        
                    </div>
                    <div className="border-t-[1px] border-gray-200 px-4 pt-4">
                            <button 
                                className={`${modalBtnRed}`}
                                suppressHydrationWarning={suppressText}
                            >
                                {`${upperFirst(`${t('sign_in/')}`)}`}
                                {`${upperFirst(`${t('register_an_account')}`)}`}
                            </button>   
                            <button 
                                className="bg-slate-100 text-black w-full text-md font-semibold rounded-full h-10 pt-2 pb-8 mx-auto mt-3"
                                suppressHydrationWarning={suppressText}
                                onClick={onRequestClose}
                            >
                                {`${upperFirst(`${t('skip_for_now')}`)}`}
                            </button>  
                    </div>   
                </div>
            </MainModal>
        </>
    )
}
export default Product6Modal;