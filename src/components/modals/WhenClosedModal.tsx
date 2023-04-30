import Image from "next/image";
import { FC, useState } from "react"
import MainModal from "./MainModal";
import Clock from '@/appImages/clock.png';
import { useTranslation } from "react-i18next";
import { upperFirst } from "lodash";
import { modalBtnContainer, modalBtnRed, suppressText } from "@/constants/*";
import CustomImage from "../CustomImage";
const WhenClosedModal: FC = ():JSX.Element => {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const { t } = useTranslation();
    
    return (
        <>
            <MainModal 
                isOpen={isOpen} 
                closeModal={() => setIsOpen(false)}
            >
                <div>
                    <div className="flex flex-col items-center px-5 pt-4">
                        <CustomImage 
                            src={Clock} 
                            alt={t('clock')} 
                            width={100} 
                            height={100} 
                        />
                        <h5 className="font-bold capitalize pt-5" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('store_is_currently_closed')}`)}`}
                        </h5>
                        <div className="space-x-1 pb-8 text-center text-sm text-slate-600 w-[80%] mx-auto">
                            <span suppressHydrationWarning={suppressText}>
                                {`${upperFirst(`${t('dont_worry!')}`)}`}
                            </span>
                            <span suppressHydrationWarning={suppressText}>
                                {`${upperFirst(`${t('you_can_still_browse_offers_and_add_to_cart_for_a_speedy_check_out')}`)}`}
                            </span>
                            <span className="text-black">
                                <span suppressHydrationWarning={suppressText}>{`${upperFirst(`${t('opens_today_at_1000')}`)}`}</span>
                                <span className="uppercase px-1" suppressHydrationWarning={suppressText}>{t('am')}</span>    
                            </span>
                        </div>
                    </div>
                    <div className={`${modalBtnContainer}`}>
                        <button 
                            className={`${modalBtnRed}`}
                            suppressHydrationWarning={suppressText}
                            onClick={() => setIsOpen(false)}
                        >
                            {t('ok_get_it')}
                        </button>    
                    </div>   
                </div>
            </MainModal>
        </>
    )
}
export default WhenClosedModal;