export interface Product {
  id: number;
  amount: number;
  never_out_of_stock: number;
  name: string;
  name_ar: string;
  name_en: string;
  desc: string;
  description_ar: string;
  description_en: string;
  price: string;
  amount: number | undefined;
  branch_id?: string;
  price_on_selection?: boolean;
  new_price?: string;
  cover: string;
  img: img[];
  sections?: ProductSection[];
  cover: string;
}
