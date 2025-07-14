export class Cage {
  id: string = "";
  size: 'small' | 'medium' | 'large' = 'medium';
  number: number = 0;
  status: 'available' | 'occupied' | 'maintenance' = 'available';
  location: string = "";
  notes: string = "";
}

export class PensionStay {
  id: string = "";
  cageId: string = "";
  cage: Cage = new Cage();
  clientId: string = "";
  client: any = null;
  petId: string = "";
  pet: any = null;
  checkInDate: string = new Date().toISOString().split('T')[0];
  checkInTime: string = "";
  expectedCheckOutDate: string = "";
  actualCheckOutDate: string = "";
  checkOutTime: string = "";
  status: 'active' | 'completed' | 'cancelled' = 'active';
  baseRate: number = 0;
  extraCharges: number = 0;
  totalCharged: number = 0;
  isPaid: boolean = false;
  pendingServices: any[] = [];
  notes: string = "";
  createdAt: string = new Date().toISOString();
  updatedAt: string = new Date().toISOString();
}