import Image from "next/image";
import { FC, useState } from "react"
import MainModal from "./MainModal";
import User from '@/appImages/user.png';
import { useTranslation } from "react-i18next";
import { upperFirst } from "lodash";
import { useRouter } from "next/router";
import { modalBtnRed, suppressText } from "@/constants/*";
const Address2Modal: FC = ():JSX.Element => {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const { t } = useTranslation();
    const router = useRouter();
    
    return (
        <>
            <button className="bg-white text-black" onClick={() => setIsOpen(true)}>
                open address3 modal
            </button>
            <MainModal 
                isOpen={isOpen} 
                closeModal={() => setIsOpen(false)}
            >
                <div>
                    <div className="flex flex-col items-center px-5">
                        <h5 className="font-bold capitalize pt-1" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('we_ve_noticed_it_s_a_different_area')}`)}`}
                        </h5>
                        <div className="space-x-1 pb-8 pt-2 text-center text-sm text-slate-500 w-[80%] mx-auto break-words">
                            <span suppressHydrationWarning={suppressText}>
                                {`${upperFirst(`${t('this_location_is_out_of_the_selected_area.')}`)}`}
                            </span>
                            <span suppressHydrationWarning={suppressText}>
                                {`${upperFirst(`${t('please_set_another_location_on_the_map_or_change_the_area')}`)}`}
                            </span>
                        </div>
                        
                    </div>
                    <div className="border-t-[1px] border-gray-200 px-4 flex items-end space-x-5">
                            <button 
                                className={`${modalBtnRed}`}
                                suppressHydrationWarning={suppressText}
                            >
                                {`${upperFirst(`${t('change_area')}`)}`}
                            </button>   
                            <button 
                                className="bg-slate-100 text-black w-full text-md font-semibold rounded-full h-10 pt-2 pb-8 mx-auto mt-3"
                                suppressHydrationWarning={suppressText}
                                onClick={() => router.back()}
                            >
                                {`${upperFirst(`${t('back')}`)}`}
                            </button>     
                    </div>
                </div>
            </MainModal>
        </>
    )
}
export default Address2Modal;