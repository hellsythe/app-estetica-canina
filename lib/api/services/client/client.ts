export class Pet {
    id: number;
    name: string = "";
    breed: string = "";
    age: number;
    weight: number;
    color: string = "";
    notes: string = "";
}

export class Client {
    id: string = "";
    name: string = "";
    lastname: string = "";
    email: string = "";
    phoneNumber: string = "";
    lastService: string = "";
    type: string = "General";
    pets: Pet[] = [];
    notes: string = "";
    lastVisit: string = "";
    totalVisits: number = 0;
    status: string = "Activo";
}