import * as THREE from "three";
import { describe, expect, it } from "vitest";
import {
  findBendJoints,
  toSignedDegrees,
  type BendLineMetadata,
} from "./bendJoints";

function metadata(
  bendLineIndex: number,
  occurrence: number,
): BendLineMetadata {
  return {
    type: "bend-line",
    bendLineIndex,
    occurrence,
    part: 0,
    start: [0, 0, 0.005],
    end: [1, 0, 0.005],
    axis: [1, 0, 0],
  };
}

describe("findBendJoints", () => {
  it("discovers and sorts bend joints while ignoring other nodes", () => {
    const root = new THREE.Object3D();
    root.name = "rig_root";

    const align = new THREE.Object3D();
    align.name = "bend_line_0_align";
    align.userData.type = "alignment";
    root.add(align);

    const secondOccurrence = new THREE.Bone();
    secondOccurrence.name = "bend_line_0_1";
    secondOccurrence.userData = metadata(0, 1);
    root.add(secondOccurrence);

    const secondLine = new THREE.Bone();
    secondLine.name = "bend_line_1";
    secondLine.userData = metadata(1, 0);
    root.add(secondLine);

    const firstLine = new THREE.Bone();
    firstLine.name = "bend_line_0";
    firstLine.userData = metadata(0, 0);
    root.add(firstLine);

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
});

describe("toSignedDegrees", () => {
  it("maps direction to the bend sign and clamps the angle", () => {
    expect(toSignedDegrees({ direction: "up", angle: 90 })).toBe(90);
    expect(toSignedDegrees({ direction: "down", angle: 90 })).toBe(-90);
    expect(toSignedDegrees({ direction: "up", angle: 999 })).toBe(180);
    expect(toSignedDegrees({ direction: "down", angle: -10 })).toBe(0);
  });
});
