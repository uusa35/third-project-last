import { FC, Suspense } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { useTranslation } from 'react-i18next';
// import ProductShowFooter from './footer/ProductShowFooter';
// import CartIndexFooter from './footer/CartIndexFooter';
// import CartAddressFooter from './footer/CartAddressFooter';
// import CutomerInfoFooter from './footer/CutomerInfoFooter';
// import ReviewOrderFooter from './footer/ReviewOrderFooter';

type Props = {
  handleSubmit?: (element?: any) => void;
  handleIncreaseProductQty?: () => void;
  handleDecreaseProductQty?: () => void;
  productCurrentQty?: number | undefined;
  productOutStock?: boolean | undefined;
};

const AppFooter: FC<Props> = ({
  handleSubmit,
  handleDecreaseProductQty,
  handleIncreaseProductQty,
  productCurrentQty,
  productOutStock,
}): JSX.Element => {
  const {t}=useTranslation()
  // const {
  //   appSetting: { showFooterElement, method, url },
  //   customer: { userAgent },
  //   locale: { isRTL },
  //   branch: { id: branchId },
  //   area,
  // } = useAppSelector((state) => state);
  // const {
  //   data: cartItems,
  //   isSuccess,
  //   refetch: refetchCart,
  // } = useGetCartProductsQuery({
  //   UserAgent: userAgent,
  //   area_branch:
  //     method === `pickup`
  //       ? { 'x-branch-id': branchId }
  //       : { 'x-area-id': area.id },
  //   url,
  // });

  return (
    <Suspense>
      <footer className={`w-full px-3 text-center text-xs`}>
        <p className=" font-bold">{t('rights_reserved')}</p>
        <p className=" py-1 pb-2 text-zinc-500">{t('powered_by_queue')}</p>
      </footer>
    </Suspense>
  );
};

export default AppFooter;
