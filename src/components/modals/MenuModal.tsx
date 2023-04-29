import { FC, useState } from "react"
import MainModal from "./MainModal";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';import { map } from "lodash";
import Link from "next/link";
const MenuModal: FC = ():JSX.Element => {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const { t } = useTranslation();
    const products = [
        { id: 1, name: 'most selling'},
        { id: 2, name: 'special offers'},
        { id: 3, name: 'beef'},
        { id: 4, name: 'chicken'}
    ]
    return (
        <>
            <button className="bg-white text-black" onClick={() => setIsOpen(true)}>
                open menu modal
            </button>
            <MainModal 
                isOpen={isOpen} 
                closeModal={() => setIsOpen(false)}
            >
                <div>
                    <div className="flex w-[90%] p-4">
                        <div className="w-1/2">
                            <button
                                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                                onClick={() => setIsOpen(false)}
                            >
                                <ExpandMoreIcon className="text-gray-500" />
                            </button>
                        </div>
                        <h5 className="font-semibold capitalize">{t('menu')}</h5>
                    </div>
                    {map(products, (product) => (
                        <Link 
                            href={'/'} 
                            key={product.id} 
                            className="border-t-[1px] border-slate-200 block px-4 py-2 font-semibold capitalize"
                        >
                            <p>{product.name}</p>
                        </Link>
                    ))}
                </div>
            </MainModal>
        </>
    )
}
export default MenuModal;