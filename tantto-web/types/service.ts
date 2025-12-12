//Post
export interface CreateServiceResponse{
    serviceId: string;
    name: string;
    description: string;
    contractDuration: number;
    value: number;
    servicePicture?:string | null;
    message:string;
}

export interface CreateServiceRequest{
    name: string;
    description: string;
    contractDuration: number;
    value: number;
    servicePicture?:string | null;
}

// Get

export interface Service{
    id: string;
    name: string;
    description: string;
    contractDuration: number;
    value: number;
    servicePicture?: string | null;
}

export type ServicesListResponse = Service[]

export type UpdateServiceRequest = Partial<CreateServiceRequest>;

export interface UpdateServiceResponse{
    serviceId: string;
    message: string;
}

export interface DeleteServiceResponse{
    success: boolean;
    message: string;
}