export default interface PaymentMessageModel {
  id: string;
  order_id: number;
  integration_id: string;
  status: string;
  qr_code: string;
  total: number;
}
