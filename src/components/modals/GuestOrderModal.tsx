import { FC, useState } from "react"
import MainModal from "./MainModal";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { modalBtnRed, suppressText } from "@/constants/*";


const GuestOrderModal: FC = ():JSX.Element => {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const { t } = useTranslation();
    const [value, setValue] = useState();

    return (
        <>
            <button className="bg-white text-black" onClick={() => setIsOpen(true)}>
                open guest order modal
            </button>
            <MainModal 
                isOpen={isOpen} 
                closeModal={() => setIsOpen(false)}
            >
                <div>
                    <div className="flex lg:grid lg:grid-cols-3 w-full pb-5 px-4">
                        <div className="w-1/3">
                            <button
                                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                                onClick={() => setIsOpen(false)}
                            >
                                <ExpandMoreIcon className="text-gray-500" />
                            </button>
                        </div>
                        <h5 className="font-semibold capitalize ps-6 md:ps-28 lg:ps-8" suppressHydrationWarning={suppressText}>
                            {t('guest_info')}
                        </h5>
                    </div>
                    <div className="px-4">
                        <form className="capitalize">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="full name" 
                                    id="full name"  
                                    className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[1px] border-gray-200 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                                <label 
                                    htmlFor="full_name"  
                                    className="absolute  text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-gray-400 peer-focus:dark:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                                    suppressHydrationWarning={suppressText}
                                >
                                    {t('full_name')}
                                </label>
                            </div>
                            <div className="py-5">
                                <label htmlFor="phone number" className="text-gray-500" suppressHydrationWarning={suppressText}>
                                    {t('phone_number')}
                                </label>
                                <PhoneInput
                                    defaultCountry="KW"
                                    value={value}
                                    onChange={phone => console.log({ phone })}
                                    className="focus:outline-none"
                                />
                            </div>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[1px] border-gray-200 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                                <label 
                                    htmlFor="email" 
                                    className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-gray-400 peer-focus:dark:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                                    suppressHydrationWarning={suppressText}
                                >
                                {t('email_optional')}
                                </label>
                            </div>
                            <div className="border-t-[1px] border-gray-200 px-4 pt-4 mt-20">
                            <button 
                                className={`${modalBtnRed}`}
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
    )
}
export default GuestOrderModal;