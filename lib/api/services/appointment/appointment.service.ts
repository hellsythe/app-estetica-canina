import { BackendClient } from "../../clients/backend-client";
import { PaginationResultDto } from "../pagination-result.dto";
import { CreateAppointmentDto } from "./dtos/create-appointment.dto";
import { UpdateAppointmentDto } from "./dtos/update-appointment.dto";
import { Appointment } from "./appointment";

const backend_client = new BackendClient();

export const serviceAppointment = {
  async getAll() {
    return await backend_client.get<PaginationResultDto<Appointment>>('/appointment');
  },

  async create(data: CreateAppointmentDto) {
    return await backend_client.post<Appointment>('/appointment', data);
  },

  async update(id: string, data: UpdateAppointmentDto) {
    return await backend_client.put<Appointment>(`/appointment/${id}`, data);
  },

  async delete(id: string) {
    return await backend_client.delete(`/appointment/${id}`);
  },
};
