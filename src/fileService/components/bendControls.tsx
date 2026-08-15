import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  BendControlValue,
  BendDirection,
  BendJoint,
} from "../utils/bendJoints";
import { createDefaultBendValue } from "../utils/bendJoints";

interface BendControlsProps {
  joints: readonly BendJoint[];
  values: Record<string, BendControlValue>;
  onDirectionChange: (key: string, direction: BendDirection) => void;
  onAngleChange: (key: string, angle: number) => void;
  onReset: () => void;
}

export default function BendControls({
  joints,
  values,
  onDirectionChange,
  onAngleChange,
  onReset,
}: BendControlsProps) {
  if (joints.length === 0) return null;

  return (
    <div className="w-full px-4 pb-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle>Lineas de doblez</CardTitle>
            <CardDescription>
              Define la direccion y el angulo de cada doblez.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            Restablecer
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {joints.map((joint) => {
            const value = values[joint.key] ?? createDefaultBendValue();
            const angleId = `${joint.key}-angle`;
            const directionId = `${joint.key}-direction`;

            return (
              <div key={joint.key} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Label className="font-semibold">{joint.label}</Label>
                  <span className="text-sm text-muted-foreground">
                    {value.angle}°
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_7rem]">
                  <div className="grid gap-2">
                    <Label htmlFor={directionId}>Direccion</Label>
                    <Select
                      value={value.direction}
                      onValueChange={(direction) => {
                        if (direction === "up" || direction === "down") {
                          onDirectionChange(joint.key, direction);
                        }
                      }}
                    >
                      <SelectTrigger id={directionId} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="up">Arriba (+)</SelectItem>
                        <SelectItem value="down">Abajo (-)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={angleId}>Angulo</Label>
                    <Input
                      id={angleId}
                      type="number"
                      min={0}
                      max={180}
                      step={1}
                      value={value.angle}
                      onChange={(event) => {
                        onAngleChange(joint.key, Number(event.target.value));
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
