import { Product } from '@/types/index';
import { Category } from '@/types/queries';
import { ListOutlined } from '@mui/icons-material';
import React, { FC, useState } from 'react';
import TextTrans from '../TextTrans';
import ScrollSpy from 'react-scrollspy';
import VerProductWidget from '../widgets/product/VerProductWidget';
import MenuModal from '../modals/MenuModal';
import UpcomingOrders from '@/components/home/UpcomingOrders';
import { alexandriaFont, alexandriaFontBold, appLinks } from '@/constants/*';
import Link from 'next/link';
import { setCategory } from '@/redux/slices/searchParamsSlice';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/redux/hooks';

type Props = {
  CategoriesProducts: Product[];
};

const ProductListView:FC<Props> = ({ CategoriesProducts }) => {
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSearchRedirection = (id: string) => {
    dispatch(setCategory(id));
    router.push(`${appLinks.productSearch.path}`);
  }
  // console.log(CategoriesProducts.map((i) => i.cat_id));

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
          currentClassName="active_cat"
          // rootEl="div"
          componentTag="div"
          items={CategoriesProducts.map((i) => i.cat_id)}
          style={{ display: 'flex' }}
          className="flex gap-x-2 overflow-x-scroll scrollbar-hide"
          offset={-100}
        >
          {CategoriesProducts.map((category) => {
            return (
              <a
                href={`#${category.cat_id}`}
                className={`${alexandriaFont} text-sm rounded-full px-4 py-2 rounded-full whitespace-nowrap bg-zinc-100`}
              >
                {category.name}
              </a>
            );
          })}
        </ScrollSpy>
      </header>

      <UpcomingOrders />

      {/* products and cats names */}

      <div>
        {CategoriesProducts.map((category) => {
          return (
            <section id={`${category.cat_id}`}>
              <div className="mt-5 px-4">
                {/* cat name */}
                <button onClick={() => handleSearchRedirection(category.cat_id)}>
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
                        category_id={category?.cat_id}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <MenuModal
        isOpen={openCategoryModal}
        onRequestClose={() => setOpenCategoryModal(false)}
        Categories={CategoriesProducts}
      />
    </div>
  );
}
export default ProductListView;

