import type { Node } from "../interfaces";

export class Leaf implements Node {
    symbol: string;
    name: string;
    id: string;
    parent: Node | null = null;

    constructor(symbol: string, name: string) {
        this.symbol = symbol;
        this.name = name;
        this.id = crypto.randomUUID();
    }

    getExpresion(): string {
        return this.symbol;
    }

    getName(): string {
        return this.name;
    }

    getId(): string {
        return this.id;
    }

    find(id: string): Node | null {
        return this.id === id ? this : null;
    }
}

export class Composite implements Node {
    symbol: string;
    name: string;
    nridad: number | "*";
    id: string = crypto.randomUUID();
    children: Node[];
    parent: Node | null = null;

    constructor(symbol: string, name: string, nridad: number | "*") {
        this.symbol = symbol;
        this.name = name;
        this.nridad = nridad;
        this.children = [];
    }

    add(child: Node): void {
        if(this.nridad !== "*" && this.nridad !== 0 && this.children.length >= this.nridad) {
            throw new Error(`Cannot add more than ${this.nridad} children to this node.`);
        }
        this.children.push(child);
        child.parent = this as unknown as Node;
    }

    remove(child: Node): void {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = null;
        }
    }

    getChildren(): Node[] {
        return this.children;
    }

    getExpresion(): string {
        if (this.children.length === 0) {
            throw new Error("Composite node has no children.");
        }
        const childExpressions = this.children.map(child => child.getExpresion());
        const nridad = this.nridad === "*" ? Infinity : this.nridad;
        if (nridad === 1) {
            return `${this.symbol}(${childExpressions[0]})`;
        }
        return `(${childExpressions.join(` ${this.symbol} `)})`;
    }

    getName(): string {
        return this.name;
    }

    getId(): string {
        return this.id;
    }
    
    find(id: string): Node | null {
        if (this.id === id) {
            return this;
        }
        for (const child of this.children) {
            const found = child.find(id);
            if (found) {
                return found;
            }
        }
        return null;
    }
}