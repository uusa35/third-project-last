import { Category } from '@/types/queries';
import { ListOutlined } from '@mui/icons-material';
import React, { FC, useEffect, useState, useRef } from 'react';
import TextTrans from '../TextTrans';
import ScrollSpy from 'react-scrollspy';
import VerProductWidget from '../widgets/product/VerProductWidget';
import MenuModal from '../modals/MenuModal';
import UpcomingOrders from '@/components/home/UpcomingOrders';
import { alexandriaFont, alexandriaFontBold, appLinks } from '@/constants/*';
import Link from 'next/link';
import { setCategory } from '@/redux/slices/searchParamsSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { filter, isEmpty, isNull, map } from 'lodash';

type Props = {
  CategoriesProducts: Category[];
};

const ProductListView: FC<Props> = ({
  CategoriesProducts,
}): React.ReactNode => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const color = useAppSelector(themeColor);
  const [currentId, setCurrentId] = useState<string | number | null>(null);

  const handleUpdate = (el: HTMLElement | null) => {
    // if (el) {
    //   setCurrentId(el.id);
    // }
  };

  const handleScroll = (id: string | number) => {
    console.log('id', id);
    if (!isNull(id)) {
      document
        ?.getElementById(`category_${id}`)
        ?.scrollIntoView({ inline: 'center' });
      setCurrentId(id);
    }
  };

  const handleSearchRedirection = (id: string) => {
    dispatch(setCategory(id));
    router.push(`${appLinks.productSearch.path}`);
  };
  // console.log({ CategoriesProducts });
  return (
    <div>
      {/* sticky header */}
      <header
        className="flex gap-x-2 bg-white pt-2 pb-4 sticky top-0 z-10 px-4"
        style={{ boxShadow: '0px 4px 8px #00000026' }}
      >
        <div
          className="rounded-full bg-gray-100 w-fit h-fit p-1 cursor-pointer"
          onClick={() => {
            setOpenCategoryModal(true);
          }}
        >
          <ListOutlined />
        </div>
        <ScrollSpy
          currentClassName=""
          onUpdate={handleUpdate}
          // rootEl="div"
          componentTag="div"
          items={CategoriesProducts.map((i) => i.cat_id as string)}
          style={{ display: 'flex' }}
          className="flex gap-x-2 overflow-x-scroll scroll scroll-smooth whitespace-nowrap scrollbar-hide"
          offset={-200}
        >
          {map(
            filter(
              CategoriesProducts,
              (c: Category) => c.items && c.items?.length > 0
            ),
            (category: Category, i) => (
              <div key={i} className={`mt-1`}>
                {category.items && !isEmpty(category.items) ? (
                  <a
                    onClick={() => handleScroll(category.cat_id)}
                    id={`category_${category.cat_id}`}
                    key={category.cat_id}
                    href={`#${category.cat_id}`}
                    className={`${alexandriaFont} text-sm rounded-full px-4 py-2 whitespace-nowrap ${
                      category.cat_id == currentId
                        ? `text-white active-cat`
                        : ''
                    }`}
                    style={{
                      backgroundColor:
                        category.cat_id === currentId ? color : '#F3F2F2',
                      transition:
                        category.cat_id === currentId ? 'all 0.5s' : '',
                    }}
                  >
                    {category.name}
                  </a>
                ) : null}
              </div>
            )
          )}
        </ScrollSpy>
      </header>

      <UpcomingOrders />

      {/* products and cats names */}

      <div>
        {CategoriesProducts.map((category) =>
          !isEmpty(category.items) ? (
            <section id={`${category.cat_id}`} key={category.cat_id}>
              <div className="mt-5 px-4">
                {/* cat name */}
                <button
                  onClick={() =>
                    handleSearchRedirection(category.cat_id as string)
                  }
                >
                  <TextTrans
                    className={`text-lg mt-5 ${alexandriaFontBold}`}
                    ar={category.name_ar}
                    en={category.name_en}
                  />
                </button>

                {/* products */}
                <div>
                  {category.items?.map((product) => {
                    return (
                      <VerProductWidget
                        element={product}
                        category_id={category?.cat_id as string}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          ) : (
            <></>
          )
        )}
      </div>

      <MenuModal
        isOpen={openCategoryModal}
        onRequestClose={() => setOpenCategoryModal(false)}
        Categories={CategoriesProducts}
      />
    </div>
  );
};
export default ProductListView;
