import { BackendClient } from "../../clients/backend-client";
import { PaginationResultDto } from "../pagination-result.dto";
import { CreateSaleDto } from "./dtos/create-sale.dto";
import { UpdateSaleDto } from "./dtos/update-sale.dto";
import { Sale } from "./sale";

const backend_client = new BackendClient();

export const saleService = {
  async getAll() {
    return await backend_client.get<PaginationResultDto<Sale>>('/sale');
  },

  async create(data: CreateSaleDto) {
    return await backend_client.post<Sale>('/sale', data);
  },

  async update(id: string, data: UpdateSaleDto) {
    return await backend_client.put<Sale>(`/sale/${id}`, data);
  },

  async delete(id: string) {
    return await backend_client.delete(`/sale/${id}`);
  },
};
