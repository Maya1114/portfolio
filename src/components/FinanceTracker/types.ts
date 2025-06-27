export interface Transaction {
  id: number;
  amount: number;
  description: string;
  category_id: number;
  date: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Budget {
  id: number;
  category_id: number;
  amount: number;
}

export interface User {
  id: number;
  username: string;
} 