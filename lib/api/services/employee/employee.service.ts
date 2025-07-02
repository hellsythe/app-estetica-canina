import { BackendClient } from "../../clients/backend-client";
import { PaginationResultDto } from "../pagination-result.dto";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import { UpdateEmployeeDto } from "./dtos/update-employee.dto";
import { Employee } from "./employee";

const backend_client = new BackendClient();

export const employeeService = {
  async getAll() {
    return await backend_client.get<PaginationResultDto<Employee>>('/employe');
  },

  async create(employeeData: CreateEmployeeDto) {
    return await backend_client.post<Employee>('/employe', employeeData);
  },

  async update(id: string, employeeData: UpdateEmployeeDto) {
    return await backend_client.put<Employee>(`/employe/${id}`, employeeData);
  },

  async delete(id: string) {
    return await backend_client.delete(`/employe/${id}`);
  },
};