import { FC, useCallback, useState } from "react"
import MainModal from "./MainModal";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import Image from "next/image";
import { 
    SentimentDissatisfied, 
    SentimentVeryDissatisfied,
    SentimentNeutral,
    SentimentSatisfiedOutlined,
    MoodOutlined

} from '@mui/icons-material';
import { map } from "lodash";
import { useRouter } from "next/router";
import { arboriaFont, gessFont, modalBtnContainer, mainBtnClass, suppressText } from "@/constants/*";
import { useAppSelector } from "@/redux/hooks";
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
    isOpen: boolean;
    onRequestClose: () => void;
};
const FeedbackModal: FC<Props> = ({ isOpen, onRequestClose }):JSX.Element => {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        locale: { isRTL },
      } = useAppSelector((state) => state);
      const color = useAppSelector(themeColor);
    const [rateVal, setRateVal] = useState<number>();
    const [value, setValue] = useState();
    const [phone, setPhone] = useState();
    const ratings = [
        { id: 1, icon: <SentimentDissatisfied fontSize="large" /> },
        { id: 2, icon: <SentimentVeryDissatisfied fontSize="large" /> },
        { id: 3, icon: <SentimentNeutral fontSize="large" /> },
        { id: 4, icon: <SentimentSatisfiedOutlined fontSize="large" /> },
        { id: 5, icon: <MoodOutlined fontSize="large" /> },
    ]

    const LimitedTextarea = ({ value }: { value: string }) => {
        const [content, setContent] = useState(value.slice(0, 460));
        const setFormattedContent = useCallback((text: string) => setContent(text.slice(0, 460)),
          [setContent]
        );
      
        return (
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <textarea
              rows={10}
              cols={10}
              onChange={event => setFormattedContent(event.target.value)}
              value={content}
              className="bg-gray-100 w-full resize-none h-32 placeholder:text-gray-500 focus:outline-none"
              placeholder={`${t('your_comment')}`}
            />
            <p className="text-end text-gray-500">
              {content.length}/{460}
            </p>
          </div>
        );
    };
      
        
    return (
        <>
            <MainModal 
                isOpen={isOpen} 
                closeModal={onRequestClose}
            >
                <div>
                    <div className="flex lg:grid lg:grid-cols-3 w-full pb-5 px-4 border-b-[1px] border-gray-200">
                        <div className="w-1/3">
                            <button
                                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                                onClick={onRequestClose}
                            >
                                <ExpandMoreIcon className="text-gray-500" />
                            </button>
                        </div>
                        <h5 className="font-semibold capitalize md:ps-16 lg:ps-4 xl:ps-0" suppressHydrationWarning={suppressText}>
                            {t('leave_a_feedback')}
                        </h5>
                    </div>
                    <div>
                    <div
                        className={`flex justify-between w-[80%] m-auto py-4 ${
                        isRTL && `flex-row-reverse`
                        }`}
                    >
                    {map(ratings, (rate) => (
                        <button
                        key={rate.id}
                        dir={`${isRTL ? 'rtl' : 'ltr'}`}
                        className={`${router.locale === 'ar' ? gessFont : arboriaFont}`}
                        style={{
                            color: rateVal === rate.id ? color : 'text-zinc-400'
                        }}
                        suppressHydrationWarning={suppressText}
                        onClick={() => {
                            setRateVal(rate.id);
                        }}
                        >
                        {rate.icon}
                        </button>
                    ))}
            </div>
            </div>
            <div className="px-4">
                <form className="capitalize">
                    <div className="relative">
                        <input 
                            type="text" 
                            name="name" 
                            id="name"  
                            className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[1px] border-gray-200 appearance-none focus:outline-none focus:ring-0  peer" placeholder=" "
                        />
                        <label 
                            htmlFor="full_name" 
                            className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full text-start"
                            suppressHydrationWarning={suppressText}
                        >
                            {t('your_name_optional')}
                        </label>
                    </div>
                    <div className="py-5">
                        <label htmlFor="phone number" className="text-gray-500" suppressHydrationWarning={suppressText}>
                            {t('phone_number_optional')}
                        </label>
                        <PhoneInput
                            defaultCountry="KW"
                            value={value}
                            onChange={val => console.log({ val })}
                            className="focus:outline-none"
                        />
                    </div>
                    <LimitedTextarea value="" />
                    <div className={`${modalBtnContainer} mt-5`}>
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
    )
}
export default FeedbackModal;