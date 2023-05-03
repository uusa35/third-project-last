import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import { Product, ProductSection, QuantityMeters, img } from '@/types/index';
import { productApi, useGetProductQuery } from '@/redux/api/productApi';
import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState, Fragment, Suspense } from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  resetShowFooterElement,
  setCurrentModule,
  setShowFooterElement,
  setUrl,
} from '@/redux/slices/appSettingSlice';
import {
  appLinks,
  arboriaFont,
  baseUrl,
  convertColor,
  imageSizes,
  imgUrl,
  mainBtnClass,
  modalBtnContainer,
  suppressText,
  toEn,
} from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import {
  concat,
  debounce,
  filter,
  first,
  flatMap,
  isEmpty,
  isNull,
  join,
  map,
  maxBy,
  min,
  minBy,
  multiply,
  now,
  startCase,
  sum,
  sumBy,
} from 'lodash';
// import {
//   addMeter,
//   addRadioBtn,
//   addToCheckBox,
//   disableAddToCart,
//   enableAddToCart,
//   removeFromCheckBox,
//   removeMeter,
//   resetCheckBoxes,
//   resetMeters,
//   resetRadioBtns,
//   setCartProductQty,
//   setInitialProductCart,
//   setNotes,
//   updateId,
//   updatePrice,
// } from '@/redux/slices/productCartSlice';
import { Accordion, AccordionBody } from '@material-tailwind/react';
import TextTrans from '@/components/TextTrans';
import { themeColor } from '@/redux/slices/vendorSlice';
import NoFoundImage from '@/appImages/not_found.png';
// import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import Link from 'next/link';
import FavouriteAndShare from '@/components/ProductShow/FavouriteAndShare';
import ChangeMoodModal from '@/components/modals/ChangeMoodModal';
import Backbtn from '@/appIcons/backbtn.svg';
import { useRouter } from 'next/router';

type Props = {
  product: Product;
  url: string;
  currentLocale: string;
  resolvedUrl: string;
};
const ProductShow: NextPage<Props> = (
  {
  // product,
  url,
  currentLocale,
  resolvedUrl,
}
) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    productCart,
    locale: { lang, isRTL },
    // branch: { id: branch_id },
    // area: { id: area_id },
    // cart: { total },
    // vendor: { logo },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  // const [currentQty, setCurrentyQty] = useState<number>(
  //   productCart.ProductID === product.id ? productCart.Quantity : 1
  // );
  const [tabsOpen, setTabsOpen] = useState<{ id: number }[]>([]);
  const [isReadMoreShown, setIsReadMoreShown] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: element,
    isSuccess,
    refetch: refetchGetProduct,
  } = useGetProductQuery({
    id: 11,
    lang,
    // ...(branch_id && { branch_id }),
    // ...(area_id && { area_id }),
    url,
  });
  


  useEffect(() => {
    if (isSuccess && element.Data) {
      dispatch(
        setCurrentModule(
          isRTL ? element?.Data?.name_ar : element?.Data?.name_en
        )
      );
      // if (productCart.ProductID !== element?.Data?.id) {
      //   handleResetInitialProductCart();
      // }
      // if (element?.Data?.sections?.length === 0) {
      //   dispatch(enableAddToCart());
      // }
      // if (
      //   element?.Data?.sections?.length !== 0 &&
      //   element?.Data?.sections?.filter(
      //     (itm) => itm.selection_type === 'mandatory'
      //   ).length === 0
      // ) {
      //   dispatch(enableAddToCart());
      // }
      // if (total > 0) {
      //   dispatch(resetRadioBtns());
      //   dispatch(resetCheckBoxes());
      //   dispatch(resetMeters());
      // }
    }
  }, [isSuccess, element?.Data?.id, isRTL]);

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    dispatch(setShowFooterElement(`product_show`));
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);

  // useEffect(() => {
  //   if (
  //     isSuccess &&
  //     !isNull(element) &&
  //     !isNull(element.Data) &&
  //     !isEmpty(productCart) &&
  //     currentQty >= 1 &&
  //     element?.Data?.amount &&
  //     element?.Data?.amount >= currentQty
  //   ) {
  //     const allCheckboxes = map(productCart.CheckBoxes, (q) => q.addons[0]);
  //     const allRadioBtns = map(productCart.RadioBtnsAddons, (q) => q.addons);
  //     const allMeters = map(productCart.QuantityMeters, (q) => q.addons[0]);
  //     const metersSum = sumBy(allMeters, (a) => multiply(a.price, a.Value)); // qty
  //     const checkboxesSum = sumBy(allCheckboxes, (a) => a.Value * a.price); // qty
  //     const radioBtnsSum = sumBy(allRadioBtns, (a) => a.Value * a.price); // qty
  //     if (
  //       element?.Data?.sections?.length !== 0 &&
  //       element?.Data?.sections?.filter(
  //         (itm) => itm.selection_type === 'mandatory'
  //       ).length !== 0 &&
  //       isEmpty(allCheckboxes) &&
  //       isEmpty(allRadioBtns) &&
  //       isEmpty(allMeters)
  //     ) {
  //       dispatch(disableAddToCart());
  //     } else {
  //       dispatch(enableAddToCart());
  //     }
  //     dispatch(
  //       updatePrice({
  //         totalPrice: sum([
  //           parseFloat(
  //             element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
  //               ? element?.Data?.new_price
  //               : element?.Data?.price
  //           ),
  //           metersSum,
  //           checkboxesSum,
  //           radioBtnsSum,
  //         ]),
  //         totalQty: currentQty,
  //       })
  //     );
  //     const uIds = concat(
  //       productCart.QuantityMeters &&
  //         map(productCart.QuantityMeters, (q) => `_${q.uId2}`),
  //       productCart.CheckBoxes &&
  //         map(productCart.CheckBoxes, (c) => `_${c.uId}`),
  //       productCart.RadioBtnsAddons &&
  //         map(productCart.RadioBtnsAddons, (r) => `_${r.uId}`),
  //       ` _${productCart.ExtraNotes.replace(/[^A-Z0-9]/gi, '')}`
  //     );
  //     dispatch(updateId(`${productCart.ProductID}${join(uIds, '')}`));
  //   }
  // }, [
  //   productCart.QuantityMeters,
  //   productCart.CheckBoxes,
  //   productCart.RadioBtnsAddons,
  //   currentQty,
  //   productCart.ExtraNotes,
  // ]);

  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  // const handleIncrease = () => {
  //   if (
  //     element &&
  //     element?.Data?.amount &&
  //     element?.Data?.amount &&
  //     element?.Data?.amount >= currentQty + 1
  //   ) {
  //     setCurrentyQty(currentQty + 1);
  //     dispatch(setCartProductQty(currentQty + 1));
  //   }
  // };

  // const handleDecrease = () => {
  //   if (isSuccess && !isNull(element)) {
  //     if (
  //       currentQty - 1 > 0 &&
  //       element?.Data?.amount &&
  //       currentQty <= element?.Data?.amount
  //     ) {
  //       setCurrentyQty(currentQty - 1);
  //       dispatch(setCartProductQty(currentQty - 1));
  //     } else {
  //       setCurrentyQty(0);
  //       handleResetInitialProductCart();
  //     }
  //   }
  // };

  // const handleResetInitialProductCart = () => {
  //   if (isSuccess && !isNull(element) && element.Data) {
  //     dispatch(
  //       setInitialProductCart({
  //         ProductID: element?.Data?.id,
  //         ProductName: element?.Data?.name,
  //         ProductImage: element?.Data?.cover ?? ``,
  //         ProductNameAr: element?.Data?.ProductNameAr,
  //         ProductNameEn: element?.Data?.ProductNameEn,
  //         ProductDesc: element?.Data?.desc,
  //         Quantity: currentQty,
  //         ExtraNotes: ``,
  //         totalPrice: parseFloat(
  //           element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
  //             ? element?.Data?.new_price
  //             : element?.Data?.price
  //         ),
  //         grossTotalPrice: parseFloat(
  //           element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
  //             ? element?.Data?.new_price
  //             : element?.Data?.price
  //         ),
  //         totalQty: currentQty,
  //         Price: parseFloat(
  //           element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
  //             ? element?.Data?.new_price
  //             : element?.Data?.price
  //         ),
  //         enabled: false,
  //         image: imgUrl(element?.Data.img[0]?.toString()),
  //         id: now().toString(),
  //       })
  //     );
  //   }
  // };

  // const handleSelectAddOn = async (
  //   selection: ProductSection,
  //   choice: any,
  //   type: string,
  //   checked: boolean
  // ) => {
  //   if (type === 'checkbox') {
  //     if (checked) {
  //       dispatch(
  //         addToCheckBox({
  //           addonID: selection.id,
  //           uId: `${selection.id}${choice.id}`,
  //           addons: [
  //             {
  //               attributeID: choice.id,
  //               name: choice.name,
  //               name_ar: choice.name_ar,
  //               name_en: choice.name_en,
  //               Value: 1,
  //               price: parseFloat(choice.price),
  //             },
  //           ],
  //         })
  //       );
  //     } else {
  //       dispatch(removeFromCheckBox(`${selection.id}${choice.id}`));
  //     }
  //   } else if (type === 'radio') {
  //     dispatch(
  //       addRadioBtn({
  //         addonID: selection.id,
  //         uId: `${selection.id}${choice.id}`,
  //         addons: {
  //           attributeID: choice.id,
  //           name: choice.name,
  //           name_ar: choice.name_ar,
  //           name_en: choice.name_en,
  //           Value: 1,
  //           price: parseFloat(choice.price),
  //         },
  //       })
  //     );
  //   } else if (type === 'q_meter') {
  //     const currentMeter = filter(
  //       productCart.QuantityMeters,
  //       (q: QuantityMeters) =>
  //         q.uId === `${selection.id}${choice.id}` && q.addons[0]
  //     );
  //     if (checked) {
  //       // increase
  //       const Value = isEmpty(currentMeter)
  //         ? 1
  //         : parseFloat(currentMeter[0]?.addons[0].Value) + 1 <= selection.max_q
  //         ? parseFloat(currentMeter[0]?.addons[0].Value) + 1
  //         : parseFloat(currentMeter[0]?.addons[0].Value);
  //       dispatch(
  //         addMeter({
  //           addonID: selection.id,
  //           uId2: `${selection.id}${choice.id}${Value}`,
  //           uId: `${selection.id}${choice.id}`,
  //           addons: [
  //             {
  //               attributeID: choice.id,
  //               name: choice.name,
  //               name_ar: choice.name_ar,
  //               name_en: choice.name_en,
  //               Value,
  //               price: parseFloat(choice.price),
  //             },
  //           ],
  //         })
  //       );
  //     } else {
  //       // decrease
  //       if (!isEmpty(currentMeter)) {
  //         const Value = isEmpty(currentMeter)
  //           ? 1
  //           : parseFloat(currentMeter[0]?.addons[0].Value) - 1 >= 0
  //           ? parseFloat(currentMeter[0]?.addons[0].Value) - 1
  //           : parseFloat(currentMeter[0]?.addons[0].Value);

  //         dispatch(
  //           addMeter({
  //             addonID: selection.id,
  //             uId2: `${selection.id}${choice.id}${Value}`,
  //             uId: `${selection.id}${choice.id}`,
  //             addons: [
  //               {
  //                 attributeID: choice.id,
  //                 name: choice.name,
  //                 name_ar: choice.name_ar,
  //                 name_en: choice.name_en,
  //                 Value,
  //                 price: parseFloat(choice.price),
  //               },
  //             ],
  //           })
  //         );
  //       } else {
  //         dispatch(removeMeter(`${selection.id}${choice.id}`));
  //       }
  //     }
  //   }
  // };

  if (!isSuccess || !url) {
    <p>loading</p>
    // return <LoadingSpinner fullWidth={true} />;
  }
  return (
    <Suspense>
      {/* <MainHead
        title={`${currentLocale === 'ar' ? product.name_ar : product.name_en}`}
        description={`${
          currentLocale === 'ar'
            ? product.description_ar
            : product.description_en
        }`}
        mainImage={`${product?.cover.toString()}`}
        icon={`${logo}`}
        twitter={`${url}${resolvedUrl}`}
        facebook={`${url}${resolvedUrl}`}
        instagram={`${url}${resolvedUrl}`}
      /> */}
      <MainContentLayout
        url={url}
        // productCurrentQty={currentQty}
        // handleIncreaseProductQty={handleIncrease}
        // handleDecreaseProductQty={handleDecrease}
        // productOutStock={
        //   isSuccess &&
        //   !isNull(element) &&
        //   element.Data &&
        //   element.Data.never_out_of_stock === 0 &&
        //   element.Data.amount <= currentQty
        // }
      >
        {isSuccess && !isNull(element) && element.Data ? (
          <>
          <div className="flex justify-between items-center p-3 sticky top-0 z-50 w-full capitalize bg-white border-b-20">
            <button onClick={() => router.back()}>
              <Backbtn />
            </button>
            {element?.Data?.name}
            <FavouriteAndShare />
          </div>
            <div className="relative w-full capitalize">
              <div className="relative w-full h-auto overflow-hidden">
                {!isEmpty(element?.Data?.img) ? (
                  <Carousel
                  className={`w-full h-full`}
                  height={'40vh'}
                  navButtonsAlwaysInvisible={true}
                  indicatorIconButtonProps={{
                    style: {
                      padding: '1px', 
                      color: 'lightgray'    
                    },
                  }}
                  activeIndicatorIconButtonProps={{
                    style: {
                      padding: '0.5px', 
                      fontSize: '1px',
                      color
                    },
                  }}
                  indicatorContainerProps={{
                    style: {
                      marginTop: '2px', // 5
                    },
                  }}
                  indicators={element?.Data?.img.length > 1}
                >
                  {map(element?.Data?.img, (image: img, i) => (
                    <Image
                      src={`${
                        image && image.original
                          ? imgUrl(image.original)
                          : NoFoundImage.src
                      }`}
                      alt={element?.Data?.name ?? ``}
                      sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw"
                      fill={true}
                    />
                  ))}
                    </Carousel>
                ) : (
                  <CustomImage
                    src={`${NoFoundImage.src}`}
                    alt={element?.Data?.name}
                    width={imageSizes.xl}
                    height={imageSizes.lg}
                    className={`object-cover w-full h-80`}
                  />
                )}
              </div>
              
            </div>
            <div className={`capitalize pt-5`}>
              {/*   name and desc */}
              <div className="flex flex-row w-full justify-between items-center px-4 md:px-8 pb-4 border-b-2 border-stone-200">
                <div className={`flex-1 space-y-2`}>
                  <p className="font-bold text-xl">
                    <TextTrans
                      ar={element?.Data?.name_ar}
                      en={element?.Data?.name_en}
                      style={{
                        maxWidth: '30ch',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        display: 'block',
                        color: `black`,
                      }}
                    />
                  </p>
                  <p
                    className={`rtl:pl-1 ltr:pr-1 ${
                      isReadMoreShown ? '' : 'line-clamp-4'
                    }`}
                  >
                    <TextTrans
                      ar={element?.Data?.description_ar}
                      en={element?.Data?.description_en}
                      length={
                        isReadMoreShown
                          ? isRTL
                            ? element?.Data?.description_ar.length
                            : element?.Data?.description_en.length
                          : 99
                      }
                      className="text-zinc-500"
                    />
                    {((element?.Data?.description_ar.length >= 99 && isRTL) ||
                      (element?.Data?.description_en.length >= 99 &&
                        !isRTL)) && (
                      <button
                        onClick={() => setIsReadMoreShown(!isReadMoreShown)}
                        style={{ color }}
                        className="font-semibold text-sm px-3"
                      >
                        {isReadMoreShown
                          ? startCase(`${t('read_less')}`)
                          : startCase(`${t('read_more')}`)}
                      </button>
                    )}
                  </p>
                  {element?.Data?.sections?.length > 0 && (
                     <div className={`w-fit h-10 border-[1px] rounded-full flex justify-center items-center space-x-2 px-4`} 
                          style={{ borderColor: color, color }}>
                      <span>{(minBy(element?.Data?.sections?.[0]?.choices, (choice) => choice?.price))?.price}</span>
                      <span>-</span>
                      <span>{(maxBy(element?.Data?.sections?.[0]?.choices, (choice) => choice?.price))?.price} {t('kwd')}</span>
                    </div>
                  )}
                </div>
              </div>
              {/*     sections  */}
              {map(element?.Data?.sections, (s: ProductSection, i) => (
                <div
                  className={`border-b-8 border-stone-100 px-8 py-4`}
                  key={i}
                >
                  <div className="flex justify-between">
                    <div>
                    <p className="text-lg">
                      {t('select')} <TextTrans ar={s.title_ar} en={s.title_en} />
                    </p>
                    <p>{s.must_select === 'single' ? t('select1') : 'multi_selection'}</p>
                    </div>
                    <div className="text-sm text-center bg-gray-100 rounded-full w-20 h-8 pt-1">
                    <span>{s.selection_type === 'mandatory' ? t('required') : t('optional')}</span>
                    </div>
                  </div>
                  {s.hidden ? (
                    <div className={`flex flex-col gap-x-2 gap-y-1  mt-2`}>
                      <div className={`flex flex-row`}>
                        <input
                          id={s.title}
                          name={s.title}
                          type="radio"
                          checked={
                            !isEmpty(filter(tabsOpen, (t) => t.id === s.id))
                          }
                          onClick={() =>
                            setTabsOpen([...tabsOpen, { id: s.id }])
                          }
                          className="h-4 w-4"
                          style={{ accentColor: color }}
                        />
                        <label
                          htmlFor={s.title}
                          className="mx-3 block text-sm"
                        >
                          {t('yes')}
                        </label>
                      </div>
                      <div className={`flex flex-row`}>
                        <input
                          id={s.title}
                          name={s.title}
                          type="radio"
                          // checked={isEmpty(
                          //   filter(tabsOpen, (t) => t.id === s.id)
                          // )}
                          // onClick={() => {
                          //   if (
                          //     s.selection_type === `optional` &&
                          //     s.must_select === 'multi'
                          //   ) {
                          //     dispatch(resetCheckBoxes());
                          //   } else {
                          //     dispatch(resetRadioBtns());
                          //   }
                          //   setTabsOpen(filter(tabsOpen, (t) => t.id !== s.id));
                          // }}
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={s.title}
                          className="mx-3 block text-sm font-medium text-gray-700"
                        >
                          {t('no')}
                        </label>
                      </div>
                    </div>
                  ) : null}
                  <Accordion
                    hidden={true}
                    open={
                      !s.hidden
                        ? true
                        : !isEmpty(filter(tabsOpen, (t) => t.id === s.id))
                    }
                    animate={customAnimation}
                    className={`w-full`}
                  >
                    <AccordionBody
                      style={{
                        paddingLeft: 0,
                        paddingRight: 0,
                      }}
                    >
                      {s.must_select === 'q_meter' &&
                      s.selection_type === 'mandatory' && (
                        <p className={`flex -w-full pb-3`} style={{ color }}>
                          {t(`must_select_min_and_max`, {
                            min: s.min_q,
                            max: s.max_q,
                          })}
                        </p>
                      ) 
                      // : (
                      //   s.selection_type === 'mandatory' && (
                      //     <p className={`flex -w-full text-red-600 pb-3`}>
                      //       {t(`field_must_select_at_least_one`)}
                      //     </p>
                      //   )
                      // )
                      }
                      {map(s.choices, (c, i) => (
                        <div className="flex items-center w-full pb-2" key={i}>
                          {s.must_select === 'q_meter' ? (
                            <div
                              className={`flex flex-row w-full justify-between items-center`}
                            >
                              <div className={`space-y-1`}>
                                <div>
                                  <p 
                                  // style={{ color }}
                                  >
                                    <TextTrans ar={c.name_ar} en={c.name_en} />
                                  </p>
                                </div>
                                <div>
                                  +{c.price}{' '}
                                  <span className={`uppercase`}>
                                    {t(`kwd`)}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="isolate inline-flex rounded-xl shadow-sm flex-row-reverse">
                                  <button
                                    // disabled={currentQty < 1}
                                    // onClick={() =>
                                    //   handleSelectAddOn(
                                    //     s,
                                    //     c,
                                    //     s.must_select,
                                    //     true
                                    //   )
                                    // }
                                    type="button"
                                    className="relative -ml-px inline-flex items-center ltr:rounded-l-sm rtl:rounded-r-sm  bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 w-10"
                                    // style={{ color }}
                                  >
                                    <span
                                      className={`border border-gray-300 p-1 px-3 bg-white rounded-md text-md font-extrabold  w-8 h-8 flex justify-center items-center`}
                                    >
                                      +
                                    </span>
                                  </button>
                                  <button
                                    // disabled={currentQty === 0}
                                    type="button"
                                    className="relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium focus:z-10 w-10"
                                    // style={{ color }}
                                  >
                                    {filter(
                                      productCart?.QuantityMeters,
                                      (q) => q.uId === `${s.id}${c.id}`
                                    )[0]?.addons[0]?.Value ?? 0}
                                  </button>
                                  <button
                                    // disabled={
                                    //   currentQty === 0 ||
                                    //   first(
                                    //     filter(
                                    //       productCart.QuantityMeters,
                                    //       (q) => q.uId === `${s.id}${c.id}`
                                    //     )
                                    //   )?.addons.Value === 0
                                    // }
                                    // onClick={() =>
                                    //   handleSelectAddOn(
                                    //     s,
                                    //     c,
                                    //     s.must_select,
                                    //     false
                                    //   )
                                    // }
                                    type="button"
                                    className="relative inline-flex items-center ltr:rounded-r-sm rtl:rounded-l-sm bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 w-10"
                                    // style={{ color }}
                                  >
                                    <span
                                      className={`border border-gray-300 p-1 px-3 bg-white rounded-md text-md font-extrabold  w-8 h-8 flex justify-center items-center`}
                                    >
                                      -
                                    </span>
                                  </button>
                                </span>
                              </div>
                            </div>
                          ) : (
                            <Fragment key={i}>
                              <input
                                id={c.name}
                                name={c.name}
                                required={s.selection_type !== 'optional'}
                                type={
                                  s.must_select === 'multi'
                                    ? `checkbox`
                                    : 'radio'
                                }
                                checked={
                                  s.must_select !== 'multi'
                                    ? filter(
                                        productCart?.RadioBtnsAddons,
                                        (q) => q.uId === `${s.id}${c.id}`
                                      )[0]?.uId === `${s.id}${c.id}`
                                    : filter(
                                        productCart?.CheckBoxes,
                                        (q) => q.uId === `${s.id}${c.id}`
                                      )[0]?.uId === `${s.id}${c.id}`
                                }
                                // onChange={(e) =>
                                //   handleSelectAddOn(
                                //     s,
                                //     c,
                                //     s.must_select === 'multi'
                                //       ? `checkbox`
                                //       : 'radio',
                                //     e.target.checked
                                //   )
                                // }
                                className="h-4 w-4 border-gray-200 checked:ring-0 focus:ring-0"
                                style={{ accentColor: color }}
                              />
                              <div
                                className={`flex w-full flex-1 justify-between items-center `}
                              >
                                <div>
                                  <label
                                    htmlFor={c.name}
                                    className="ltr:ml-3 rtl:mr-3 block text-sm"
                                  >
                                    <TextTrans ar={c.name_ar} en={c.name_en} />
                                  </label>
                                </div>
                                <div>
                                  {parseFloat(c.price).toFixed(3)}
                                  <span className={`mx-1 uppercase`}>
                                    {t(`kwd`)}
                                  </span>
                                </div>
                              </div>
                            </Fragment>
                          )}
                        </div>
                      ))}
                    </AccordionBody>
                  </Accordion>
                </div>
              ))}

              {/* notes */}
              <div className="px-8 py-4">
                <p className="mb-2">{t('special_instructions')}</p>
                <input
                  type="text"
                  placeholder={`${t('add_instructions')}`}
                  suppressHydrationWarning={suppressText}
                  value={productCart?.ExtraNotes}
                  // onChange={(e) => dispatch(setNotes(toEn(e.target.value)))}
                  className={`bg-gray-200 py-2 rounded-md px-5 w-full focus:ring-0 capitalize ${arboriaFont}`}
                />
              </div>
            </div>
            <div className="w-full bg-gray-100">
      {/* quantity meter */}
      <div className="flex justify-center items-center w-full px-8 bg-gray-100">
        <div
          className={`flex flex-row justify-center items-center my-4 capitalize`}
        >
          <div className="flex flex-row-reverse items-center">
            <button
              // onClick={() =>
              //   handleIncreaseProductQty ? handleIncreaseProductQty() : null
              // }
              type="button"
              className="w-8 h-8 text-white text-xl font-semibold rounded-full pb-3"
              style={{ backgroundColor: color }}
            >
              +
            </button>
            <span className="px-5 text-xl font-semibold">
              1
            </span>
            <button
              // disabled={productCurrentQty === 0}
              // onClick={() =>
              //   handleDecreaseProductQty ? handleDecreaseProductQty() : null
              // }
              type="button"
              className="w-8 h-8 bg-gray-300 text-white text-xl font-semibold rounded-full pb-3"
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* add to cart btn */}
      <div
        className={`${modalBtnContainer}`}
      >
        <button
          // disabled={
          //   (parseFloat(productCart.grossTotalPrice).toFixed(3) === '0.000' &&
          //     !method) ||
          //   productOutStock
          // }
          // onClick={debounce(() => handleAddToCart(), 400)}
          className={`${mainBtnClass}`}
          style={{
            backgroundColor: color,
            color: `white`,
          }}
          onClick={() => setIsOpen(true)}
        >
          {/* {!area_id && !branch_id
            ? t(`start_ordering`)
            ? productOutStock
            : t('out_stock')
            : t('add_to_cart')} */}
            {t('start_ordering')}
        </button>
        {/* <span className={`flex flex-row items-center gap-2`}>
          <p className={`text-xl text-white`}>
            {parseFloat(productCart?.grossTotalPrice).toFixed(3) === '0.000'
              ? t(`price_on_selection`)
              : parseFloat(productCart.grossTotalPrice).toFixed(3)}
          </p>
          {parseFloat(productCart.grossTotalPrice).toFixed(3) !== '0.000' && (
            <span className={`text-white uppercase`}>{t('kwd')}</span>
          )}
        </span> */}
        <ChangeMoodModal  
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
          />
      </div>
    </div>
          </>
        ) : (
          <div className={`w-full flex h-screen justify-center items-center`}>
            {/* <LoadingSpinner fullWidth={true} /> */}
          </div>
        )}
      </MainContentLayout>
    </Suspense>
  );
};

export default ProductShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale, req, resolvedUrl }) => {
      const { id, branchId, areaId }: any = query;
      if (!id || !req.headers.host) {
        return {
          notFound: true,
        };
      }
      // const {
      //   data: element,
      //   isError,
      // }: {
      //   data: AppQueryResult<Product>;
      //   isError: boolean;
      // } = await store.dispatch(
      //   productApi.endpoints.getProduct.initiate({
      //     id,
      //     lang: locale,
      //     ...(branchId ? { branch_id: branchId } : {}),
      //     ...(areaId ? { area_id: areaId } : {}),
      //     url: req.headers.host,
      //   })
      // );
      // await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      // if (isError || !element.Data) {
      //   return {
      //     notFound: true,
      //   };
      // }
      return {
        props: {
          // product: element.Data,
          url: req.headers.host,
          currentLocale: locale,
          resolvedUrl,
        },
      };
    }
);
