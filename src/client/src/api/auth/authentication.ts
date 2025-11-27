
import { RegisterUserPayload } from "./types";
import { AuthStorage } from "../../utils/auth-storage";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function signup(payload: RegisterUserPayload): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            return { success: true };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Registration failed" };
        }
    } catch {
        return { success: false, error: "Registration failed" };
    }
}

export async function login(payload: { email: string; password: string }): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            const data = await res.json();
            return { success: true, user: data.user, token: data.token };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Login failed" };
        }
    } catch {
        return { success: false, error: "Login failed" };
    }
}

export async function refreshToken(token: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });
        if (res.ok) {
            const data = await res.json();
            return { success: true, token: data.token };
        } else {
            return { success: false, error: "Refresh failed" };
        }
    } catch {
        return { success: false, error: "Refresh failed" };
    }
}

export async function getCurrentUser(): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/user/current`);
        if (res.ok) {
            const data = await res.json();
            return { success: true, user: data.user };
        } else {
            return { success: false, error: "Not authenticated" };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Not authenticated" };
    }
}

export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = AuthStorage.getToken();
    if (!token) {
        throw new Error('No token');
    }

    const requestWithToken = (token: string) => {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${token}`,
            },
        });
    };

    let res = await requestWithToken(token);

    if (res.status === 401) {
        // Try refresh
        const refreshResult = await refreshToken(token);
        if (refreshResult.success && refreshResult.token) {
            AuthStorage.setToken(refreshResult.token);
            // Retry the request
            res = await requestWithToken(refreshResult.token);
        }
    }

    return res;
}
