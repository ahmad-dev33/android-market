export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string | null;
  role: "buyer" | "vendor" | "admin";
  is_verified: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  icon: string;
  parent: number | null;
  sort_order: number;
  children: Category[];
  product_count: number;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  price: string;
  stock: number;
  sku: string;
  attributes: Record<string, string>;
  is_in_stock: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: string;
  compare_at_price: string | null;
  rating_avg: string;
  rating_count: number;
  sales_count: number;
  is_in_stock: boolean;
  is_featured?: boolean;
  stock?: number;
  sku?: string;
  vendor: number;
  vendor_name: string;
  vendor_id?: number;
  category: number;
  category_name: string;
  primary_image: ProductImage | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at?: string;
}

export interface Vendor {
  id: number;
  store_name: string;
  slug: string;
  description: string;
  logo: string | null;
  banner: string | null;
  rating_avg: string;
  total_sales: number;
  total_products: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  variant: number | null;
  quantity: number;
  unit_price: string;
  line_total: string;
  in_stock: boolean;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: string;
  discount: string;
  total: string;
  total_items: number;
  coupon: number | null;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product: number;
  variant: number | null;
  vendor: number;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: string;
  total: string;
}

export interface Order {
  id: number;
  order_number: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  subtotal: string;
  discount: string;
  shipping_cost: string;
  tax: string;
  total: string;
  shipping_address: Record<string, string>;
  billing_address: Record<string, string>;
  notes: string;
  items: OrderItem[];
  item_count?: number;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
}

export interface Review {
  id: number;
  user: number;
  user_name: string;
  user_avatar: string | null;
  product: number;
  vendor: number | null;
  rating: number;
  title: string;
  comment: string;
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: number;
  type: "order" | "payment" | "promotion" | "system" | "review";
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
