import { BackendClient } from "../../clients/backend-client";
import { PaginationResultDto } from "../pagination-result.dto";
import { CreateServiceDto } from "./dtos/create-service.dto";
import { UpdateServiceDto } from "./dtos/update-service.dto";
import { Service } from "./service";

const backend_client = new BackendClient();

export const serviceService = {
  async getAll() {
    return await backend_client.get<PaginationResultDto<Service>>('/service');
  },

  async create(data: CreateServiceDto) {
    return await backend_client.post<Service>('/service', data);
  },

  async update(id: string, data: UpdateServiceDto) {
    return await backend_client.put<Service>(`/service/${id}`, data);
  },

  async delete(id: string) {
    return await backend_client.delete(`/service/${id}`);
  },
};
