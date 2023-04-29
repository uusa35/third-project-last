import { appLinks, suppressText } from "@/constants/*";
import Link from "next/link";
import React from "react";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { setLocale } from "@/redux/slices/localeSlice";
import {
  hideSideMenu,
  showSideMenu,
  showToastMessage,
} from "@/redux/slices/appSettingSlice";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from "react-i18next";

export default function AsideHeader() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    appSetting: { sideMenuOpen },
    locale: { otherLang },
  } = useAppSelector((state) => state);
  const handleChangeLang = async (locale: string) => {
    if (locale !== router.locale) {
      await router
        .replace(router.pathname, router.asPath, {
          locale,
          scroll: false,
        })
        .then(() => dispatch(setLocale(locale)))
        .then(() => {
          dispatch(
            showToastMessage({
              content: `language_changed_successfully`,
              type: `info`,
            })
          );
        });
    }
  };
  return (
    <div
      className={`absolute top-0 left-0 flex w-full justify-between items-center grow  z-90 text-white p-4
           `}
    >
      {/* burger menu */}
      <div
        className="flex items-center gap-3 mt-8 z-50 w-10 h-10 rounded-full flex justify-center items-center bg-white text-black capitalize cursor-pointer"
        onClick={() =>
          sideMenuOpen ? dispatch(hideSideMenu()) : dispatch(showSideMenu())
        }
      >
        <Bars3Icon className={`w-5 h-5 text-stone-700`} />
      </div>

      {/* cart , search , lang right icons */}
      <div
        className={`flex flex-row justify-start items-start gap-3 mt-8 z-50`}
      >
        <Link
          scroll={true}
          href={appLinks.cart.path}
          className={`w-10 h-10 rounded-full flex justify-center items-center bg-white text-black capitalize`}
          suppressHydrationWarning={suppressText}
        >
          <ShoppingBagIcon className={`w-5 h-5 text-stone-700`} />
        </Link>
        <Link
          scroll={true}
          href={appLinks.productSearch.path}
          className={`w-10 h-10 rounded-full flex justify-center items-center bg-white text-black capitalize`}
          suppressHydrationWarning={suppressText}
        >
          <MagnifyingGlassIcon className={`w-5 h-5 text-stone-700`} />
        </Link>
        <button
          onClick={() => handleChangeLang(otherLang)}
          className={`w-10 h-10 rounded-full flex justify-center items-center bg-white  text-black capitalize text-lg`}
        >
          {t(`${otherLang}`)}
        </button>
      </div>
    </div>
  );
}
