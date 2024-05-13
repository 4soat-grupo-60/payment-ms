export type PaymentResponse = {
  id: string;
  order_id: number;
  integration_id: string;
  qr_code: string;
  total: number;
  status: string;
  paid_at?: Date;
  created_at?: Date;
  updated_at?: Date;
};

