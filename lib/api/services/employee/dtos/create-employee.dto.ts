export type CreateEmployeeDto = {
  name: string;
  lastName: string;
  phone: string;
  address?: string;
  salary?: string;
  startDate: string;
  status: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
};