import { authenticatedFetch } from "../auth/authentication";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function getShoppingLists(): Promise<{ success: boolean; shoppingLists?: any[]; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/shopping-lists`);
        if (res.ok) {
            const data = await res.json();
            return { success: true, shoppingLists: data.shoppingLists };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to fetch shopping lists" };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to fetch shopping lists" };
    }
}

export async function createShoppingList(name: string): Promise<{ success: boolean; shoppingList?: any; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/shopping-lists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        if (res.ok) {
            const data = await res.json();
            return { success: true, shoppingList: data.shoppingList };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to create shopping list" };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to create shopping list" };
    }
}

export async function deleteShoppingList(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/shopping-lists/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            return { success: true };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to delete shopping list" };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete shopping list" };
    }
}