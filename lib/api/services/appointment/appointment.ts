
export class Appointment {
  id: string = "";
  clientId: string = "";
  petId: string = "";
  serviceId: string = "";
  date: string = new Date().toISOString().split('T')[0];
  time: string = "";
  duration: number = 0;
  price: number = 0;
  status: string = "";
  employeeId: string = "";
  notes: string = "";
  clientName: string = "";
  petName: string = "";
  petBreed: string = "";
  serviceName: string = "";
  clientEmail: string = "";
  clientPhone: string = "";
  service: string = "";
  employee: string = "";
}