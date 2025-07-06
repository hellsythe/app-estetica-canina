
export class Appointment {
  id: string = "";
  date: string = new Date().toISOString().split('T')[0];
  time: string = "";
  price: number = 0;
  status: string = "";
  notes: string = "";
  employee: string = "";
  client: any = {};
  pet: any = {};
  service: any = {};
}