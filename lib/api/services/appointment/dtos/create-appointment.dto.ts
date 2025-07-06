
export type CreateAppointmentDto = {
  clientId: string;
  petId: string;
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
  employeeId: string;
  notes: string;
}