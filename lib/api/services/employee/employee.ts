export class Employee {
    id: string = "";
    name: string = "";
    lastname: string = "";
    email: string = "";
    phoneNumber: string = "";
    address: string = "";
    salary: number|null = null;
    startDate: string = new Date().toISOString().split('T')[0];
    status: string = "Activo";
    emergencyContact: string = "";
    emergencyPhone: string = "";
    notes: string = "";
    created_at: string = "";
    updated_at: string = "";
}