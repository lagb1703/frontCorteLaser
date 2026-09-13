import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  applyBendRotation,
  findBendJoints,
  toSignedDegrees,
  type BendControlValue,
  type BendJoint,
} from "../utils/bendJoints";

interface Render3DProps {
  file: Blob;
  thickness: number;
  bendValues: Record<string, BendControlValue>;
  onBendJointsChange: (joints: BendJoint[]) => void;
}

function GridFloor() {
  return (
    <gridHelper args={[20, 20, 0x888888, 0x444444]} position={[0, -2, 0]} />
  );
}

function LoadingIndicator() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 2;
      ref.current.rotation.y += delta * 2;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#22d3ee" wireframe />
    </mesh>
  );
}

/**
 * Centre and scale the loaded scene inside a wrapper so the normalisation never
 * touches the model's own transforms, which carry the bend pivots.
 */
function normalizeModel(scene: THREE.Group): THREE.Group {
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  scene.position.copy(center).negate();

  const wrapper = new THREE.Group();
  wrapper.add(scene);
  wrapper.scale.setScalar(maxDim > 0 ? 5 / maxDim : 1);
  // the exporter works in the XY plane and extrudes along +Z, so lay it flat
  wrapper.rotation.x = -Math.PI / 2;
  return wrapper;
}

function GLBModel({
  blob,
  thickness,
  bendValues,
  onBendJointsChange,
}: {
  blob: Blob;
  thickness: number;
  bendValues: Record<string, BendControlValue>;
  onBendJointsChange: (joints: BendJoint[]) => void;
}) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [bendJoints, setBendJoints] = useState<BendJoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<THREE.Group>(null!);
  const modelRef = useRef<THREE.Group | null>(null);
  const onBendJointsChangeRef = useRef(onBendJointsChange);

  useEffect(() => {
    onBendJointsChangeRef.current = onBendJointsChange;
  }, [onBendJointsChange]);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    const loader = new GLTFLoader();
    let cancelled = false;

    loader.load(
      url,
      (gltf) => {
        if (cancelled) return;

        try {
          const joints = findBendJoints(gltf.scene);
          setBendJoints(joints);
          onBendJointsChangeRef.current(joints);
          setError(null);
          const normalized = normalizeModel(gltf.scene);
          modelRef.current = normalized;
          setModel(normalized);
          setLoading(false);
        } catch {
          setBendJoints([]);
          onBendJointsChangeRef.current([]);
          setError("Error processing 3D model");
          setLoading(false);
        }
      },
      undefined,
      () => {
        if (cancelled) return;

        setBendJoints([]);
        onBendJointsChangeRef.current([]);
        setError("Error loading 3D model");
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  useEffect(() => {
    const current = modelRef.current;
    if (current == null) return;
    // A non-uniform scale on an ancestor shears anything that rotates under it,
    // so it is only safe on a flat part with no folds.
    current.scale.z = bendJoints.length > 0 ? current.scale.x : thickness;
  }, [model, bendJoints, thickness]);

  useEffect(() => {
    bendJoints.forEach((joint) => {
      const value = bendValues[joint.key];
      applyBendRotation(joint, value == null ? 0 : toSignedDegrees(value));
    });
  }, [bendJoints, bendValues]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <Html center>
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      </Html>
    );
  }

  if (!model) return null;
  return <primitive ref={ref} object={model} />;
}

export default function Render3D({
  file,
  thickness,
  bendValues,
  onBendJointsChange,
}: Render3DProps) {
  return (
    <div className="relative w-full h-full">
      <Canvas
        className="w-full h-full bg-muted overflow-hidden rounded-md"
        camera={{ position: [5, 3, 5], fov: 50 }}
        shadows
      >
        <color attach="background" args={["#1a1a2e"]} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.3} />

        <GridFloor />
        <GLBModel
          blob={file}
          thickness={thickness}
          bendValues={bendValues}
          onBendJointsChange={onBendJointsChange}
        />

        <OrbitControls
          makeDefault
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.PAN,
            RIGHT: THREE.MOUSE.DOLLY,
          }}
          enableDamping
          dampingFactor={0.1}
          minDistance={2}
          maxDistance={20}
        />
      </Canvas>

      <div className="absolute bottom-3 left-3 bg-black/60 text-white/80 px-3 py-2 rounded-md text-xs space-y-1 pointer-events-none">
        <p className="font-semibold mb-1">Controles</p>
        <p>click izquierdo: rotar</p>
        <p>click del medio: mover</p>
        <p>click derecho: zoom</p>
        <p>Scroll: Zoom</p>
      </div>
    </div>
  );
}
