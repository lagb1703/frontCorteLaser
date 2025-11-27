import { FetchWapper } from "@/utilities/fecth";
import { type FileDb } from "../validators/fileValidator";
import { type PriceResponse } from "../validators/priceValidator";

export class FileService {
    private fetchWrapper: FetchWapper;

    private static instance: FileService;

    public static getInstance(): FileService {
        if (!FileService.instance) {
            FileService.instance = new FileService();
        }
        return FileService.instance;
    }

    constructor() {
        this.fetchWrapper = FetchWapper.getInstance();
    }

    public async getAllUserInfoFiles(): Promise<Array<FileDb>> {
        const result = await this.fetchWrapper.send(`/file/`, {
            method: "GET",
        });
        if (result.status !== 200) {
            throw new Error("Error al obtener los archivos del usuario");
        }
        return await result.json();
    }
    public async saveFile(file: Blob): Promise<string | number> {
        const result = await this.fetchWrapper.send(`/file/save`, {
            method: "POST",
            body: file
        })
        if (result.status !== 200) {
            throw new Error("Error al subir el archivo");
        }
        return await result.text();
    }
    public async getFile(id: string | number): Promise<Blob> {
        const result = await this.fetchWrapper.send(`/file/donwload?id=1${id}`, {
            method: "GET",
        })
        if (result.status !== 200) {
            throw new Error("Error al descargar el archivo");
        }
        return await result.blob();
    }
    public async deleteFile(id: string | number): Promise<void> {
        const result = await this.fetchWrapper.send(`/file?id=${id}`, {
            method: "DELETE",
        })
        if (result.status !== 200) {
            throw new Error("Error al eliminar el archivo");
        }
    }
    public async getImage(id: string | number): Promise<Blob> {
        const result = await this.fetchWrapper.send(`/file/image?id=${id}`, {
            method: "GET",
        });
        if (result.status !== 200) {
            throw new Error("Error al obtener la imagen del archivo");
        }
        return await result.blob();
    }
    public async getPrice(id: string | number, mateiralId: string | number, thicknessId: string | number): Promise<PriceResponse> {
        const result = await this.fetchWrapper.send(`/file/price?id=${id}&materialId=${mateiralId}&thicknessId=${thicknessId}`, {
            method: "GET",
        });
        if (result.status !== 200) {
            throw new Error("Error al obtener el precio del archivo");
        }
        return await result.json();
    }
}