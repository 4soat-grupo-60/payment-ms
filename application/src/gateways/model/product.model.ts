import { ObjectId } from "mongodb";

export default interface ProductModel {
  _id: ObjectId;
  name: string;
  price: number;
  description: string;
  category: string;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
}
