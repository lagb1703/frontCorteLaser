import { FetchWapper } from "@/utilities/fecth";
import { type User } from "../validators/userValidators";

export class UserService{
    private static instance: UserService;
    private fetchWrapper: FetchWapper;

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    
    private constructor() {
        this.fetchWrapper = FetchWapper.getInstance();
    }

    public async register(user: User): Promise<boolean>{
        const result = await this.fetchWrapper.send('/user/register', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (result.status !== 201) {
            return false;
        }
        return true;
    }
    public async changeAddress(address: string): Promise<void>{
        const result = await this.fetchWrapper.send(`/user/address/${address}`, {
            method: 'PATCH',
        });
        if (result.status !== 200) {
            throw new Error('Error updating address');
        }
        return;
    }
    public async  getUser(): Promise<User>{
        const result = await this.fetchWrapper.send('/user/', {
            method: 'GET',
        });
        if (result.status !== 200) {
            throw new Error('Error fetching user data');
        }
        const userData: User = await result.json();
        return userData;
    }
    public async getAllUser() : Promise<Array<Partial<User>>>{
        const result = await this.fetchWrapper.send('/user/all', {
            method: 'GET',
        });
        if (result.status !== 200) {
            throw new Error('Error fetching user data');
        }
        const userData: Partial<User>[] = await result.json();
        return userData;
    }
    public async getUserById(id: number | string): Promise<User>{
        const result = await this.fetchWrapper.send(`/user/userId?userId=${id}`, {
            method: 'GET',
        });
        if (result.status !== 200) {
            throw new Error('Error fetching user data');
        }
        const userData: User = await result.json();
        return userData;
    }
}