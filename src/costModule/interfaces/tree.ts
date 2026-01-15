export interface Node{
    symbol: string;
    name: string;
    id: string;
    parent: Node | null;
    getExpresion(): string;
    getName(): string;
    getId(): string;
    find(id: string): Node | null;
}