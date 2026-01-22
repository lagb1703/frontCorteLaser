import type { Node } from "../interfaces";
import { Composite } from "../class/tree";
import { useState, useCallback } from "react";

export function useSematicalTree() {
    const [root, setRoot] = useState<Node | null>(null);
    const addNewNode = useCallback((newNode: Node, id: string) => {
        if (!root) {
            setRoot(newNode);
            return;
        }
        
        const targetId = id === "" ? root.getId() : id;

        const node: Node | null = root.find(targetId);
        if (node && node instanceof Composite) {
            node.add(newNode);
            const newRoot = Object.create(Object.getPrototypeOf(root));
            Object.assign(newRoot, root);
            setRoot(newRoot);
        }
    }, [root]);
    const deleteNode = useCallback((id: string) => {
        if (!root) return;
        if (root.getId() === id) {
            setRoot(null);
            return;
        }
        const node = root.find(id);
        const parentNode: Node | null | undefined = node?.parent;
        if (node && parentNode && parentNode instanceof Composite) {
            parentNode.remove(node);
            const newRoot = Object.create(Object.getPrototypeOf(root));
            Object.assign(newRoot, root);
            setRoot(newRoot);
        }
    }, [root]);

    const moveNode = useCallback((nodeId: string, newParentId: string) => {
        if (!root) return;
        const node = root.find(nodeId);
        if (!node) return;

        if (node.find(newParentId)) return; 

        const oldParent = node.parent;
        if (oldParent && oldParent instanceof Composite) {
            oldParent.remove(node);
        }

        const targetId = newParentId === "" ? root.getId() : newParentId;
        
        const newParent = root.find(targetId);
        if (newParent && newParent instanceof Composite) {
            newParent.add(node);
            const newRoot = Object.create(Object.getPrototypeOf(root));
            Object.assign(newRoot, root);
            setRoot(newRoot);
        }
    }, [root]);

    const getSematicalTree = useCallback(() => {
        return root?.getExpresion() || "";
    }, [root]);

    return {
        root,
        setRoot,
        addNewNode,
        deleteNode,
        moveNode,
        getSematicalTree
    }
}