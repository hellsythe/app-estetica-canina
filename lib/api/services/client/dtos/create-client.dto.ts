
type CreatePetDto = {
    name: string;
    race: string;
    age: number;
    weight: number;
    color: string;
    notes: string;
}

export type CreateClientDto = {
    id: string;
    name: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    lastService: string ;
    type: string ;
    pets: CreatePetDto[];
    notes: string;
}