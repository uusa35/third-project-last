import { FC, useState } from "react"
import MainModal from "./MainModal";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';import { map } from "lodash";
import Link from "next/link";
import { appLinks, arboriaFont, gessFont, mainBtnClass, suppressText } from "@/constants/*";
import { useRouter } from "next/router";
import PickupIcon from '@/appIcons/pickup.svg';
import DeliveryIcon from '@/appIcons/delivery.svg';
import { PlaceOutlined, WatchLaterOutlined, ArrowForwardIos } from '@mui/icons-material';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from "@/redux/hooks";

type Props = {
    isOpen: boolean;
    onRequestClose: () => void;
};
const ChangeMoodModal: FC<Props> = ({ isOpen, onRequestClose }):JSX.Element => {
    const { t } = useTranslation();
    const router = useRouter();
    const color = useAppSelector(themeColor);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const { destination, method } = useAppSelector((state) => state);
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
                                <ExpandMoreIcon />
                            </button>
                        </div>
                        <h5 className="font-semibold capitalize" suppressHydrationWarning={suppressText}>
                            {t('where_&_when?')}
                        </h5>
                    </div>
                    
                    <div className="border-b-[1px] border-slate-200 flex justify-between px-8">
                        <ul className="flex justify-between w-full">
                            <li
                                onClick={() => setActiveTabIndex(0)}
                                className={activeTabIndex === 0 ? 'active' : ''}
                            >
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
                                    {activeTabIndex === 0 && <div className="w-full h-1 rounded-tl rounded-tr mt-2" style={{ backgroundColor: color }}></div>}
                                </button>
                            </li>
                            <li
                                onClick={() => setActiveTabIndex(1)}
                                className={activeTabIndex === 1 ? 'active' : ''}
                            >
                                <button
                                    className={`md:ltr:mr-3 md:rtl:ml-3 capitalize text-sm font-semibold text-center text-gray-500 ${
                                    router.locale === 'ar' ? gessFont : arboriaFont
                                    }`}
                                    suppressHydrationWarning={suppressText}                        >
                                    <span className="flex items-center px-7 capitalize">
                                        <PickupIcon />
                                        <span className="px-5">{t('pickup')}</span>
                                    </span>
                                    {activeTabIndex === 1 && <div className="w-full h-1 rounded-tl rounded-tr mt-2" style={{ backgroundColor: color }}></div>}
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div>
                            {activeTabIndex === 0 && (
                            <>
                                <Link href={appLinks.selectArea.path} className="w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 ">
                                    <div className="flex justify-between items-center">
                                        <PlaceOutlined style={{ color }} />
                                        <div className="px-3 capitalize font-semibold">
                                            <h6 className="text-sm text-gray-500 capitalize" suppressHydrationWarning={suppressText}>
                                                {t('delivering_to')}
                                            </h6>
                                            <p>{t('select_address')}</p>
                                        </div>
                                    </div>
                                    <ArrowForwardIos className="text-zinc-500 mt-2" />
                                </Link>
                            </>
                            )}
                            {activeTabIndex === 1 && (
                            <>
                                <Link href={appLinks.selectBranch.path} className="w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 ">
                                    <div className="flex justify-between items-center">
                                        <PlaceOutlined style={{ color }} />
                                        <div className="px-3 capitalize font-semibold">
                                            <h6 className="text-sm text-gray-500 capitalize" suppressHydrationWarning={suppressText}>
                                                {t('pickup_from')}
                                            </h6>
                                            <p>{t('select_branch')}</p>
                                        </div>
                                    </div>
                                    <ArrowForwardIos className="text-zinc-500 mt-2" />
                                </Link>
                            </>
                            )}
                            <Link href={appLinks.orderSchedule.path} className="w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 ">
                                <div className="flex justify-between items-center">
                                    <WatchLaterOutlined style={{ color }} />
                                    <div className="px-3 capitalize text-sm font-semibold">
                                        <h6 className="text-sm text-gray-500" suppressHydrationWarning={suppressText}>
                                            {activeTabIndex === 0 ? t('delivery_in') : t('pickup_in')}
                                        </h6>
                                        <p suppressHydrationWarning={suppressText}>{t('now_within_20_minutes')}</p>
                                    </div>
                                </div>
                                <ArrowForwardIos className="text-zinc-500 mt-2" />
                            </Link>
                        </div>
                    <div className="px-5 mt-10">
                        <button 
                            className={`${mainBtnClass} disabled:bg-stone-400`}
                            style={{ backgroundColor: color }}
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