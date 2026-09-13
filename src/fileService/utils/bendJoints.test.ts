import * as THREE from "three";
import { describe, expect, it } from "vitest";
import {
  applyBendRotation,
  findBendJoints,
  toSignedDegrees,
  type BendNodeMetadata,
} from "./bendJoints";

function metadata(
  nodeId: string,
  bendLineIndex: number,
  occurrence: number,
): BendNodeMetadata {
  return {
    type: "bend-node",
    role: "son",
    nodeId,
    parentId: "father",
    part: 0,
    bendLineIndex,
    occurrence,
    start: [0, 0, 0.005],
    end: [1, 0, 0.005],
    axis: [1, 0, 0],
  };
}

function son(nodeId: string, bendLineIndex: number, occurrence: number) {
  const node = new THREE.Object3D();
  node.name = nodeId;
  node.userData = metadata(nodeId, bendLineIndex, occurrence);
  return node;
}

describe("findBendJoints", () => {
  it("discovers and sorts sons while ignoring other nodes", () => {
    const root = new THREE.Object3D();
    root.name = "father";
    root.userData = { type: "part-root", role: "father", nodeId: "father", part: 0 };

    const secondOccurrence = son("son2", 0, 1);
    const secondLine = son("son3", 1, 0);
    const firstLine = son("son1", 0, 0);
    root.add(secondOccurrence, secondLine, firstLine);

    const joints = findBendJoints(root);

    expect(joints).toHaveLength(3);
    expect(joints.map((joint) => joint.label)).toEqual([
      "Doblez 1",
      "Doblez 1 (2)",
      "Doblez 2",
    ]);
    expect(joints[0]?.node).toBe(firstLine);
    expect(joints[1]?.metadata.occurrence).toBe(1);
  });

  it("keys joints by the exporter nodeId so values survive a reload", () => {
    const root = new THREE.Object3D();
    const node = son("son7", 0, 0);
    root.add(node);

    const joints = findBendJoints(root);

    expect(joints[0]?.key).toBe("son7");
    expect(joints[0]?.key).not.toBe(node.uuid);
  });

  it("captures the rest pose baked by the exporter", () => {
    const root = new THREE.Object3D();
    const node = son("son1", 0, 0);
    node.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    root.add(node);

    const joints = findBendJoints(root);

    expect(joints[0]?.restQuaternion.z).toBeCloseTo(Math.SQRT1_2);
  });
});

describe("applyBendRotation", () => {
  it("folds around the node's own X axis without losing its pivot", () => {
    const root = new THREE.Object3D();
    const node = son("son1", 0, 0);
    // a pivot frame like the exporter emits: rotated and translated onto the bend line
    node.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    node.position.set(10, 5, 0.005);
    root.add(node);

    const [joint] = findBendJoints(root);
    const rest = joint.restQuaternion.clone();

    applyBendRotation(joint, 90);

    // the pivot placement is untouched
    expect(node.position.toArray()).toEqual([10, 5, 0.005]);
    // and the fold is composed on top of the rest pose, not written over it
    expect(node.quaternion.equals(rest)).toBe(false);

    const folded = new THREE.Vector3(0, 1, 0).applyQuaternion(node.quaternion);
    const expected = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          Math.PI / 2,
        ),
      )
      .applyQuaternion(rest);
    expect(folded.distanceTo(expected)).toBeLessThan(1e-6);
  });

  it("returns to the rest pose at zero degrees", () => {
    const root = new THREE.Object3D();
    const node = son("son1", 0, 0);
    node.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 3);
    root.add(node);

    const [joint] = findBendJoints(root);
    applyBendRotation(joint, 120);
    applyBendRotation(joint, 0);

    expect(node.quaternion.angleTo(joint.restQuaternion)).toBeCloseTo(0);
  });
});

describe("toSignedDegrees", () => {
  it("maps direction to the bend sign and clamps the angle", () => {
    expect(toSignedDegrees({ direction: "up", angle: 90 })).toBe(90);
    expect(toSignedDegrees({ direction: "down", angle: 90 })).toBe(-90);
    expect(toSignedDegrees({ direction: "up", angle: 999 })).toBe(180);
    expect(toSignedDegrees({ direction: "down", angle: -10 })).toBe(0);
  });
});
