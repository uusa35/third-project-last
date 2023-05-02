import { Product } from '@/types/index';
import { Category } from '@/types/queries';
import { ListOutlined } from '@mui/icons-material';
import React from 'react';
import TextTrans from '../TextTrans';
import ScrollSpy from 'react-ui-scrollspy';
import VerProductWidget from '../widgets/product/VerProductWidget';

type Props = {
  CategoriesProducts: Product[];
};

export default function ProductListView({ CategoriesProducts }: Props) {
  console.log('in product view', CategoriesProducts);

  //   scroll function
  const onPress = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const target = window.document.getElementById(
      e.currentTarget.href.split('#')[1]
    );
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* sticky header */}
      <header
        className="flex gap-x-2 bg-white py-4 sticky top-0 z-40"
        style={{ boxShadow: ' 0 6px 9px -2px #cbcbcb' }}
      >
        <div className="rounded-full bg-gray-100 w-fit h-fit p-1 cursor-pointer">
          <ListOutlined />
        </div>
        <div className="flex gap-x-2 overflow-x-scroll scrollbar-hide">
          {CategoriesProducts.map((category) => {
            return (
              <a
                className=""
                onClick={(e) => onPress(e)}
                href={`#${category?.cat_id}`}
              >
                <p
                  className="text-sm rounded-full px-2 py-1 rounded-full whitespace-nowrap bg-zinc-100"
                  data-to-scrollspy-id={`${category?.cat_id}`}
                >
                  {category.name}
                </p>
              </a>
            );
          })}
        </div>
      </header>

      {/* products and cats names */}
      <ScrollSpy>
        {CategoriesProducts.map((category) => {
          return (
            <div id={`${category.cat_id}`} className="mt-10">
              {/* cat name */}
              <TextTrans
                className="font-bold mt-5"
                ar={category.name_ar}
                en={category.name_en}
              />

              {/* products */}
              <div>
                {category.items.map((product) => {
                  return (
                    <VerProductWidget
                      element={product}
                      category_id={category.cat_id}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </ScrollSpy>
    </div>
  );
}
