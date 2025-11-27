import { FetchWapper } from "@/utilities/fecth";
import { type Material } from "../validators/materialValidators";
import { type Thickness } from "../validators/thicknessValidators";

export class MaterialService {
    private fetchWrapper: FetchWapper;
    private static instance: MaterialService;

    public static getInstance(): MaterialService {
        if (!MaterialService.instance) {
            MaterialService.instance = new MaterialService();
        }
        return MaterialService.instance;
    }

    private constructor() {
        this.fetchWrapper = FetchWapper.getInstance();
    }
    public async getAllMaterials(): Promise<Array<Material>>{
        const result = await this.fetchWrapper.send('/material/materials', {
            method: 'GET',
        });
        if (result.status !== 200) {
            throw new Error('Error fetching user data');
        }
        return await result.json();
    }
    public async getAllThickness(): Promise<Array<Thickness>>{
        const result = await this.fetchWrapper.send('/material/thickness/all', {
            method: 'GET',
        });
        if (result.status !== 200) {
            throw new Error('Error fetching user data');
        }
        return await result.json();
    }
    public async getMaterialById(materialId: string): Promise<Material>{
        return {
            name: "",
            price: 0,
            lastModification: new Date(),
        }
    }
    public async getThicknessByMaterial(materialId: string | number):Promise<Array<Thickness>>{
        const result = await this.fetchWrapper.send(`/material/thickness?materialId=${materialId}`, {
            method: 'GET',
        });
        if (result.status !== 200) {
            throw new Error('Error fetching user data');
        }
        return await result.json();
    }

    public async getThicknessNoLinkedToMaterial(materialId: string| number):Promise<Array<Thickness>>{
        const result = await this.fetchWrapper.send(`/material/thickness/noLinked?materialId=${materialId}`, {
            method: 'GET',
        });
        if (result.status !== 200) {
            throw new Error('Error fetching user data');
        }
        return await result.json();
    }
    public async addNewMaterial(material: Material): Promise<string>{
        const result = await this.fetchWrapper.send('/material/material', {
            method: 'POST',
            body: JSON.stringify(material),
        });
        if (result.status !== 201) {
            const text = await result.json().catch(() => '');
            throw new Error(`Error creating material: ${result.status} ${text}`);
        }
        return await result.text();
    }
    public async addNewThickness(thickness: Thickness): Promise<string>{
        const result = await this.fetchWrapper.send(`/material/thickness`, {
            method: 'POST',
            body: JSON.stringify(thickness),
        });
        if (result.status !== 201) {
            const text = await result.json().catch(() => '');
            throw new Error(`Error creating material: ${result.status} ${text}`);
        }
        return await result.text();
    }
    public async changeMaterial(materialId: string | number, material: Material): Promise<void>{
        const result = await this.fetchWrapper.send(`/material/material/${materialId}`, {
            method: 'PUT',
            body: JSON.stringify(material),
        });
        if (result.status !== 200 && result.status !== 204) {
            const text = await result.text().catch(() => '');
            throw new Error(`Error updating material: ${result.status} ${text}`);
        }
        return;
    }
    public async changeThickness(thicknessId: string | number, thickness: Thickness): Promise<void>{
        const result = await this.fetchWrapper.send(`/material/thickness/${thicknessId}`, {
            method: 'PUT',
            body: JSON.stringify(thickness),
        });
        if (result.status !== 200 && result.status !== 204) {
            const text = await result.text().catch(() => '');
            throw new Error(`Error updating material: ${result.status} ${text}`);
        }
        return;
    }
    public async addMaterialThickness(materialId: string | number, thicknessId: string | number): Promise<void>{
        const result = await this.fetchWrapper.send(`/material/mt/${materialId}/${thicknessId}`, {
            method: 'POST'
        });
        if (result.status !== 201) {
            const text = await result.json().catch(() => '');
            throw new Error(`Error creating material-thickness link: ${result.status} ${text}`);
        }
        return;
    }
    public async deleteMaterialThickness(materialId: string | number, thicknessId: string | number): Promise<void>{
        const result = await this.fetchWrapper.send(`/material/mt/${materialId}/${thicknessId}`, {
            method: 'DELETE'
        });
        if (result.status !== 204) {
            const text = await result.json().catch(() => '');
            throw new Error(`Error deleting material-thickness link: ${result.status} ${text}`);
        }
        return;
    }
    public async deleteMaterial(materialId: string | number): Promise<void>{
        await this.fetchWrapper.send(`/material/material/${materialId}`, {
            method: 'DELETE',
        });
    }
    public async deleteThickness(thicknessId: string | number): Promise<void>{
        await this.fetchWrapper.send(`/material/thickness/${thicknessId}`, {
            method: 'DELETE',
        });
    }
}
    