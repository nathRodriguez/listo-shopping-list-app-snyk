export interface Product {
    id: string;
    name: string;
    is_predefined: boolean;
    user_id: string | null;
}

export interface Product_list {
  list_id: string;
  product_id: string;
  price: number | null;
  quantity: number | null;
  unit: string | null;
  is_checked: boolean;
  added_at: Date;
}