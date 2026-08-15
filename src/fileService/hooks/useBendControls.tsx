import { useState } from "react";
import type {
  BendControlValue,
  BendDirection,
  BendJoint,
} from "../utils/bendJoints";
import { createDefaultBendValue } from "../utils/bendJoints";

export function useBendControls(joints: readonly BendJoint[]) {
  const [values, setValues] = useState<Record<string, BendControlValue>>({});

  function setDirection(key: string, direction: BendDirection) {
    setValues((previous) => ({
      ...previous,
      [key]: {
        ...(previous[key] ?? createDefaultBendValue()),
        direction,
      },
    }));
  }

  function setAngle(key: string, angle: number) {
    const safeAngle = Number.isFinite(angle)
      ? Math.min(180, Math.max(0, angle))
      : 0;

    setValues((previous) => ({
      ...previous,
      [key]: {
        ...(previous[key] ?? createDefaultBendValue()),
        angle: safeAngle,
      },
    }));
  }

  function reset() {
    const resetValues: Record<string, BendControlValue> = {};

    joints.forEach((joint) => {
      resetValues[joint.key] = createDefaultBendValue();
    });

    setValues(resetValues);
  }

  return { values, setDirection, setAngle, reset };
}
