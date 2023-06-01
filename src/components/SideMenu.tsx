import React, { Suspense } from 'react';
import { ReactBurgerMenu, slide as Menu } from 'react-burger-menu';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
// import SideMenuSkelton from '@/components/sideMenu/SideMenuSkelton';
import Link from 'next/link';
import {
  alexandriaFontBold,
  alexandriaFontMeduim,
  appLinks,
  convertColor,
  imageSizes,
  imgUrl,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import {
  Close,
  ShoppingBagOutlined,
  ListAltOutlined,
  Restaurant,
  FavoriteBorderOutlined,
  LocationOnOutlined,
  BoltOutlined,
  ChevronRightOutlined,
} from '@mui/icons-material';
import { setLocale } from '@/redux/slices/localeSlice';
import CustomImage from '@/components/CustomImage';
import { isEmpty } from 'lodash';
// import LoadingSpinner from '@/components/LoadingSpinner';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import HorizentalLine from './HorizentalLine';
import AppFooter from './AppFooter';

import FastSignInIcon from '@/appIcons/fast_signin.svg';
import MenuIcon from '@/appIcons/more_menu.svg';
import CartIcon from '@/appIcons/more_cart.svg';
import OrdersIcon from '@/appIcons/more_orders.svg';
import WishlistIcon from '@/appIcons/more_love.svg';
import AddressIcon from '@/appIcons/more_address.svg';
import { signOut } from '@/redux/slices/customerSlice';

type Props = {};

const SideMenu: FC<Props> = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    appSetting,
    customer: { id: guest_id, token, name },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  // for test
  const auth = { guest: true, user: false };

  return (
    <Suspense fallback={<div>loading skeleton</div>}>
      <Menu
        right={router.locale === 'ar'}
        isOpen={appSetting.sideMenuOpen}
        onClose={() => {
          dispatch(hideSideMenu());
        }}
        className="!w-full lg:!w-2/4 xl:!w-1/3 bg-white"
        itemListClassName="overflow-auto"
        customBurgerIcon={false}
        customCrossIcon={false}
      >
        <div
          style={{ display: 'flex' }}
          className="flex-col justify-between  bg-white h-full outline-none capitalize"
        >
          <div>
            <header className="">
              {/* close btn and more */}
              <div className="flex items-center p-4">
                <p
                  className="cursor-pointer capitalize"
                  id="CloseMenuBtn"
                  onClick={() => dispatch(hideSideMenu(undefined))}
                  suppressHydrationWarning={suppressText}
                >
                  <Close fontSize="small" className={`h-4 w-4`} />
                </p>
                <p className="w-full text-center font-semibold">{t('more')}</p>
              </div>
              <HorizentalLine className="h-1" />

              {/* user or guest section */}
              {/* {(guest_id || token) && ( */}
                <div className="bg-slate-100 rounded-md mx-4 my-2 p-3">
                  {!token && (
                    <Link
                      className="flex justify-between items-center"
                      href={appLinks.login.path}
                    >
                      <div className="flex gap-x-2">
                        <FastSignInIcon />
                        <p
                          className={`${alexandriaFontMeduim}`}
                          suppressHydrationWarning={suppressText}
                        >
                          <span className={`${alexandriaFontBold}`}>
                            {t('sign_in')}
                          </span>{' '}
                          {t('to_orderfast_now')}
                        </p>
                      </div>
                      <ChevronRightOutlined />
                    </Link>
                  )}
                  {token && (
                    <div className="flex justify-between items-center">
                      <div className="flex gap-x-1">
                        {/* img */}
                        <div className="rounded-full h-5 w-5"></div>
                        <div>
                          <p className="text-sm">{t('Welcome_back')} !</p>
                          <p className="font-bold">{name}</p>
                        </div>
                      </div>
                      <button 
                        className="bg-white rounded-xl text-sm font-semibold px-2 py-px"
                        onClick={()=> dispatch(signOut())}
                      >
                        {t('sign_out')}
                      </button>
                    </div>
                  )}
                </div>
              {/* )} */}
            </header>

            {/* links */}
            <div className="flex-col px-4  gap-y-2 my-5">
              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                replace={false}
                href={appLinks.home.path}
              >
                <MenuIcon fill={color} />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('menu')}
                </p>
              </Link>

              <HorizentalLine className="my-3" />

              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                href={appLinks.cart.path}
              >
                <CartIcon stroke={color} />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('my_cart')}
                </p>
              </Link>
              <HorizentalLine className="my-3" />

              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                href={appLinks.orderHistory.path}
              >
                <OrdersIcon stroke={color} />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('my_orders')}
                </p>
              </Link>
              <HorizentalLine className="my-3" />

              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                href={appLinks.wishlist.path}
              >
                <WishlistIcon stroke={color} fill="none" />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('wishlist')}
                </p>
              </Link>
              <HorizentalLine className="my-3" />

              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                href={appLinks.userAddresses.path}
              >
                <AddressIcon stroke={color} />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('my_addresses')}
                </p>
              </Link>
              <HorizentalLine className="my-3" />
            </div>
          </div>

          <AppFooter />
        </div>
      </Menu>
    </Suspense>
  );
};

export default SideMenu;
