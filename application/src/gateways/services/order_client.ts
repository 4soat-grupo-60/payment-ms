import {IOrderGateway} from "../../interfaces/gateways";

export class OrderClient implements IOrderGateway {

  apiUrl: string;

  constructor() {
    this.apiUrl = process.env.PEDIDO_API_URL;
  }

  async updatePayment(orderId: number, paymentId: string): Promise<boolean> {
    const url = `${this.apiUrl}/api/orders/payment/${orderId}/${paymentId}`;
    const response = await fetch(url, {method: 'PUT'});

    if (!response.ok) {
      throw new Error('Error updating order');
    }

    return response.status == 200;
  }
}