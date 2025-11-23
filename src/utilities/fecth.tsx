import { AuthService } from "@/autentification/services/authService";
export class FetchWapper {
    private static instance: FetchWapper;
    private fetch: typeof fetch;
    private jwt: string | null = null;
    private authService: AuthService = AuthService.getInstance();
    private suscriptors: Array<(value: string | null) => void> = [];

    public static getInstance(): FetchWapper {
        if (!FetchWapper.instance) {
            FetchWapper.instance = new FetchWapper();
        }
        return FetchWapper.instance;
    }

    private constructor() {
        if (typeof window !== 'undefined') {
            this.jwt = localStorage.getItem('token');
        }
        this.fetch = fetch;
    }

    public async send(url: string, options: RequestInit = {}, token?: string): Promise<Response> {
        const result = await this.fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.jwt || token ? { 'Authorization': `Bearer ${this.jwt || token}` } : {}),
                ...options.headers,
            },
        });
        if (result.status === 401) {
            this.jwt = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            this.suscriptors.forEach((suscriptor) => suscriptor(this.jwt));
        }
        return result;
    }

    public getToken(suscriptor?: (value: string | null) => void): string | null {
        if (suscriptor) {
            this.suscriptors.push(suscriptor);
        }
        return this.jwt;
    }
}