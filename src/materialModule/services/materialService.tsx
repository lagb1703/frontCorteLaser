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
        return [];
    }
    public async getMaterialById(materialId: string): Promise<Material>{
        return {
            name: "",
            price: 0,
            lastModification: new Date(),
        }
    }
    public async getThicknessByMaterial(materialId: string):Promise<Array<Thickness>>{
        return [];
    }
    public async addNewMaterial(material: Material): Promise<string>{
        const body = {
            ...material,
            lastModification: material.lastModification ? material.lastModification.toISOString() : null,
        };
        const result = await this.fetchWrapper.send('/material/materials', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (result.status !== 201) {
            const text = await result.text().catch(() => '');
            throw new Error(`Error creating material: ${result.status} ${text}`);
        }
        // suponer que el API devuelve el id en el body
        try {
            const data = await result.json();
            return data?.id ?? '';
        } catch {
            return '';
        }
    }
    public async addNewThickness(thickness: Thickness, materialId: string): Promise<string>{
        return "";
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
    public async changeThickness(thicknessId: string, thickness: Thickness): Promise<void>{
        
    }
    public async addMaterialThickness(materialId: string, thicknessId: string): Promise<void>{
        
    }
    public async deleteMaterialThickness(materialId: string, thicknessId: string): Promise<void>{
        
    }
    public async deleteMaterial(materialId: string): Promise<void>{
        
    }
    public async deleteThickness(thicknessId: string): Promise<void>{
        
    }
}
    