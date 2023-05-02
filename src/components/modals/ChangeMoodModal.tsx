import { FC } from "react"
import MainModal from "./MainModal";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';import { map } from "lodash";
import Link from "next/link";
import { appLinks, arboriaFont, gessFont, mainBtnClass, suppressText } from "@/constants/*";
import { useRouter } from "next/router";
import PickupIcon from '@/appIcons/pickup.svg';
import DeliveryIcon from '@/appIcons/delivery.svg';
import { PlaceOutlined, WatchLaterOutlined, ArrowForwardIos } from '@mui/icons-material';

type Props = {
    isOpen: boolean;
    onRequestClose: () => void;
};
const ChangeMoodModal: FC<Props> = ({ isOpen, onRequestClose }):JSX.Element => {
    const { t } = useTranslation();
    const router = useRouter();
    const addresses = [
        { id: 1, name: 'most selling'},
        { id: 2, name: 'special offers'},
        { id: 3, name: 'beef'},
        { id: 4, name: 'chicken'}
    ]
    return (
        <>
            <MainModal 
                isOpen={isOpen} 
                closeModal={onRequestClose}
            >
                <div>
                    <div className="flex lg:grid lg:grid-cols-3 w-full pb-5 px-4">
                        <div className="w-1/3">
                            <button
                                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                                onClick={onRequestClose}
                            >
                                <ExpandMoreIcon className="text-gray-500" />
                            </button>
                        </div>
                        <h5 className="font-semibold capitalize" suppressHydrationWarning={suppressText}>
                            {t('where_&_when?')}
                        </h5>
                    </div>
                    <div className="border-b-[1px] border-slate-200 flex justify-between px-8">
                        <button
                            className={`md:ltr:mr-3 md:rtl:ml-3 capitalize text-sm font-semibold text-center ${
                            router.locale === 'ar' ? gessFont : arboriaFont
                            }`}
                            suppressHydrationWarning={suppressText}
                        >
                            <span className="flex items-center px-5 capitalize">
                                <DeliveryIcon />
                                <span className="px-3">{t('delivery')}</span>
                            </span>
                            {/* will shown or not according to method */}
                            <div className="w-full h-1 bg-red-500 rounded-tl rounded-tr mt-2"></div>
                        </button>
                        <p></p>
                        <button
                            className={`md:ltr:mr-3 md:rtl:ml-3 capitalize text-sm font-semibold text-center text-gray-500 ${
                            router.locale === 'ar' ? gessFont : arboriaFont
                            }`}
                            suppressHydrationWarning={suppressText}                        >
                            <span className="flex items-center px-7 capitalize">
                                <PickupIcon />
                                <span className="px-5">{t('pickup')}</span>
                            </span>
                            {/* will shown or not according to method */}
                            {/* <div className="w-full h-1 bg-red-500 rounded-tl rounded-tr mt-2"></div> */}
                        </button>
                    </div>
                    <Link href={appLinks.selectArea.path} className="w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 ">
                        <div className="flex justify-between items-center">
                            <PlaceOutlined className="text-red-500" />
                            <div className="px-3 capitalize font-semibold">
                                <h6 className="text-sm text-gray-500 capitalize" suppressHydrationWarning={suppressText}>
                                    {t('delivering_to')}
                                </h6>
                                <p>address</p>
                            </div>
                        </div>
                        <ArrowForwardIos className="text-zinc-500 mt-2" />
                    </Link>
                    <Link href={appLinks.orderSchedule.path} className="w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 ">
                        <div className="flex justify-between items-center">
                            <WatchLaterOutlined className="text-red-500" />
                            <div className="px-3 capitalize text-sm font-semibold">
                                <h6 className="text-sm text-gray-500" suppressHydrationWarning={suppressText}>{t('deliver_in')}</h6>
                                <p suppressHydrationWarning={suppressText}>{t('now_within_20_minutes')}</p>
                            </div>
                        </div>
                        <ArrowForwardIos className="text-zinc-500 mt-2" />
                    </Link>
                    <div className="px-5 mt-10">
                        <button 
                            className={`${mainBtnClass} disabled:bg-stone-400`}
                            suppressHydrationWarning={suppressText}
                            disabled
                        >
                            {t('confirm')}
                        </button>   
                    </div>
                </div>
            </MainModal>
        </>
    )
}
export default ChangeMoodModal;