

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

export type CreateSaleDto ={
  id: string ;
  cart: object[];
  paymentMethod: string ;
  amountPaid: number;
  change: number ;
  total: number ;
  client: object ;
}