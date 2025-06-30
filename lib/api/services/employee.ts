const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const employeeService = {
  async getAll() {
    const response = await fetch(`${API_URL}/employe`);
    if (!response.ok) throw new Error('Error fetching employees');
    return response.json();
  },

  async create(employeeData: any) {
    const response = await fetch(`${API_URL}/employe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error('Error creating employee');
    return response.json();
  },

  async update(id: string, employeeData: any) {
    const response = await fetch(`${API_URL}/employe/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error('Error updating employee');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/employe/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting employee');
    return response.json();
  },
};