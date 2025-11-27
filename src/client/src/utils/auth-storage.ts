export class AuthStorage {
    private static TOKEN_KEY = 'token';

    static setToken(token: string) {
        document.cookie = `${this.TOKEN_KEY}=${token}; path=/; max-age=86400; samesite=lax; secure=false`;
    }

    static getToken(): string | null {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.TOKEN_KEY) {
                return value;
            }
        }
        return null;
    }

    static clear() {
        document.cookie = `${this.TOKEN_KEY}=; path=/; max-age=0`;
    }
}