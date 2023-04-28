export type AppQueryResult<T> = {
  success: boolean;
  status: string | number;
  message: string;
  msg?: string;
  data: T;
  Data?: T;
};

export type ProductPagination<T> = {
  current_page: string;
  next_page: string;
  per_page: string;
  prev_page: string;
  products: T[];
  total: string;
};

export type Category = {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  img: string;
};

export type Branch = {
  id: number | string | null;
  name: string;
  name_ar: string;
  name_en: string;
  location: string;
  mobile: string;
  lang: string;
  lat: string;
  status: string;
  delivery_type: string;
};

export interface SearchParams {
  method: 'pickup' | 'delivery' | undefined;
  destination_type: 'branch' | 'area' | undefined;
  destination: undefined | Branch | Area;
  category_id: null | number;
}
export interface Area {
  id: string | number | null;
  name: string;
  name_ar: string;
  name_en: string;
}

export interface Location {
  id: number;
  City: string;
  name_ar: string;
  name_en: string;
  Areas: Area[];
}

export interface Address {
  id: number | string;
  type: number | string;
  longitude: number | string;
  latitude: number | string;
  customer_id: number | string;
  [key: string]: any;
}

export interface Feedback {
  user_name: string;
  rate: number;
  note: string;
  phone: number;
}
export interface DeliveryPickupDetails {
  delivery_time: string;
  estimated_preparation_time: string;
  delivery_fees: string;
  delivery_time_type: string;
  id: number;
}
