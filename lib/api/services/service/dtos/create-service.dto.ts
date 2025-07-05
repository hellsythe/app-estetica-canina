
export type CreateServiceDto = {
    id: string;
    name: string;
    description: string;
    email: string;
    price: number;
    duration: number;
    category: string;
    status: string;
    include: string;
    require: string;
    notes: string;
}