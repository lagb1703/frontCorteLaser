
export class FetchWapper {
    private static instance: FetchWapper;
    private jwt: string | null = null;
    private suscriptors: Array<(value: string | null) => void> = [];
    private baseUrl: string = '';

    private normalizeToken(token: string | null | undefined): string | null {
        if (!token) return null;
        const t = token.trim();
        if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
            return t.slice(1, -1).trim();
        }
        return t;
    }

    public static getInstance(): FetchWapper {
        if (!FetchWapper.instance) {
            FetchWapper.instance = new FetchWapper();
        }
        return FetchWapper.instance;
    }

    private constructor() {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!baseUrl) {
            throw new Error('VITE_API_BASE_URL is not defined in environment variables');
        }
        this.baseUrl = baseUrl;
        if (typeof window !== 'undefined') {
            this.jwt = this.normalizeToken(localStorage.getItem('token'));
        }
    }

    public async send(url: string, options: RequestInit = {}, token?: string): Promise<Response> {
        const authToken = this.normalizeToken(token ?? this.jwt);
        const result = await fetch(`${this.baseUrl}${url}`, {
            ...options,
            headers: {
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
                ...options.headers,
            },
        });
        if (result.status === 400) {
            const errorData = await result.json();
            console.error('Bad Request:', errorData);
        }
        if (result.status === 401) {
            this.setToken(null);
        }
        if (result.status === 403) {
            this.setToken(null);
        }
        return result;
    }

    public getToken(suscriptor?: (value: string | null) => void): string | null {
        if (suscriptor) {
            this.suscriptors.push(suscriptor);
        }
        return this.jwt;
    }

    public setToken(token: string | null): void {
        this.jwt = this.normalizeToken(token);
        if (typeof window !== 'undefined') {
            if (this.jwt) {
                localStorage.setItem('token', this.jwt);
            } else {
                localStorage.removeItem('token');
            }
        }
        this.suscriptors.forEach((suscriptor) => suscriptor(this.jwt));
    }
}