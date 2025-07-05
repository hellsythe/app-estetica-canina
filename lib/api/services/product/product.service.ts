import { BackendClient } from "../../clients/backend-client";
import { PaginationResultDto } from "../pagination-result.dto";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { Product } from "./product";

const backend_client = new BackendClient();

export const serviceProduct = {
  async getAll() {
    return await backend_client.get<PaginationResultDto<Product>>('/product');
  },

  async create(data: CreateProductDto) {
    return await backend_client.post<Product>('/product', data);
  },

  async update(id: string, data: UpdateProductDto) {
    return await backend_client.put<Product>(`/product/${id}`, data);
  },

  async delete(id: string) {
    return await backend_client.delete(`/product/${id}`);
  },
};
