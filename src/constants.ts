import NoFoundImage from '@/appImages/not_found.png';
import { filter, map, toString } from 'lodash';
export const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
// export const xDomain = `next2-q.testbedbynd.com`;
export const xDomain = `next-q.testbedbynd.com`;
//https://pages.testbedbynd.com/
//https://pages-dash.testbedbynd.com/
export const apiUrl = `${baseUrl}api/`;
export const appLinks = {
  root: { path: '/home' },
  home: { path: '/home' },
  login: { path: '/login' },
  createAuthAddress: (userId: number) => `/user/${userId}/address/create/`,
  userAddresses: (userId: number) => `/user/${userId}/address/`,
  guestAddress: { path: `/guest/address/create` },
  addressMap: { path: '/address/map' },
  cart: { path: '/cart' },
  checkout: { path: '/order/checkout' },
  privacyPolicy: { path: '/policies/privacy' },
  returnPolicy: { path: '/policies/return' },
  shippingPolicy: { path: '/policies/shipping' },
  productSearch: { path: '/product/search' },
  categoryProducts: (categoryId: number) => `product/${categoryId}`,
  productShow: (id: number, slug?: string) => `/product/show/${id}&slug=${slug}`,
  selectArea: { path: '/select/area' },
  selectBranch: { path: '/select/branch' },
  selectTime: (method: 'pickup | delivery') => `/select/${method}/time`,
  
  accountInfo: { path: '/user/info' },
  orderHistory: { path: '/orders' },
  wishlist: { path: '/wishlist' },
  vendorDetails: { path: '/vendor/info' },
  mobileVerification: { path: '/verification/mobile' },
  otpVerification: { path: '/verification/otp' },
  orderReceipt: (orderId: string) => `/receipt/${orderId}`,
  orderTrack: (orderId: string) => `/order/track/${orderId}`,
  orderFailure: (orderId: string) => `/order/${orderId}/status/failure`,
  orderSuccess: (orderId: string) => `/order/${orderId}/status/success`,
};

export const isLocal = process.env.NODE_ENV !== 'production';
// export const isLocal = true;

// fonts
export const alexandriaFont = `font-Alexandria-Regular`;
export const alexandriaFontMeduim = `font-Alexandria-Medium`;
export const alexandriaFontSemiBold = `font-Alexandria-SemiBold`;
export const alexandriaFontLight = `font-Alexandria-Light`;
export const alexandriaFontBold = `font-Alexandria-Bold`;
export const montserratFontRegular = 'Montserrat-Arabic-Regular';
export const tajwalFont = 'font-tajwal-medium';

// classes
export const mainBg = `bg-gradient-to-tl mix-blend-multiply rounded-md text-sm text-white shadow-inner drop-shadow-md`;
export const submitBtnClass = `w-full ${mainBg} rounded-md text-sm text-white py-4 my-2 cursor-pointer shadow-lg capitalize disabled:from-gray-200 disabled:to-gray-400 drop-shadow-md`;
export const addressInputField = `border-0 outline-none border-b-2 border-b-gray-100 w-full py-4 focus:ring-0 ${alexandriaFont}`;
export const footerBtnClass = `p-2 px-6 rounded-lg w-fit disabled:bg-stone-600 disabled:text-stone-200 disabled:bg-opacity-40 disabled:opacity-60  shadow-xl capitalize border border-stone-100/25 hover:shadow-inner hover:border-stone-200/80 `;
export const modalBtnContainer = `w-full border-t-[1px] border-gray-200 px-4 flex items-end space-x-5 pt-4`;
export const mainBtnClass = `text-white w-full text-md rounded-full py-3 mx-auto capitalize`;
export const toEn = (s) =>
  s.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (a) => a.charCodeAt(0) & 15);

export const suppressText = true;

export const imageSizes = {
  xs: 100,
  sm: 150,
  md: 250,
  lg: 500,
  xl: 650,
  xxl: 1250,
};

// export const imgUrl = (img: string) => `${baseUrl}${img}`;
export const imgUrl = (img: string) =>
  img.includes('http') ? img : NoFoundImage.src;

export const convertColor = (hex: string, opacity: number) => {
  const tempHex = hex?.replace('#', '');
  if (tempHex) {
    const r = parseInt(tempHex.substring(0, 2), 16);
    const g = parseInt(tempHex.substring(2, 4), 16);
    const b = parseInt(tempHex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${opacity / 100})`;
  }
};

export const iconColor = `grayscale`;

export const updateUrlParams = (
  url: string,
  name: string,
  value: string | number
) => {
  return url.replace(/\bpage=[0-9a-zA-Z_@.#+-]{1,50}\b/, `${name}=${value}`);
};

export const scrollClass = `scroll-smooth overflow-scroll scrollbar-hide overflow-y-scroll`;

export const setLang = (lang: any) =>
  fetch(`/api/set/lang`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lang }),
  });

export const displayUserAddress = (address: any) => {
  let formattedAddress;

  formattedAddress = filter(
    map(
      address,
      (value, key) => value !== null && key !== `id` && `${key} : ${value}  `
    ),
    (a) => a
  );
  // console.log({ formattedAddress });
  formattedAddress = toString(formattedAddress).replaceAll(',', ' / ');

  return formattedAddress;
};


export const whatsappUrl = `https://api.whatsapp.com/send?phone=`;
export const googleMapUrl = (lang: string, lat: string) => `http://maps.google.com/maps?z=18&q=${lang},${lat}`;