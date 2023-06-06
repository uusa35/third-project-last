import CustomImage from '@/components/CustomImage';
import React from 'react';
import EmptyOrders from '@/appImages/empty_orders.png';
import Search from '@/appIcons/gray_search.svg';
import {
  alexandriaFontBold,
  alexandriaFontLight,
  appLinks,
} from '@/constants/*';
import { debounce } from 'lodash';
import { suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';

type Props = {
  handleChange: (event: React.KeyboardEvent<HTMLElement>) => void;
};

export default function EmptyUserOrders({
  handleChange = (event) => {},
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center space-y-2 pt-20 px-5">
      <CustomImage
        src={EmptyOrders}
        alt="empty orders"
        width={150}
        height={150}
      />
      <p
        className={`text-lg ${alexandriaFontBold}`}
        suppressHydrationWarning={suppressText}
      >
        {t('you_dont_have_any_orders_yet')}
      </p>
      <p
        className={`text-[#544A45] text-center text-sm ${alexandriaFontLight}`}
        suppressHydrationWarning={suppressText}
      >
        {t('have_a_tracking_code?_enter_order_id_below_to_track_it')}
      </p>
      <div className="w-full flex items-center border-b-2 border-gray-200 mt-1">
        <Search className="text-[#544A45]" />
        <input
          type="search"
          name="searchArea"
          id="searchArea"
          placeholder={`${t('order_id')}`}
          suppressHydrationWarning={suppressText}
          className={`flex-1 px-2 py-3 h-12 bg-transparent text-[#544A45] capitalize foucs:ring-0 outline-none ${alexandriaFontLight}`}
          onKeyDown={(e) => handleChange(e)}
        />
      </div>
    </div>
  );
}
