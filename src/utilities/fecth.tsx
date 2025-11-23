
export class FetchWapper {
    private static instance: FetchWapper;
    private fetch: typeof fetch;
    private jwt: string | null = null;
    private suscriptors: Array<(value: string | null) => void> = [];
    private baseUrl: string = '';

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
            this.jwt = localStorage.getItem('token');
        }
        this.fetch = fetch;
    }

    public async send(url: string, options: RequestInit = {}, token?: string): Promise<Response> {
        const result = await this.fetch(`${this.baseUrl}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.jwt || token ? { 'Authorization': `Bearer ${this.jwt || token}` } : {}),
                ...options.headers,
            },
        });
        if (result.status === 401) {
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
        this.jwt = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        }
        this.suscriptors.forEach((suscriptor) => suscriptor(this.jwt));
    }
}