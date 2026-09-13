import { useMemo, useState } from "react";
import type {
  BendControlValue,
  BendDirection,
  BendJoint,
} from "../utils/bendJoints";
import { createDefaultBendValue } from "../utils/bendJoints";

export function useBendControls(joints: readonly BendJoint[]) {
  const [store, setStore] = useState<Record<string, BendControlValue>>({});

  // Seed a default per joint and drop values left over from a previous model.
  // Keys come from the exporter, so reloading the same file keeps its angles.
  const values = useMemo(() => {
    const current: Record<string, BendControlValue> = {};
    joints.forEach((joint) => {
      current[joint.key] = store[joint.key] ?? createDefaultBendValue();
    });
    return current;
  }, [joints, store]);

  function setDirection(key: string, direction: BendDirection) {
    setStore((previous) => ({
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

    setStore((previous) => ({
      ...previous,
      [key]: {
        ...(previous[key] ?? createDefaultBendValue()),
        angle: safeAngle,
      },
    }));
  }

  function reset() {
    setStore({});
  }

  return { values, setDirection, setAngle, reset };
}
