export type ProductResponse = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
};
