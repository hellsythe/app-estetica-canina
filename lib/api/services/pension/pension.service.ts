import { BackendClient } from "../../clients/backend-client";
import { PaginationResultDto } from "../pagination-result.dto";
import { Cage, PensionStay } from "./pension";

const backend_client = new BackendClient();

export const pensionService = {
  // Cage management
  async getAllCages() {
    return await backend_client.get<PaginationResultDto<Cage>>('/cage');
  },

  async createCage(data: Partial<Cage>) {
    return await backend_client.post<Cage>('/cage', data);
  },

  async updateCage(id: string, data: Partial<Cage>) {
    return await backend_client.put<Cage>(`/cage/${id}`, data);
  },

  async deleteCage(id: string) {
    return await backend_client.delete(`/cage/${id}`);
  },

  // Pension stays
  async getAllPensionStays() {
    return await backend_client.get<PaginationResultDto<PensionStay>>('/pension');
  },

  async getActivePensionStays() {
    return await backend_client.get<PaginationResultDto<PensionStay>>('/pension/active');
  },

  async createPensionStay(data: Partial<PensionStay>) {
    return await backend_client.post<PensionStay>('/pension', data);
  },

  async updatePensionStay(id: string, data: Partial<PensionStay>) {
    return await backend_client.put<PensionStay>(`/pension/${id}`, data);
  },

  async checkOutPensionStay(id: string, data: { 
    checkOutDate: string, 
    checkOutTime: string,
    extraCharges?: number,
    totalCharged: number,
    isPaid: boolean
  }) {
    return await backend_client.put<PensionStay>(`/pension/${id}/checkout`, data);
  },

  async deletePensionStay(id: string) {
    return await backend_client.delete(`/pension/${id}`);
  },
};