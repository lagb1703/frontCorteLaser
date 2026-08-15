import * as THREE from "three";

export type BendDirection = "up" | "down";

export interface BendLineMetadata {
  type: "bend-line";
  bendLineIndex: number;
  occurrence: number;
  part: number;
  start: [number, number, number];
  end: [number, number, number];
  axis: [number, number, number];
}

export interface BendJoint {
  key: string;
  node: THREE.Object3D;
  label: string;
  metadata: BendLineMetadata;
}

export interface BendControlValue {
  direction: BendDirection;
  angle: number;
}

export function createDefaultBendValue(): BendControlValue {
  return { direction: "up", angle: 0 };
}

export function getBendLabel(metadata: BendLineMetadata): string {
  const bendNumber = metadata.bendLineIndex + 1;
  return metadata.occurrence > 0
    ? `Doblez ${bendNumber} (${metadata.occurrence + 1})`
    : `Doblez ${bendNumber}`;
}

export function findBendJoints(root: THREE.Object3D): BendJoint[] {
  const joints: BendJoint[] = [];
  root.traverse((node) => {
    console.log('node', node.userData);
    if (node.userData.type !== "bend-line") return;
    const metadata = node.userData as BendLineMetadata;
    joints.push({
      key: node.uuid,
      node,
      label: getBendLabel(metadata),
      metadata,
    });
  });

  return joints.sort((first, second) => {
    if (first.metadata.bendLineIndex !== second.metadata.bendLineIndex) {
      return first.metadata.bendLineIndex - second.metadata.bendLineIndex;
    }
    return first.metadata.occurrence - second.metadata.occurrence;
  });
}

export function toSignedDegrees(value: BendControlValue): number {
  const angle = Number.isFinite(value.angle)
    ? Math.min(180, Math.max(0, value.angle))
    : 0;
  return value.direction === "down" && angle > 0 ? -angle : angle;
}
