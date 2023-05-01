import Image from "next/image";
import { FC, useState } from "react"
import MainModal from "./MainModal";
import ChangeMood from '@/appImages/change_mood.png';
import { useTranslation } from "react-i18next";
import { upperFirst } from "lodash";
import { imgUrl, mainBtnClass, suppressText } from "@/constants/*";
import CustomImage from "../CustomImage";
type Props = {
    isOpen: boolean;
    onRequestClose: () => void;
};
const ChangeMood3Modal: FC<Props> = ({ isOpen, onRequestClose }):JSX.Element => {
    const { t } = useTranslation();
    
    return (
        <>
            <MainModal 
                isOpen={isOpen} 
                closeModal={onRequestClose}
            >
                <div className="flex flex-col items-center px-5 pt-4">
                    <CustomImage
                        src={ChangeMood}
                        alt={t('change_mood')}
                        width={120} 
                        height={120}  
                    />
                    <h5 className="font-bold pt-3" suppressHydrationWarning={suppressText}>
                        {`${upperFirst(`${t('your_item_is_not_available')}`)}`}
                    </h5>
                    <div className="space-x-1 pb-8 pt-2 text-center text-sm text-slate-500 w-[80%] mx-auto break-words">
                        <span suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('we_are_sorry_about_that_the_item_is_not_available_in_this_branch.')}`)}`}
                        </span>
                        <span suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('please_change_the_branch_or_re-order_again')}`)}`}
                        </span>
                    </div>
                    <button 
                        className={`${mainBtnClass}`}
                        suppressHydrationWarning={suppressText}
                    >
                        {t('change_branch')}
                    </button>   
                    <button 
                        className={`bg-gray-200 text-black w-full text-md font-semibold rounded-full h-10 pt-2 pb-8 mx-auto mt-3 capitalize`}
                        suppressHydrationWarning={suppressText}
                    >
                        {t('change_order')}
                    </button>     
                </div>
            </MainModal>
        </>
    )
}
export default ChangeMood3Modal;