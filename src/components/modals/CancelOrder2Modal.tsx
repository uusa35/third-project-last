import { FC, useState } from "react"
import MainModal from "./MainModal";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';import { map, upperFirst } from "lodash";
import { useRouter } from "next/router";
import { modalBtnRed, suppressText } from "@/constants/*";

const CancelOrder2Modal: FC = ():JSX.Element => {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const { t } = useTranslation();
    const router = useRouter();
    return (
        <>
            <button className="bg-white text-black" onClick={() => setIsOpen(true)}>
                open cancel order 2 modal
            </button>
            <MainModal 
                isOpen={isOpen} 
                closeModal={() => setIsOpen(false)}
            >
                <div>
                    <div className="flex justify-between w-full px-4 pt-5">
                        <h5 className="text-gray-500" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('cancel_order')}`)}`} 
                        </h5>
                        <button
                            className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                            onClick={() => setIsOpen(false)}
                        >
                            <ExpandMoreIcon className="text-gray-500" />
                        </button>
                    </div>
                    <div className="px-4 pb-2">
                        <h4 className="font-bold text-lg pb-2" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('why_did_you_cancel_this_order?')}`)}`}
                        </h4>
                        <p className="text-sm font-semibold pb-4 space-x-1" suppressHydrationWarning={suppressText}>
                            <span>
                                {`${upperFirst(`${t('a_cancellation_of')}`)}`}
                            </span>
                            <span>
                                (refund) 
                            </span>
                            <span>
                                {t('kd')} 
                            </span>
                            <span>
                                {t('has_been_issued_back_to_your_original_payment_method.')}
                            </span>
                            <span>
                                {`${upperFirst(`${t('this_may_take_3_business_days_to_reflect.')}`)}`}
                            </span>
                        </p>
                    </div>
                    <div 
                        className="border-t-[1px] border-gray-200 px-4 flex items-end space-x-5 pt-4" 
                        suppressHydrationWarning={suppressText}>
                            <button 
                                className={`${modalBtnRed}`}
                            >
                                {`${upperFirst(`${t('confirm_cancellation')}`)}`}
                            </button>       
                    </div>
                </div>
            </MainModal>
        </>
    )
}
export default CancelOrder2Modal;