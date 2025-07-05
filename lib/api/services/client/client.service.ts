import { BackendClient } from "../../clients/backend-client";
import { PaginationResultDto } from "../pagination-result.dto";
import { CreateClientDto } from "./dtos/create-client.dto";
import { UpdateClientDto } from "./dtos/update-client.dto";
import { Client } from "./client";

const backend_client = new BackendClient();

export const clientService = {
  async getAll() {
    return await backend_client.get<PaginationResultDto<Client>>('/client');
  },

  async create(data: CreateClientDto) {
    return await backend_client.post<Client>('/client', data);
  },

  async update(id: string, data: UpdateClientDto) {
    return await backend_client.put<Client>(`/client/${id}`, data);
  },

  async delete(id: string) {
    return await backend_client.delete(`/client/${id}`);
  },
};
