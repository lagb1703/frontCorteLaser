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
        return [];
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
        return "";
    }
    public async addNewThickness(thickness: Thickness, materialId: string): Promise<string>{
        return "";
    }
    public async changeMaterial(materialId: string, material: Material): Promise<void>{
        
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
    