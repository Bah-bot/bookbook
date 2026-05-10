export interface CartItem {
  id: number;
  productId: number;
  productTitle: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  createdAt: string;
  total: number;
  status: string;
  userId: number;
  items: OrderItem[];
}