export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  author: string;
  isbn: string;
  categoryId: number;
  categoryName: string;
  stock: number;
}