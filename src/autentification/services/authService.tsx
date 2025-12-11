import { FetchWapper } from "@/utilities/fecth";

export class AuthService {
    private static instance: AuthService;
    private fetchWrapper: FetchWapper;

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() {
        this.fetchWrapper = FetchWapper.getInstance();
    }

    public async login(user: string, password: string): Promise<boolean> {
        const result = await this.fetchWrapper.send('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: user, password: password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(result.status === 401){
            const errorData = await result.json();
            throw new Error(errorData.detail || 'Unauthorized');
        }
        if (result.status !== 200) {
            return false;
        }
        const token = await result.text();
        this.fetchWrapper.setToken(token);
        return true;
    }
    
    public refreshToken(_token: string): string {
        return "";
    }
}