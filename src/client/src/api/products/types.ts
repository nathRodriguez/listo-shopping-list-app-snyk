export interface Product {
    id: string;
    name: string;
    user_id: string | null;
    is_predefined: boolean;
}

export interface CreateProductPayload {
    name: string;
}
