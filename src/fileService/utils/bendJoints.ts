import * as THREE from "three";

export type BendDirection = "up" | "down";

export interface BendNodeMetadata {
  type: "bend-node";
  role: "son";
  nodeId: string;
  parentId: string;
  part: number;
  bendLineIndex: number;
  occurrence: number;
  start: [number, number, number];
  end: [number, number, number];
  axis: [number, number, number];
}

export interface BendJoint {
  key: string;
  node: THREE.Object3D;
  label: string;
  metadata: BendNodeMetadata;
  /**
   * The node's local rotation as the exporter baked it: it already places the
   * piece on its bend line, so a fold has to be composed on top of it instead
   * of overwriting it.
   */
  restQuaternion: THREE.Quaternion;
}

export interface BendControlValue {
  direction: BendDirection;
  angle: number;
}

export function createDefaultBendValue(): BendControlValue {
  return { direction: "up", angle: 0 };
}

export function getBendLabel(metadata: BendNodeMetadata): string {
  const bendNumber = metadata.bendLineIndex + 1;
  return metadata.occurrence > 0
    ? `Doblez ${bendNumber} (${metadata.occurrence + 1})`
    : `Doblez ${bendNumber}`;
}

export function findBendJoints(root: THREE.Object3D): BendJoint[] {
  const joints: BendJoint[] = [];
  root.traverse((node) => {
    if (node.userData.type !== "bend-node") return;
    const metadata = node.userData as BendNodeMetadata;
    joints.push({
      // nodeId comes from the exporter and survives a reload; node.uuid does not
      key: metadata.nodeId,
      node,
      label: getBendLabel(metadata),
      metadata,
      restQuaternion: node.quaternion.clone(),
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

const BEND_AXIS = new THREE.Vector3(1, 0, 0);

/**
 * Fold a joint by composing the rotation on top of its rest pose. Post-multiplying
 * rotates in the node's own frame, which the exporter aligned with the bend line.
 */
export function applyBendRotation(joint: BendJoint, degrees: number): void {
  joint.node.quaternion
    .copy(joint.restQuaternion)
    .multiply(
      new THREE.Quaternion().setFromAxisAngle(
        BEND_AXIS,
        THREE.MathUtils.degToRad(degrees),
      ),
    );
}
