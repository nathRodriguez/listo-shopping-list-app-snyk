import { authenticatedFetch } from "../auth/authentication";
import { CreateProductPayload, Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function createProduct(payload: CreateProductPayload): Promise<{ success: boolean; product?: Product; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const data = await res.json();
            return { success: true, product: data.product };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to create product" };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to create product" };
    }
}

export async function getProducts(): Promise<{ success: boolean; products?: any[]; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/products`);
        if (res.ok) {
            const data = await res.json();
            return { success: true, products: data.products };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to fetch products" };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to fetch products" };
    }
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            return { success: true };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to delete product" };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete product" };
    }
}
