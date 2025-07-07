

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

export class Sale {
  id: string = "";
  cart: any[] = [];
  paymentMethod: string = "";
  amountPaid: number = 0;
  change: number = 0;
  total: number = 0;
  client: object = {};
}